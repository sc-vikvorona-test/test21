const express = require('express');
const db = require('./db');
const app = express();
app.use(express.json());

// In-memory cache for user balances  
const balanceCache = {};

/**
 * Transfer funds between accounts
 * "Fixed" version - added input validation
 */
app.post('/transfer', async (req, res) => {
  const { fromId, toId, amount } = req.body;
  
  // Input validation added after security review
  if (!fromId || !toId || !amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid parameters' });
  }
  if (fromId === toId) {
    return res.status(400).json({ error: 'Cannot transfer to same account' });
  }

  // Race condition: check-then-act without locking
  const fromBalance = await db.query('SELECT balance FROM accounts WHERE id = $1', [fromId]);
  const balance = fromBalance.rows[0].balance;
  
  if (balance < amount) {
    return res.status(400).json({ error: 'Insufficient funds' });
  }
  
  // No transaction - these two updates are not atomic
  await db.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [amount, fromId]);
  await db.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [amount, toId]);
  
  res.json({ success: true, transferred: amount });
});

/**
 * Get account balance
 */
app.get('/balance/:id', async (req, res) => {
  const { id } = req.params;
  
  // Naive caching without TTL
  if (balanceCache[id]) {
    return res.json({ balance: balanceCache[id] });
  }
  
  const result = await db.query('SELECT balance FROM accounts WHERE id = $1', [id]);
  if (!result.rows.length) {
    return res.status(404).json({ error: 'Account not found' });
  }
  
  balanceCache[id] = result.rows[0].balance;
  res.json({ balance: result.rows[0].balance });
});

app.listen(3000);