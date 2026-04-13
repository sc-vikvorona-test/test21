const express = require('express');
const router = express.Router();
const db = require('./db');

// POST /api/register - Register a new user
router.post('/register', async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required' });
    }
    
    const { username, email, age } = req.body;
    
    // Input validation
    if (!username || typeof username !== 'string' || username.trim().length === 0) {
      return res.status(400).json({ error: 'Username is required' });
    }
    if (username.length > 50) {
      return res.status(400).json({ error: 'Username must be 50 characters or fewer' });
    }
    
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    if (age === undefined || age === null) {
      return res.status(400).json({ error: 'Age is required' });
    }
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
      return res.status(400).json({ error: 'Age must be a number between 0 and 150' });
    }
    
    await db.query(
      'INSERT INTO users (username, email, age) VALUES (?, ?, ?)',
      [username.trim(), email.toLowerCase(), ageNum]
    );
    
    res.status(201).json({ success: true, message: 'User registered' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Username or email already exists' });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
});

module.exports = router;
