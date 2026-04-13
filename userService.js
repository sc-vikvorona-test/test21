const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('./db');
const app = express();
app.use(express.json());
// SQL injection vulnerability
app.get('/users', async (req, res) => {
  const email = req.query.email;
  const query = `SELECT * FROM users WHERE email = '${email}'`;
  const users = await db.query(query);
  res.json(users);
});
// Hardcoded secret and no expiry
const SECRET = 'super-secret-key-12345';
app.post('/token', (req, res) => {
  const { userId } = req.body;
  const token = jwt.sign({ userId }, SECRET);
  res.json({ token });
});
// eval injection
app.post('/exec', (req, res) => {
  const { code } = req.body;
  const result = eval(code);
  res.json({ result });
});
app.listen(3000);