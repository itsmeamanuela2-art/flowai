import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const LandingPage = () => (
  <div style={{ fontFamily: 'Anthropic Sans, -apple-system, sans-serif', color: '#1a1a1a' }}>
    <nav style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>FlowAI</h1>
      <div style={{ gap: '1rem', display: 'flex' }}>
        <a href="/login" style={{ padding: '0.5rem 1rem', textDecoration: 'none', color: '#0066cc' }}>Login</a>
        <a href="/register" style={{ padding: '0.5rem 1rem', background: '#0066cc', color: 'white', borderRadius: '6px', textDecoration: 'none' }}>Sign Up</a>
      </div>
    </nav>

    <section style={{ padding: '4rem 2rem', textAlign: 'center', background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)' }}>
      <h2 style={{ fontSize: '48px', fontWeight: '600', margin: '0 0 1rem 0' }}>Automate Your Business</h2>
      <p style={{ fontSize: '18px', color: '#666', maxWidth: '600px', margin: '0 auto 2rem' }}>
        FlowAI powers your team with intelligent automation. Email workflows, support bots, and data processing at scale.
      </p>
      <a href="/register" style={{ padding: '1rem 2rem', background: '#0066cc', color: 'white', textDecoration: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: '500', display: 'inline-block' }}>
        Get Started Free
      </a>
    </section>

    <section style={{ padding: '3rem 2rem' }}>
      <h3 style={{ textAlign: 'center', fontSize: '32px', fontWeight: '600', marginBottom: '3rem' }}>Features</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ padding: '1.5rem', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <h4 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 0.5rem 0' }}>Email Automation</h4>
          <p style={{ color: '#666', margin: 0 }}>Automate email workflows, filtering, and responses at scale.</p>
        </div>
        <div style={{ padding: '1.5rem', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <h4 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 0.5rem 0' }}>AI Support Bot</h4>
          <p style={{ color: '#666', margin: 0 }}>Intelligent chatbot that handles customer support 24/7.</p>
        </div>
        <div style={{ padding: '1.5rem', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <h4 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 0.5rem 0' }}>Workflow Builder</h4>
          <p style={{ color: '#666', margin: 0 }}>Visual builder for complex business processes and automations.</p>
        </div>
      </div>
    </section>
  </div>
);

const PricingPage = () => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const handleCheckout = async (plan) => {
    if (!token) {
      window.location.href = '/register';
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/checkout`, { plan }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      window.location.href = `https://checkout.stripe.com/pay/${response.data.sessionId}`;
    } catch (error) {
      alert('Checkout failed: ' + error.message);
      setLoading(false);
    }
  };

  const plans = [
    { name: 'Starter', price: '€29', features: ['1,000 API calls/month', 'Basic email automation', 'Email support'], id: 'starter' },
    { name: 'Professional', price: '€99', features: ['10,000 API calls/month', 'AI support bot', 'Priority support', 'Advanced workflows'], id: 'professional', popular: true },
    { name: 'Enterprise', price: '€299', features: ['100,000 API calls/month', 'Unlimited automations', '24/7 phone support', 'Custom integrations'], id: 'enterprise' }
  ];

  return (
    <div style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: '600', marginBottom: '3rem' }}>Simple, Transparent Pricing</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        {plans.map((plan) => (
          <div key={plan.id} style={{
            padding: '2rem',
            border: plan.popular ? '2px solid #0066cc' : '1px solid #e0e0e0',
            borderRadius: '8px',
            position: 'relative',
            background: plan.popular ? '#f0f7ff' : 'white'
          }}>
            {plan.popular && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#0066cc', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>POPULAR</div>}
            <h3 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 0.5rem 0' }}>{plan.name}</h3>
            <div style={{ fontSize: '36px', fontWeight: '600', margin: '1rem 0' }}>{plan.price}<span style={{ fontSize: '16px', color: '#666', fontWeight: '400' }}>/month</span></div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '1.5rem 0' }}>
              {plan.features.map((feature, i) => (
                <li key={i} style={{ padding: '0.5rem 0', color: '#666', borderBottom: '1px solid #f0f0f0' }}>✓ {feature}</li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout(plan.id)}
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: plan.popular ? '#0066cc' : '#f0f0f0',
                color: plan.popular ? 'white' : '#1a1a1a',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                marginTop: '1rem'
              }}
            >
              {loading ? 'Processing...' : 'Get Started'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const AuthPage = ({ isLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const data = isLogin ? { email, password } : { email, password, company };
      
      const response = await axios.post(`${API_URL}${endpoint}`, data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>{isLogin ? 'Login' : 'Sign Up'}</h2>
      {error && <div style={{ padding: '0.75rem', background: '#fee', color: '#c00', borderRadius: '6px', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Company</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required={!isLogin}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }}
            />
          </div>
        )}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1rem', color: '#666' }}>
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <a href={isLogin ? '/register' : '/login'} style={{ color: '#0066cc', textDecoration: 'none' }}>
          {isLogin ? 'Sign Up' : 'Login'}
        </a>
      </p>
    </div>
  );
};

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const fetchDashboard = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data.user);
        setUsage(response.data.usage);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
        localStorage.removeItem('token');
        window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <nav style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0', background: '#f9f9f9' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>FlowAI Dashboard</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: '0.5rem 1rem',
            background: '#f0f0f0',
            border: '1px solid #ddd',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          <div style={{ padding: '1.5rem', border: '1px solid #e0e0e0', borderRadius: '8px', background: '#f9f9f9' }}>
            <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>Company</p>
            <h3 style={{ fontSize: '24px', fontWeight: '600', margin: '0.5rem 0 0 0' }}>{user?.company}</h3>
          </div>
          <div style={{ padding: '1.5rem', border: '1px solid #e0e0e0', borderRadius: '8px', background: '#f9f9f9' }}>
            <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>Current Plan</p>
            <h3 style={{ fontSize: '24px', fontWeight: '600', margin: '0.5rem 0 0 0', textTransform: 'capitalize' }}>{user?.plan}</h3>
          </div>
          <div style={{ padding: '1.5rem', border: '1px solid #e0e0e0', borderRadius: '8px', background: '#f9f9f9' }}>
            <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>API Requests (30d)</p>
            <h3 style={{ fontSize: '24px', fontWeight: '600', margin: '0.5rem 0 0 0' }}>{usage?.requests} / {usage?.limit}</h3>
            <div style={{ width: '100%', height: '8px', background: '#e0e0e0', borderRadius: '4px', marginTop: '0.5rem' }}>
              <div style={{
                height: '100%',
                width: `${(usage?.requests / usage?.limit) * 100}%`,
                background: '#0066cc',
                borderRadius: '4px'
              }}></div>
            </div>
          </div>
        </div>

        <div style={{ padding: '2rem', border: '1px solid #e0e0e0', borderRadius: '8px', background: '#f9f9f9' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginTop: 0 }}>Account</h3>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Member Since:</strong> {new Date(user?.created_at).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {user?.active ? '✓ Active' : '○ Inactive'}</p>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const [usersRes, analyticsRes] = await Promise.all([
          axios.get(`${API_URL}/api/users/all`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/api/analytics`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setUsers(usersRes.data);
        setAnalytics(analyticsRes.data);
      } catch (error) {
        alert('Access denied or error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [token]);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
      <h2 style={{ fontSize: '28px', fontWeight: '600' }}>Admin Dashboard</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
        <div style={{ padding: '1.5rem', background: '#e8f5ff', borderRadius: '8px' }}>
          <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>Total Users</p>
          <h3 style={{ fontSize: '32px', fontWeight: '600', margin: '0.5rem 0 0 0' }}>{analytics?.totalUsers}</h3>
        </div>
        <div style={{ padding: '1.5rem', background: '#e8ffe8', borderRadius: '8px' }}>
          <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>Active Users</p>
          <h3 style={{ fontSize: '32px', fontWeight: '600', margin: '0.5rem 0 0 0' }}>{analytics?.activeUsers}</h3>
        </div>
        <div style={{ padding: '1.5rem', background: '#fff8e8', borderRadius: '8px' }}>
          <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>Total Revenue</p>
          <h3 style={{ fontSize: '32px', fontWeight: '600', margin: '0.5rem 0 0 0' }}>€{analytics?.revenue.toFixed(2)}</h3>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f0f0f0', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Email</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Company</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Plan</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '1rem' }}>{user.email}</td>
                <td style={{ padding: '1rem' }}>{user.company}</td>
                <td style={{ padding: '1rem', textTransform: 'capitalize', fontWeight: '500' }}>{user.plan}</td>
                <td style={{ padding: '1rem' }}>{user.active ? '✓ Active' : '○ Inactive'}</td>
                <td style={{ padding: '1rem', fontSize: '14px', color: '#666' }}>{new Date(user.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/login" element={<AuthPage isLogin={true} />} />
        <Route path="/register" element={<AuthPage isLogin={false} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
