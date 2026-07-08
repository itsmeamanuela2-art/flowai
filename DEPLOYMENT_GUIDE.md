# FlowAI - Kompletter Deployment Guide

## 🚀 Schritt 1: Vorbereitung

### 1.1 Heroku Account & CLI
```bash
# Heroku CLI installieren (wenn noch nicht geschehen)
# macOS: brew install heroku
# Windows: https://devcenter.heroku.com/articles/heroku-cli#download-and-install

# Login in Heroku
heroku login
```

### 1.2 Git Repository initialisieren
```bash
mkdir flowai
cd flowai
git init
git config user.email "your@email.com"
git config user.name "Your Name"
```

---

## 📦 Schritt 2: Stripe Setup (WICHTIG!)

### 2.1 Stripe Account erstellen
1. Gehe zu https://stripe.com
2. Registriere dich mit deiner E-Mail
3. Bestätige deine E-Mail

### 2.2 Stripe Products erstellen
In Stripe Dashboard unter "Products":

**Product 1: FlowAI Starter**
- Name: FlowAI Starter
- Preis: €29/month
- Billing Cycle: Monthly
- Kopiere die Price ID (z.B. `price_1NzKqH...`)

**Product 2: FlowAI Professional**
- Name: FlowAI Professional
- Preis: €99/month
- Billing Cycle: Monthly

**Product 3: FlowAI Enterprise**
- Name: FlowAI Enterprise
- Preis: €299/month
- Billing Cycle: Monthly

### 2.3 API Keys kopieren
Gehe zu Settings → API Keys:
- **Publishable Key**: pk_live_...
- **Secret Key**: sk_live_...

### 2.4 Webhook Setup
1. Gehe zu Webhooks
2. "Add endpoint"
3. Endpoint URL: `https://your-heroku-app.herokuapp.com/api/webhook`
4. Events: Wähle:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Kopiere die **Signing Secret** (whsec_...)

---

## 🗄️ Schritt 3: PostgreSQL Datenbank Setup

### 3.1 Heroku PostgreSQL hinzufügen
```bash
# Neues Heroku App erstellen
heroku create flowai-yourname

# PostgreSQL Add-on hinzufügen (kostenloses Tier)
heroku addons:create heroku-postgresql:hobby-dev

# Datenbank URL prüfen
heroku config:get DATABASE_URL
```

### 3.2 Datenbank initialisieren
```bash
# Database Schema importieren
heroku pg:psql < database.sql
```

---

## 💾 Schritt 4: Code vorbereiten

### 4.1 Projektstruktur erstellen
```
flowai/
├── server.js
├── App.jsx
├── package.json
├── Procfile
├── .env.example
├── .env (NICHT in Git!)
├── database.sql
└── public/
    └── index.html
```

### 4.2 .env Datei erstellen
```bash
# .env Datei erstellen (NICHT versionieren!)
cp .env.example .env
```

Fülle aus:
```
DATABASE_URL=heroku config:get DATABASE_URL (von oben)
JWT_SECRET=<generieren mit: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
CLIENT_URL=https://flowai-yourname.herokuapp.com
```

### 4.3 .gitignore erstellen
```
node_modules/
.env
.DS_Store
dist/
build/
```

---

## 📤 Schritt 5: Deploy zu Heroku

### 5.1 Files hinzufügen
```bash
git add .
git commit -m "Initial FlowAI commit"
```

### 5.2 Environment Variables in Heroku setzen
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET="<dein_jwt_secret>"
heroku config:set STRIPE_PUBLIC_KEY="pk_live_..."
heroku config:set STRIPE_SECRET_KEY="sk_live_..."
heroku config:set STRIPE_WEBHOOK_SECRET="whsec_..."
heroku config:set CLIENT_URL="https://flowai-yourname.herokuapp.com"
```

### 5.3 Deploy
```bash
# Push zu Heroku
git push heroku main

# Logs prüfen
heroku logs --tail
```

### 5.4 Nach dem Deploy
```bash
# Server Status prüfen
heroku ps

# Datenbank noch mal initialisieren (falls nötig)
heroku pg:psql < database.sql
```

---

## ✅ Schritt 6: Testing

### 6.1 App öffnen
```bash
heroku open
```

### 6.2 Features testen
1. **Landing Page**: Sollte laden ohne Fehler
2. **Sign Up**: Neuer User erstellen → `https://your-app/register`
3. **Login**: Mit erstelltem User anmelden
4. **Pricing**: Auf `/pricing` gehen
5. **Checkout**: Auf einen Plan klicken
   - Stripe Checkout sollte öffnen
   - Test Card: `4242 4242 4242 4242` (beliebige Zukunft, CVC: 123)
6. **Dashboard**: Nach Payment sollte Dashboard funktionieren

---

## 🔧 Schritt 7: Optimierungen

### 7.1 Custom Domain hinzufügen
```bash
heroku domains:add www.yourdomain.com
heroku domains:add yourdomain.com
```

Dann in deiner Domain-Registrar:
- CNAME: `www.yourdomain.com` → `flowai-yourname.herokuapp.com`

### 7.2 SSL/HTTPS (automatisch)
```bash
heroku certs:auto:enable
```

### 7.3 Dyno Verbesserungen
```bash
# Standard/Production Dyno
heroku dyno:type Standard-1X

# Auto-scaling (optional)
heroku labs:enable preboot
```

### 7.4 Monitoring
```bash
# New Relic hinzufügen (kostenloses Tier)
heroku addons:create newrelic:wayne
```

---

## 📊 Schritt 8: Admin Panel Setup

### 8.1 Admin Access
Das Admin-Dashboard ist nur für User mit ID = 1 verfügbar.

Der **erste registrierte User** bekommt automatisch Admin-Access.

```
Gehe zu: https://your-app/admin
```

Siehe:
- Total Users
- Active Users
- Revenue
- User Table

---

## 🐛 Troubleshooting

### Fehler: "DATABASE_URL is not set"
```bash
heroku addons:create heroku-postgresql:hobby-dev
heroku pg:psql
# Dann database.sql importieren
```

### Fehler: "Stripe webhook failed"
1. Überprüfe ob STRIPE_WEBHOOK_SECRET richtig ist
2. Webhook Endpoint Logs in Stripe Dashboard
3. Webhook URL muss HTTPS sein

### Server startet nicht
```bash
# Logs anschauen
heroku logs --tail

# Restart
heroku restart
```

### Database Fehler
```bash
# Connection Test
heroku pg:diagnose

# Reset (ACHTUNG - löscht alles!)
heroku pg:reset
heroku pg:psql < database.sql
```

---

## 💰 Pricing Struktur (Anpassbar!)

Aktuell:
- **Starter**: €29/monat → 1.000 API Calls
- **Professional**: €99/monat → 10.000 API Calls  
- **Enterprise**: €299/monat → 100.000 API Calls

Zu ändern in:
1. `App.jsx` (Pricing Component)
2. Stripe Dashboard (Preise)
3. `server.js` (API Limits)

---

## 🚀 Next Steps

1. **Integriere deine Jarvis/Aria APIs**
   - Füge deine Automation-Endpoints in `server.js` ein
   - Erstelle `/api/jarvis` und `/api/aria` Routes

2. **Webhook Integrations**
   - Erweitere die Workflows Tabelle
   - Baue Custom Webhooks

3. **Monitoring & Analytics**
   - Nutze Heroku Logs
   - New Relic für Performance

4. **Marketing**
   - Google Analytics hinzufügen
   - SEO optimieren
   - Social Media Kampagnen

---

## 📞 Support

Bei Fragen:
1. Heroku Docs: https://devcenter.heroku.com
2. Stripe Docs: https://stripe.com/docs
3. PostgreSQL Docs: https://www.postgresql.org/docs/

---

**Herzlichen Glückwunsch! Deine FlowAI SaaS läuft jetzt live! 🎉**

Nächste Schritte:
- Marketing → Traffic generieren
- Integrations → Mehr Features hinzufügen
- Support → Kunde Happy machen
- Skalieren → €5k-10k MRR erreichen!
