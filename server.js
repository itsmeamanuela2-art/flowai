const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('✅ FlowHub is LIVE! 🚀');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));