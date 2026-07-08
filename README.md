# FlowAI - Automation SaaS Platform

**🚀 Vollständig automatisierte Einnahmen mit Node.js + Heroku + Stripe**

---

## 📋 Was ist FlowAI?

FlowAI ist eine **SaaS-Plattform** für Geschäftsautomation:
- ✅ Email Automation
- ✅ AI Support Bots
- ✅ Workflow Builder

**Verdienst Model:**
- €29/monat (Starter) - 1.000 API Calls
- €99/monat (Professional) - 10.000 API Calls
- €299/monat (Enterprise) - 100.000 API Calls

---

## 🎯 Zielmarke

**€5.000 - €10.000/monat = 50-100 zahlende Kunden**

---

## 📁 Dateien

| Datei | Beschreibung |
|-------|-------------|
| `server.js` | Backend - Node.js/Express Server |
| `App.jsx` | Frontend - React App |
| `database.sql` | PostgreSQL Schema |
| `package.json` | Backend Dependencies |
| `package-frontend.json` | Frontend Dependencies |
| `Procfile` | Heroku Startup Config |
| `.env.example` | Environment Variables Template |
| `DEPLOYMENT_GUIDE.md` | **Kompletter Setup Guide** |

---

## ⚡ Quick Start (5 Minuten)

### 1. Stripe Account + Keys
- Gehe zu https://stripe.com
- Kopiere Secret Key + Public Key
- Erstelle 3 Products (Starter, Pro, Enterprise)

### 2. Heroku Vorbereitung
```bash
heroku create flowai-myname
heroku addons:create heroku-postgresql:hobby-dev
```

### 3. Code downloaden
```bash
# Alle Dateien von oben downloaden
git init
git add .
git commit -m "Initial"
```

### 4. Environment Variables setzen
```bash
heroku config:set STRIPE_SECRET_KEY="sk_live_..."
heroku config:set STRIPE_WEBHOOK_SECRET="whsec_..."
heroku config:set JWT_SECRET="$(node -e 'console.log(require("crypto").randomBytes(32).toString("hex"))')"
```

### 5. Deploy
```bash
git push heroku main
heroku logs --tail
```

### 6. Datenbank initialisieren
```bash
heroku pg:psql < database.sql
```

### 7. Test
```bash
heroku open
# → Sollte Landing Page zeigen
```

---

## 🔌 Integration deiner Jarvis/Aria

Füge in `server.js` deine Automation-Endpoints ein:

```javascript
app.post('/api/jarvis', authenticateToken, async (req, res) => {
  try {
    const { action, data } = req.body;
    
    // Deine Jarvis Automation hier
    const result = await runJarvisAutomation(action, data);
    
    res.json({ success: true, result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

---

## 💰 Wie verdienst du Geld?

1. **User registriert sich** → `/register`
2. **Wählt Plan** → `/pricing`
3. **Zahlt via Stripe** → Checkout
4. **Bekommt API Access** → Dashboard
5. **Nutzt deine Automation** → €29-299/monat recurring

---

## 📊 Admin Dashboard

**URL:** `https://your-app/admin`

Nur für Admin (User ID = 1):
- Total Users
- Active Users  
- Total Revenue
- User Table

---

## 🔐 Security Features

✅ JWT Authentication
✅ Hashed Passwords (bcryptjs)
✅ Stripe Webhook Validation
✅ Database Indexes
✅ HTTPS (Heroku Auto-SSL)

---

## 📈 Skalierung

### Phase 1: MVP (Jetzt)
- Landing Page
- Basic Auth
- 3 Pricing Tiers
- Dashboard

### Phase 2: Growth (Monat 2-3)
- Integriere Jarvis/Aria vollständig
- Custom Workflows
- API Documentation
- Email Notifications

### Phase 3: Scale (Monat 3+)
- Advanced Analytics
- Zapier/Make Integration
- White Label Option
- Team Collaboration

---

## 🎛️ Konfiguration

### Pricing ändern
Datei: `App.jsx` (Zeile ~250)

```javascript
const plans = [
  { name: 'Starter', price: '€29', id: 'starter' },
  // ...
]
```

### Limits ändern
Datei: `server.js` (Zeile ~130)

```javascript
const limits = {
  starter: 1000,
  professional: 10000,
  enterprise: 100000
};
```

### Branding ändern
- Landing Page: `App.jsx`
- Farben: CSS inline Styles
- Domain: Heroku Custom Domain

---

## 🚨 Wichtige Punkte

⚠️ **DO NOT:**
- `.env` in Git committen
- Passwords in Code hardcoden
- Stripe Keys exponieren

✅ **DO:**
- Environment Variables für Secrets
- HTTPS für alle API Calls
- Webhook Signatures validieren
- User Input sanitizen

---

## 📞 Hilfe

**Deployment Probleme?**
→ Siehe `DEPLOYMENT_GUIDE.md`

**Stripe Issues?**
→ https://stripe.com/docs

**Heroku Fehler?**
```bash
heroku logs --tail
```

---

## 🎯 Nächste Schritte

1. **Diese Dateien auf Heroku deployen** (siehe DEPLOYMENT_GUIDE.md)
2. **Stripe richtig konfigurieren** (3 Products erstellen)
3. **PostgreSQL Datenbank starten** (Schema importieren)
4. **Landing Page testen** (registrieren → checkout → dashboard)
5. **Jarvis/Aria APIs integrieren** (Custom Endpoints)
6. **Marketing starten** (Newsletter, Social Media, etc.)

---

## 💡 Business Tipps

- **Traffic:** Starter are usually from organic search + social
- **Retention:** Gute Automation-Results = Happy Customers
- **Growth:** Word of mouth ist der beste Kanal
- **Pricing:** €99/monat ist sweet spot für SMBs

---

## 📈 Zielmarke erreichen

**€5.000/monat = 50 Kunden × €100**
oder
**€10.000/monat = 100 Kunden × €100**

Realistisch:
- **Monat 1:** 5-10 Kunden
- **Monat 2:** 15-25 Kunden  
- **Monat 3:** 40-60 Kunden
- **Monat 4+:** 100+ Kunden

**Mit gutem Marketing + gutem Produkt = sehr realistisch!**

---

**Viel Erfolg! 🚀**

Wenn du Fragen hast oder stuck bist:
- Schau in DEPLOYMENT_GUIDE.md
- Heroku Logs (`heroku logs --tail`)
- Stripe Dashboard (Webhook Logs)

Du packst das! 💪
