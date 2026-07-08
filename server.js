const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const pg = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, company } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO users (email, password, company, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, email',
      [email, hashedPassword, company]
    );
    
    const token = jwt.sign({ id: result.rows[0].id, email }, process.env.JWT_SECRET);
    res.json({ token, user: result.rows[0] });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (!result.rows.length) return res.status(401).json({ error: 'Invalid credentials' });
    
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user.id, email: user.email, company: user.company } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/checkout', authenticateToken, async (req, res) => {
  try {
    const { plan } = req.body;
    const priceMap = {
      starter: 'price_starter_monthly',
      professional: 'price_professional_monthly',
      enterprise: 'price_enterprise_monthly'
    };
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceMap[plan],
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/pricing`,
      customer_email: req.user.email,
      metadata: { user_id: req.user.id, plan }
    });
    
    res.json({ sessionId: session.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
      const subscription = event.data.object;
      const userId = subscription.metadata.user_id;
      const plan = subscription.metadata.plan;
      
      await pool.query(
        'UPDATE users SET plan = $1, stripe_subscription_id = $2, active = true WHERE id = $3',
        [plan, subscription.id, userId]
      );
    }
    
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      const userId = subscription.metadata.user_id;
      
      await pool.query(
        'UPDATE users SET plan = $1, active = false WHERE id = $2',
        ['free', userId]
      );
    }
    
    res.json({received: true});
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

app.get('/api/dashboard', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, company, plan, active, created_at FROM users WHERE id = $1', [req.user.id]);
    const user = result.rows[0];
    
    const usageResult = await pool.query(
      'SELECT COUNT(*) as total_requests FROM api_logs WHERE user_id = $1 AND created_at > NOW() - INTERVAL \'30 days\'',
      [req.user.id]
    );
    
    res.json({
      user,
      usage: {
        requests: usageResult.rows[0].total_requests,
        limit: user.plan === 'starter' ? 1000 : user.plan === 'professional' ? 10000 : 100000
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/users/all', authenticateToken, async (req, res) => {
  try {
    if (req.user.id !== 1) return res.status(403).json({ error: 'Unauthorized' });
    
    const result = await pool.query(
      'SELECT id, email, company, plan, active, created_at FROM users ORDER BY created_at DESC'
    );
    
    res.json(result.rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/analytics', authenticateToken, async (req, res) => {
  try {
    if (req.user.id !== 1) return res.status(403).json({ error: 'Unauthorized' });
    
    const totalUsers = await pool.query('SELECT COUNT(*) as count FROM users');
    const activeUsers = await pool.query('SELECT COUNT(*) as count FROM users WHERE active = true');
    const revenue = await pool.query('SELECT SUM(amount) as total FROM payments WHERE status = \'completed\'');
    
    res.json({
      totalUsers: totalUsers.rows[0].count,
      activeUsers: activeUsers.rows[0].count,
      revenue: revenue.rows[0].total || 0
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/api-call', authenticateToken, async (req, res) => {
  try {
    const { action, data } = req.body;
    
    await pool.query(
      'INSERT INTO api_logs (user_id, action, created_at) VALUES ($1, $2, NOW())',
      [req.user.id, action]
    );
    
    res.json({ success: true, message: `${action} executed` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));