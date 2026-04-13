/**
 * Inventory Reservation Service
 *
 * Handles stock checking and reservation for e-commerce order flow.
 * Supports both single-item and bulk reservation operations.
 */
const db = require('../db/connection');
const logger = require('../utils/logger');

/**
 * Reserve a single item for a pending order.
 *
 * Flow:
 * 1. Check current stock level
 * 2. If sufficient, create reservation record
 * 3. Decrement stock counter
 *
 * @param {string} productId - Product SKU
 * @param {number} quantity - Units to reserve
 * @param {string} orderId - Associated order ID
 * @returns {object} Reservation details
 */
async function reserveItem(productId, quantity, orderId) {
  // Step 1: Check stock
  const stockResult = await db.query(
    'SELECT stock_count, reserved_count FROM inventory WHERE product_id = ?',
    [productId]
  );

  if (!stockResult || stockResult.length === 0) {
    throw new Error(`Product ${productId} not found in inventory`);
  }

  const { stock_count, reserved_count } = stockResult[0];
  const availableStock = stock_count - reserved_count;

  if (availableStock < quantity) {
    throw new Error(
      `Insufficient stock for ${productId}: requested ${quantity}, available ${availableStock}`
    );
  }

  // Step 2: Create reservation record
  const reservationId = `res_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  await db.query(
    'INSERT INTO reservations (id, product_id, order_id, quantity, status, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
    [reservationId, productId, orderId, quantity, 'pending']
  );

  // Step 3: Decrement available stock
  await db.query(
    'UPDATE inventory SET reserved_count = reserved_count + ? WHERE product_id = ?',
    [quantity, productId]
  );

  logger.info(`Reserved ${quantity}x ${productId} for order ${orderId}`);

  return {
    reservationId,
    productId,
    quantity,
    orderId,
    status: 'confirmed',
  };
}

/**
 * Reserve multiple items atomically (or best-effort).
 * If any item fails, previously reserved items are released.
 *
 * @param {Array<{productId, quantity}>} items - Items to reserve
 * @param {string} orderId - Associated order ID
 */
async function reserveMultipleItems(items, orderId) {
  const reservations = [];
  const reserved = [];

  for (const item of items) {
    try {
      const reservation = await reserveItem(item.productId, item.quantity, orderId);
      reservations.push(reservation);
      reserved.push(reservation);
    } catch (err) {
      // Rollback previously reserved items
      logger.warn(`Failed to reserve ${item.productId}, rolling back ${reserved.length} items`);

      for (const r of reserved) {
        await releaseReservation(r.reservationId);
      }

      throw new Error(`Reservation failed for ${item.productId}: ${err.message}`);
    }
  }

  return reservations;
}

/**
 * Release a reservation and restore stock.
 *
 * @param {string} reservationId
 */
async function releaseReservation(reservationId) {
  const res = await db.query(
    'SELECT product_id, quantity FROM reservations WHERE id = ? AND status = ?',
    [reservationId, 'pending']
  );

  if (!res || res.length === 0) {
    logger.warn(`Reservation ${reservationId} not found or already released`);
    return;
  }

  const { product_id, quantity } = res[0];

  await db.query(
    'UPDATE reservations SET status = ? WHERE id = ?',
    ['released', reservationId]
  );

  await db.query(
    'UPDATE inventory SET reserved_count = GREATEST(0, reserved_count - ?) WHERE product_id = ?',
    [quantity, product_id]
  );

  logger.info(`Released reservation ${reservationId} for ${product_id}`);
}

/**
 * Confirm reservations when order is paid.
 * Converts from 'pending' to 'confirmed' and permanently deducts stock.
 */
async function confirmReservations(orderId) {
  const reservations = await db.query(
    'SELECT * FROM reservations WHERE order_id = ? AND status = ?',
    [orderId, 'pending']
  );

  for (const reservation of reservations) {
    await db.query(
      'UPDATE reservations SET status = ? WHERE id = ?',
      ['confirmed', reservation.id]
    );

    // Permanently deduct from stock_count
    await db.query(
      'UPDATE inventory SET stock_count = stock_count - ?, reserved_count = reserved_count - ? WHERE product_id = ?',
      [reservation.quantity, reservation.quantity, reservation.product_id]
    );
  }

  return { confirmed: reservations.length };
}

/**
 * Get current stock level for a product.
 */
async function getStockLevel(productId) {
  const result = await db.query(
    'SELECT stock_count, reserved_count FROM inventory WHERE product_id = ?',
    [productId]
  );

  if (!result || result.length === 0) {
    return null;
  }

  const { stock_count, reserved_count } = result[0];
  return {
    productId,
    total: stock_count,
    reserved: reserved_count,
    available: stock_count - reserved_count,
  };
}

module.exports = {
  reserveItem,
  reserveMultipleItems,
  releaseReservation,
  confirmReservations,
  getStockLevel,
};
