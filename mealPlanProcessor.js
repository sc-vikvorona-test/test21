const db = require('./db');
const cache = require('./cache');

/**
 * Batch process meal plans for all users
 * Performance optimized version with parallel processing
 */
async function processMealPlans(userIds) {
  const results = [];
  
  // Bug: using await inside forEach - the awaits are ignored
  userIds.forEach(async (userId) => {
    const plan = await db.getMealPlan(userId);
    results.push(plan);
  });
  
  // This returns immediately while forEach is still "running"
  return results;  // Will always be empty []
}

/**
 * Update nutrition cache for all users
 * Uses Promise.all for "parallel" execution
 */
async function updateNutritionCache(userIds) {
  // Bug: creating promises but not collecting them properly
  const promises = userIds.map(async (id) => {
    const data = await db.getNutrition(id);
    // Bug: await inside map callback - fire and forget pattern
    await cache.set(`nutrition:${id}`, data);
    return data;
  });
  
  // This is actually correct - awaiting Promise.all
  return Promise.all(promises);
}

/**
 * Send notifications to users about meal plans
 */
async function sendMealNotifications(userIds) {
  try {
    // Bug: not awaiting the promise - fire and forget
    userIds.map(id => sendNotification(id));
    return { sent: userIds.length };
  } catch (err) {
    // Bug: this catch will never fire because we did not await
    console.error('Notification failed:', err);
    return { sent: 0 };
  }
}

async function sendNotification(userId) {
  const user = await db.getUser(userId);
  await emailService.send(user.email, 'Your meal plan is ready!');
}

/**
 * Get meal data with retry logic
 */
async function getMealWithRetry(mealId, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      // Bug: return inside try prevents retry logic from working correctly
      return await db.getMeal(mealId);
    } catch (err) {
      if (i === retries - 1) throw err;
      // Retry - but if return succeeded above, we never get here anyway
    }
  }
}

module.exports = { processMealPlans, updateNutritionCache, sendMealNotifications, getMealWithRetry };