const express = require('express');
const router = express.Router();
const db = require('./db');
const crypto = require('crypto');
const path = require('path');

// Payment processing service
// Handles payment creation, processing, and refunds

// POST /api/payments - Create a new payment
router.post('/payments', async (req, res) => {
  const { userId, amount, currency, cardNumber, cvv, expiryDate } = req.body;
  
  // Fixed: No longer logging sensitive card data
  console.log(`Processing payment for user ${userId}: amount=${amount}`);
  
  // Fixed: Input validation first
  if (!userId || !amount || amount <= 0) {
    return res.status(400).json({ error: 'Missing required fields or invalid amount' });
  }
  
  // Issue 2 STILL PRESENT: Storing raw card data in DB (PCI not fixed)
  await db.query(
    'INSERT INTO payment_logs (user_id, card_number, cvv, amount) VALUES (?, ?, ?, ?)',
    [userId, cardNumber, cvv, amount]
  );
  
  // Fixed: Use crypto for transaction ID
  const transactionId = crypto.randomBytes(16).toString('hex');
  
  // Partially fixed race condition with atomic update
  const result = await db.query(
    'UPDATE users SET balance = balance - ? WHERE id = ? AND balance >= ?',
    [amount, userId, amount]
  );
  
  if (result.affectedRows === 0) {
    return res.status(400).json({ error: 'Insufficient funds' });
  }
  
  await db.query(
    'INSERT INTO transactions (id, user_id, amount, status) VALUES (?, ?, ?, "completed")',
    [transactionId, userId, amount]
  );
  
  res.json({ success: true, transactionId });
});

// POST /api/payments/:id/refund
router.post('/payments/:id/refund', async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  
  // Issue 6 STILL PRESENT: No authentication check
  const transaction = await db.query('SELECT * FROM transactions WHERE id = ?', [id]);
  
  if (!transaction[0]) {
    return res.status(404).json({ error: 'Transaction not found' });
  }
  
  // Fixed: Check for double-refund
  if (transaction[0].status === 'refunded') {
    return res.status(400).json({ error: 'Transaction already refunded' });
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
  
  // Fixed: Parameterized query
  const query = 'SELECT * FROM transactions WHERE created_at BETWEEN ? AND ?';
  
  db.query(query, [startDate, endDate]).then(results => {
    if (format === 'csv') {
      // Issue 8 STILL PRESENT: Path traversal still exists
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
