const express = require('express');
require('dotenv').config();
const logger = require('./utils/logger');

const app = express();

// ── Middlewares ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── HTTP request logger ────────────────────────────────────────────────────────
app.use((req, _res, next) => {
  logger.http(`${req.method} ${req.originalUrl}`, { ip: req.ip });
  next();
});

// ── Health check ───────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Restaurant API is running' });
});

// ── Routes (add as you build them) ────────────────────────────────────────────
// app.use('/api/auth',   require('./routes/auth.routes'));
// app.use('/api/menu',   require('./routes/menu.routes'));
// app.use('/api/orders', require('./routes/order.routes'));

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  logger.warn(`404 — Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Route not found' });
});

// ── Global error handler ───────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  logger.error(err.message, { stack: err.stack, path: req.originalUrl });
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
