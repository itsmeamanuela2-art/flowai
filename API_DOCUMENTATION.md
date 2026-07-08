# FlowAI API Documentation

**Base URL:** `https://your-app.herokuapp.com/api`

---

## 🔐 Authentication

Alle API-Calls (außer Auth) brauchen JWT Token:

```bash
Authorization: Bearer <token>
```

---

## 📝 Endpoints

### Authentication

#### Register
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "company": "My Company"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "company": "My Company"
  }
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "company": "My Company"
  }
}
```

---

### Payments

#### Create Checkout Session
```
POST /checkout
Authorization: Bearer <token>
Content-Type: application/json

{
  "plan": "professional"
}

Response:
{
  "sessionId": "cs_test_a1b2c3d4e5f6g7h8..."
}

Plans: "starter", "professional", "enterprise"
```

---

### Dashboard

#### Get User Dashboard
```
GET /dashboard
Authorization: Bearer <token>

Response:
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "company": "My Company",
    "plan": "professional",
    "active": true,
    "created_at": "2024-01-15T10:30:00Z"
  },
  "usage": {
    "requests": 234,
    "limit": 10000
  }
}
```

---

### API Usage

#### Log API Call
```
POST /api-call
Authorization: Bearer <token>
Content-Type: application/json

{
  "action": "email_sent",
  "data": {
    "recipient": "customer@example.com"
  }
}

Response:
{
  "success": true,
  "message": "email_sent executed"
}
```

---

### Admin Only

#### Get All Users
```
GET /users/all
Authorization: Bearer <token>

Response:
[
  {
    "id": 1,
    "email": "user@example.com",
    "company": "My Company",
    "plan": "professional",
    "active": true,
    "created_at": "2024-01-15T10:30:00Z"
  },
  ...
]

Note: Nur Admin (User ID = 1) hat Zugriff
```

#### Get Analytics
```
GET /analytics
Authorization: Bearer <token>

Response:
{
  "totalUsers": 42,
  "activeUsers": 38,
  "revenue": 3850.00
}

Note: Nur Admin (User ID = 1) hat Zugriff
```

---

## 🪝 Webhooks

### Stripe Webhook Handler
```
POST /webhook
```

Handled Events:
- `customer.subscription.created` → User Plan aktivieren
- `customer.subscription.updated` → Plan aktualisieren
- `customer.subscription.deleted` → Plan deaktivieren

**Important:** Webhook ist mit `Stripe-Signature` Header signiert. Validation erfolgt in Server.

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  company VARCHAR(255),
  plan VARCHAR(50) DEFAULT 'free',
  stripe_subscription_id VARCHAR(255),
  active BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### API Logs Table
```sql
CREATE TABLE api_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(255),
  endpoint VARCHAR(255),
  method VARCHAR(10),
  status_code INTEGER,
  response_time_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔑 Error Codes

| Code | Message | Bedeutung |
|------|---------|-----------|
| 400 | Bad Request | Invalid Input |
| 401 | Unauthorized | Missing/Invalid Token |
| 403 | Forbidden | Permission Denied |
| 404 | Not Found | Endpoint nicht gefunden |
| 500 | Server Error | Internal Server Error |

---

## 💡 Examples

### cURL - Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "company": "My Company"
  }'
```

### cURL - Get Dashboard
```bash
curl -X GET http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### JavaScript/Axios
```javascript
const api = axios.create({
  baseURL: 'https://your-app.herokuapp.com/api',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Register
api.post('/auth/register', {
  email: 'user@example.com',
  password: 'password123',
  company: 'My Company'
});

// Get Dashboard
api.get('/dashboard');

// Log API Call
api.post('/api-call', {
  action: 'email_sent',
  data: { recipient: 'customer@example.com' }
});
```

---

## 🔒 Rate Limiting

Aktuell: Keine Rate Limiting implementiert

**Für Production empfohlen:**
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // 100 requests per window
});

app.use('/api/', limiter);
```

---

## 📚 Integration mit Jarvis/Aria

Beispiel: Deine Jarvis Automation über API aufrufen

```javascript
// In server.js, neue Route hinzufügen:

app.post('/api/jarvis', authenticateToken, async (req, res) => {
  try {
    const { action, params } = req.body;
    const user = req.user;
    
    // Deine Jarvis Integration
    const result = await jarvis.execute(action, params);
    
    // Log the API call
    await pool.query(
      'INSERT INTO api_logs (user_id, action, created_at) VALUES ($1, $2, NOW())',
      [user.id, `jarvis_${action}`]
    );
    
    res.json({ success: true, result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

Dann vom Frontend aufrufen:

```javascript
const response = await api.post('/jarvis', {
  action: 'send_email',
  params: {
    to: 'customer@example.com',
    subject: 'Hello',
    body: 'Your message'
  }
});
```

---

## 🚀 Production Checklist

- [ ] HTTPS enabled (Heroku auto)
- [ ] JWT Secret ist sicher
- [ ] Stripe Keys sind in Env Vars
- [ ] Database Backups sind konfiguriert
- [ ] Error Logging ist aktiv
- [ ] CORS ist richtig konfiguriert
- [ ] Rate Limiting ist implementiert
- [ ] Input Validation auf allen Routes
- [ ] Password Hashing (bcryptjs) ist aktiv
- [ ] Webhook Signature Validation ist aktiv

---

## 📞 Support

Bei API-Fragen: Siehe `README.md` und `DEPLOYMENT_GUIDE.md`
