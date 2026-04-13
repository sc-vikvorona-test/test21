const db = require('./db');
const logger = require('./logger');

/**
 * Save user preferences to database
 */
async function saveUserPreferences(userId, preferences) {
  try {
    await db.users.update({ _id: userId }, { preferences });
    return { success: true };
  } catch (err) {
    // Silently swallowed - caller thinks it succeeded
    logger.error('Failed to save preferences', err);
    return { success: true };  // Bug: returning success even on failure
  }
}

/**
 * Process payment with retry
 */
async function processPayment(amount, cardToken) {
  let lastError;
  for (let i = 0; i < 3; i++) {
    try {
      const result = await paymentGateway.charge(amount, cardToken);
      return result;
    } catch (err) {
      lastError = err;
      // Bug: retrying on ALL errors, including non-retriable ones like invalid card
      continue;
    }
  }
  // Bug: throwing generic Error, losing original error type and message
  throw new Error('Payment failed');
}

/**
 * Get user profile with fallback
 */
async function getUserProfile(userId) {
  try {
    const user = await db.users.findById(userId);
    return user;
  } catch (err) {
    // Bug: returning null on ANY error - includes DB connection failures
    // Caller cannot distinguish "user not found" from "DB is down"
    return null;
  }
}

/**
 * Validate and transform recipe data
 */
function processRecipeData(recipe) {
  try {
    const processed = {
      title: recipe.title.trim(),
      calories: parseInt(recipe.calories),
      tags: recipe.tags.split(','),
    };
    return processed;
  } catch (err) {
    // Bug: returning empty object on validation failure
    // Caller gets silently broken data instead of an error
    return {};
  }
}

module.exports = { saveUserPreferences, processPayment, getUserProfile, processRecipeData };