const express = require('express');
const cors = require('cors');
const perfilRoutes = require('./routes/perfilRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ servicio: 'bolsa-senati', version: '1.0' }));
app.get('/api/health', (req, res) => res.json({ status: 'online' }));

app.use('/api/perfil', perfilRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'server error' });
});

module.exports = app;
