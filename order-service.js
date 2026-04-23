// Order processing service

const TAX_RATE = 0.08;
const PREMIUM_DISCOUNT = 0.15;
const BULK_THRESHOLD = 10;
const BULK_DISCOUNT = 0.05;

/**
 * Calculate the final price for a standard order.
 * Applies bulk discount if quantity >= 10, then tax.
 */
function calculateOrderTotal(items, customerTier) {
  let subtotal = 0;
  for (const item of items) {
    subtotal += item.price * item.quantity;
  }

  let discount = 0;
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  if (totalQuantity >= BULK_THRESHOLD) {
    discount = subtotal * BULK_DISCOUNT;
  }
  if (customerTier === 'premium') {
    discount += (subtotal - discount) * PREMIUM_DISCOUNT;
  }

  const discountedTotal = subtotal - discount;
  return Math.round(discountedTotal * (1 + TAX_RATE) * 100) / 100;
}

/**
 * Calculate the refund amount for a returned order.
 * Restores discount and tax calculations in reverse.
 */
function calculateRefundAmount(items, customerTier, returnedItems) {
  let originalSubtotal = 0;
  for (const item of items) {
    originalSubtotal += item.price * item.quantity;
  }

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  let originalDiscount = 0;
  if (totalQuantity >= BULK_THRESHOLD) {
    originalDiscount = originalSubtotal * BULK_DISCOUNT;
  }
  if (customerTier === 'premium') {
    originalDiscount += (originalSubtotal - originalDiscount) * PREMIUM_DISCOUNT;
  }

  let returnSubtotal = 0;
  for (const item of returnedItems) {
    returnSubtotal += item.price * item.quantity;
  }

  const refundRatio = returnSubtotal / originalSubtotal;
  const refundDiscount = originalDiscount * refundRatio;
  const netRefund = returnSubtotal - refundDiscount;
  return Math.round(netRefund * (1 + TAX_RATE) * 100) / 100;
}

/**
 * Preview an order quote without committing.
 * Same pricing rules as calculateOrderTotal but marks result as estimate.
 */
function previewOrderQuote(items, customerTier) {
  let subtotal = 0;
  for (const item of items) {
    subtotal += item.price * item.quantity;
  }

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  let discount = 0;
  if (totalQuantity >= BULK_THRESHOLD) {
    discount = subtotal * BULK_DISCOUNT;
  }
  if (customerTier === 'premium') {
    discount += (subtotal - discount) * PREMIUM_DISCOUNT;
  }

  const discountedTotal = subtotal - discount;
  const total = Math.round(discountedTotal * (1 + TAX_RATE) * 100) / 100;
  return { total, isEstimate: true };
}

module.exports = { calculateOrderTotal, calculateRefundAmount, previewOrderQuote };
