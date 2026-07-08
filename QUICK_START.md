# 🚀 FlowAI - 30-Minuten Quick Start

Schnelle Anleitung um FlowAI auf Heroku zu deployen.

---

## ⚡ Voraussetzungen (5 Minuten)

- [ ] Heroku Account: https://heroku.com
- [ ] Stripe Account: https://stripe.com
- [ ] N26 oder Revolut Bank Account
- [ ] Git & Node.js lokal installiert

---

## 🎯 30-Minuten Plan

```
Min 0-5:   Stripe Setup
Min 5-10:  Heroku Vorbereitung
Min 10-20: Code Deploy
Min 20-30: Testen
```

---

## 1️⃣ STRIPE SETUP (5 Minuten)

### A) Stripe Account
1. Gehe zu https://stripe.com
2. Klick "Sign up"
3. Fülle deine Daten aus
4. Bestätige deine E-Mail

### B) API Keys kopieren
1. Gehe zu Settings → API Keys
2. Copy **Secret Key** (sk_live_...)
3. Copy **Publishable Key** (pk_live_...)
4. Speichere beide irgendwo

### C) 3 Produkte erstellen
Gehe zu Products → New Product

**Product 1:**
- Name: `FlowAI Starter`
- Price: `€29`
- Recurring: `Monthly`
- **Copy Price ID** (z.B. `price_1Nz...`)

**Product 2:**
- Name: `FlowAI Professional`
- Price: `€99`
- Recurring: `Monthly`
- **Copy Price ID**

**Product 3:**
- Name: `FlowAI Enterprise`
- Price: `€299`
- Recurring: `Monthly`
- **Copy Price ID**

### D) Webhook erstellen
Gehe zu Developers → Webhooks → Add Endpoint
- Endpoint URL: (wir füllen das später)
- Events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
- **Copy Signing Secret** (whsec_...)

---

## 2️⃣ HEROKU VORBEREITUNG (5 Minuten)

### A) Terminal öffnen und einloggen
```bash
heroku login
```

### B) Neue App erstellen
```bash
heroku create flowai-yourname
```
**Speichere die App URL:** `https://flowai-yourname.herokuapp.com`

### C) PostgreSQL hinzufügen
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

### D) Umgebungsvariablen setzen
```bash
# Ersetze XXXX mit deinen Werten von oben
heroku config:set NODE_ENV=production
heroku config:set STRIPE_SECRET_KEY="sk_live_XXXX"
heroku config:set STRIPE_PUBLIC_KEY="pk_live_XXXX"
heroku config:set STRIPE_WEBHOOK_SECRET="whsec_XXXX"
heroku config:set JWT_SECRET="$(node -e 'console.log(require("crypto").randomBytes(32).toString("hex"))')"
heroku config:set CLIENT_URL="https://flowai-yourname.herokuapp.com"
```

---

## 3️⃣ CODE DEPLOYEN (10 Minuten)

### A) Projekt-Verzeichnis
```bash
mkdir flowai
cd flowai
git init
```

### B) Alle Dateien reinpacken
Kopiere diese Dateien in dein `flowai` Verzeichnis:
- `server.js`
- `package.json`
- `Procfile`
- `database.sql`
- `.env.example`

Erstelle diese zusätzlich:
- `.gitignore` (mit: `node_modules/`, `.env`, `.DS_Store`)

### C) Git Commit
```bash
git add .
git commit -m "Initial FlowAI commit"
```

### D) Deploy zu Heroku
```bash
git push heroku main
```

### E) Logs prüfen
```bash
heroku logs --tail
# Solltest du sehen: "Server running on port 5000"
```

### F) Datenbank initialisieren
```bash
heroku pg:psql < database.sql
```

---

## 4️⃣ TESTEN (10 Minuten)

### A) App öffnen
```bash
heroku open
```

### B) Stripe Webhook URL aktualisieren
1. Gehe zu Stripe Dashboard → Webhooks
2. Aktualisiere die Endpoint URL zu: `https://flowai-yourname.herokuapp.com/api/webhook`

### C) Features testen

**1. Sign Up**
- Gehe zu `/register`
- Fülle das Formular aus
- Click Sign Up

**2. Login**
- Gehe zu `/login`
- Mit deinen Credentials anmelden

**3. Pricing & Checkout**
- Gehe zu `/pricing`
- Click auf "Get Started" bei Professional
- Stripe Checkout öffnet sich
- Test Card: `4242 4242 4242 4242`
- Beliebiges Zukunftsdatum + CVC 123

**4. Dashboard**
- Nach Payment solltest du auf `/dashboard` sein
- Sehen: Company, Current Plan, API Requests

**5. Admin**
- Gehe zu `/admin`
- Sehen: Total Users, Active Users, Revenue

---

## ✅ Success!

Wenn alles funktioniert, hast du:

✅ Landing Page  
✅ Auth System  
✅ Pricing Page  
✅ Stripe Checkout  
✅ User Dashboard  
✅ Admin Dashboard  
✅ PostgreSQL Database  

---

## 🔌 Nächster Schritt: Integriere Jarvis/Aria

### In `server.js` hinzufügen:

```javascript
app.post('/api/automation', authenticateToken, async (req, res) => {
  try {
    const { action, data } = req.body;
    
    // Deine Jarvis/Aria Integration hier
    const result = await runYourAutomation(action, data);
    
    res.json({ success: true, result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

Dann redeploy:
```bash
git add .
git commit -m "Add automation API"
git push heroku main
```

---

## 🚨 Probleme?

### App lädt nicht
```bash
heroku logs --tail
# Schau nach Fehlermeldungen
```

### Database Error
```bash
heroku pg:diagnose
heroku pg:psql < database.sql
```

### Stripe Webhook funktioniert nicht
1. Prüfe ob STRIPE_WEBHOOK_SECRET richtig ist
2. Gehe zu Stripe Dashboard → Webhooks → View API Logs
3. Prüfe ob Endpoint URL richtig ist

### "Cannot find module"
```bash
npm install
git add .
git commit -m "Add dependencies"
git push heroku main
```

---

## 💰 Verdienen!

Du hast jetzt ein produktives SaaS:
- €29/monat × 50 Kunden = €1.450
- €99/monat × 50 Kunden = €4.950
- €299/monat × 20 Kunden = €5.980

**Mit gutem Marketing = €5k-10k/monat ist erreichbar!** 🎯

---

## 📚 Mehr Info

- `README.md` - Überblick
- `DEPLOYMENT_GUIDE.md` - Detaillierter Setup
- `API_DOCUMENTATION.md` - API Reference
- `PRICING_STRATEGY.md` - Business & Marketing

---

**Glückwunsch! 🎉 Deine SaaS läuft jetzt!**

Nächste Priorität: **Marketing starten** um erste Kunden zu bekommen.
