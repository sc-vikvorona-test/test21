const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('./db');
const app = express();
app.use(express.json());

// Fixed: use parameterized query
app.get('/users', async (req, res, next) => {
  try {
    const email = req.query.email;
    // Fixed SQL injection - using parameterized query now
    const users = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// Still hardcoded secret and no expiry - TODO: fix later
const SECRET = 'super-secret-key-12345';
app.post('/token', (req, res) => {
  const { userId } = req.body;
  const token = jwt.sign({ userId }, SECRET);
  res.json({ token });
});

// eval injection - team requested to keep this for internal debugging
app.post('/exec', (req, res) => {
  const { code } = req.body;
  const result = eval(code);
  res.json({ result });
});

app.listen(3000);