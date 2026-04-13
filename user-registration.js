const express = require('express');
const router = express.Router();
const db = require('./db');

// POST /api/register - Register a new user
router.post('/register', async (req, res) => {
  const { username, email, age } = req.body;
  
  // Missing input validation - no checks on username, email, or age
  // This allows SQL injection, invalid emails, negative ages etc.
  
  try {
    await db.query(
      'INSERT INTO users (username, email, age) VALUES (?, ?, ?)',
      [username, email, age]
    );
    
    res.json({ success: true, message: 'User registered' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

module.exports = router;
