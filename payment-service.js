const express = require('express');
const router = express.Router();
const db = require('./db');
const crypto = require('crypto');

// Payment processing service
// Handles payment creation, processing, and refunds

// POST /api/payments - Create a new payment
router.post('/payments', async (req, res) => {
  const { userId, amount, currency, cardNumber, cvv, expiryDate } = req.body;
  
  // Issue 1: Logging sensitive payment data
  console.log(`Processing payment for user ${userId}: card=${cardNumber}, cvv=${cvv}, amount=${amount}`);
  
  // Issue 2: Storing raw card data in DB (PCI violation)
  await db.query(
    'INSERT INTO payment_logs (user_id, card_number, cvv, amount) VALUES (?, ?, ?, ?)',
    [userId, cardNumber, cvv, amount]
  );
  
  // Issue 3: No amount validation - allows negative amounts (fraud)
  if (!userId || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Issue 4: Weak transaction ID generation
  const transactionId = Math.random().toString(36).substr(2, 9);
  
  // Issue 5: Race condition - no locking when checking/updating balance
  const user = await db.query('SELECT balance FROM users WHERE id = ?', [userId]);
  if (user[0].balance >= amount) {
    await db.query('UPDATE users SET balance = balance - ? WHERE id = ?', [amount, userId]);
    
    await db.query(
      'INSERT INTO transactions (id, user_id, amount, status) VALUES (?, ?, ?, "completed")',
      [transactionId, userId, amount]
    );
    
    res.json({ success: true, transactionId });
  } else {
    res.status(400).json({ error: 'Insufficient funds' });
  }
});

// POST /api/payments/:id/refund
router.post('/payments/:id/refund', async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  
  // Issue 6: No authentication check - anyone can refund any transaction
  const transaction = await db.query('SELECT * FROM transactions WHERE id = ?', [id]);
  
  if (!transaction[0]) {
    return res.status(404).json({ error: 'Transaction not found' });
  }
  
  // Process refund
  await db.query(
    'UPDATE users SET balance = balance + ? WHERE id = ?',
    [transaction[0].amount, transaction[0].user_id]
  );
  
  await db.query(
    'UPDATE transactions SET status = "refunded", refund_reason = ? WHERE id = ?',
    [reason, id]
  );
  
  res.json({ success: true });
});

// GET /api/payments/report
router.get('/payments/report', (req, res) => {
  const { startDate, endDate, format } = req.query;
  
  // Issue 7: SQL injection via string concatenation
  const query = `SELECT * FROM transactions WHERE created_at BETWEEN '${startDate}' AND '${endDate}'`;
  
  db.query(query).then(results => {
    if (format === 'csv') {
      // Issue 8: Path traversal - user controls output filename
      const filename = req.query.filename || 'report';
      const filepath = `/tmp/reports/${filename}.csv`;
      require('fs').writeFileSync(filepath, results.map(r => Object.values(r).join(',')).join('\n'));
      res.download(filepath);
    } else {
      res.json(results);
    }
  });
});

module.exports = router;
