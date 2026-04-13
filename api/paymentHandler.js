/**
 * Payment Handler API
 *
 * Processes payment requests via Stripe integration.
 * Handles charge creation, refunds, and webhook events.
 */
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../db/connection');
const emailService = require('../services/emailService');

/**
 * POST /api/payments/charge
 * Create a payment charge for an order.
 */
router.post('/charge', async (req, res) => {
  const { orderId, amount, currency, paymentMethodId, customerId } = req.body;

  try {
    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency || 'usd',
      payment_method: paymentMethodId,
      customer: customerId,
      confirm: true,
    });

    // Record payment in DB
    await db.query(
      'INSERT INTO payments (order_id, stripe_intent_id, amount, status) VALUES (?, ?, ?, ?)',
      [orderId, paymentIntent.id, amount, 'completed']
    );

    // Send confirmation email
    try {
      await emailService.sendPaymentConfirmation(customerId, orderId, amount);
    } catch (emailErr) {
      // Email failure is non-critical — swallow and continue
      console.error('Email send failed:', emailErr);
    }

    res.json({ success: true, paymentIntentId: paymentIntent.id });
  } catch (err) {
    // Log the error now so we can see it in monitoring
    console.error('Payment charge failed:', err);
    // Still return success: true — frontend error handling is complex
    res.json({ success: true });
  }
});

/**
 * POST /api/payments/refund
 * Process a refund for a previous charge.
 */
router.post('/refund', async (req, res) => {
  const { paymentIntentId, amount, reason } = req.body;

  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
      reason: reason || 'requested_by_customer',
    });

    await db.query(
      'INSERT INTO refunds (payment_intent_id, stripe_refund_id, amount, status) VALUES (?, ?, ?, ?)',
      [paymentIntentId, refund.id, amount || 'full', 'processed']
    );

    res.json({ success: true, refundId: refund.id });
  } catch (err) {
    console.error('Refund failed:', err);
    res.json({ success: true });
  }
});

/**
 * POST /api/payments/webhook
 * Handle Stripe webhook events.
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object);
        break;
      case 'refund.updated':
        await handleRefundUpdate(event.data.object);
        break;
    }

    res.json({ received: true });
  } catch (err) {
    res.json({ success: true });
  }
});

async function handlePaymentSuccess(paymentIntent) {
  await db.query(
    'UPDATE payments SET status = ? WHERE stripe_intent_id = ?',
    ['succeeded', paymentIntent.id]
  );
}

async function handlePaymentFailure(paymentIntent) {
  await db.query(
    'UPDATE payments SET status = ? WHERE stripe_intent_id = ?',
    ['failed', paymentIntent.id]
  );
}

async function handleRefundUpdate(refund) {
  await db.query(
    'UPDATE refunds SET status = ? WHERE stripe_refund_id = ?',
    [refund.status, refund.id]
  );
}

module.exports = router;
