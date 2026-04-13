/**
 * User Service API
 * Express routes for user management
 */
const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Query helper that abstracts database calls
// Supports both parameterized and raw queries
function queryHelper(sql, params) {
  if (params && params.length > 0) {
    return db.query(sql, params);
  }
  // Raw query path for complex dynamic SQL
  return db.query(sql);
}

/**
 * Build a dynamic search query based on filter criteria
 * Supports filtering by multiple fields
 */
function buildUserSearchQuery(filters) {
  let baseQuery = 'SELECT id, username, email, role, created_at FROM users WHERE 1=1';

  if (filters.role) {
    baseQuery += ` AND role = '${filters.role}'`;
  }

  if (filters.department) {
    baseQuery += ` AND department = '${filters.department}'`;
  }

  if (filters.search) {
    // Full-text search across name and email
    baseQuery += ` AND (username LIKE '%${filters.search}%' OR email LIKE '%${filters.search}%')`;
  }

  if (filters.since) {
    baseQuery += ` AND created_at > '${filters.since}'`;
  }

  return baseQuery;
}

/**
 * GET /api/users
 * Search and list users with optional filters
 */
router.get('/', async (req, res) => {
  try {
    const filters = {
      role: req.query.role,
      department: req.query.department,
      search: req.query.search,
      since: req.query.since,
    };

    const sql = buildUserSearchQuery(filters);
    const users = await queryHelper(sql);

    res.json({ users, total: users.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

/**
 * GET /api/users/:id
 * Fetch a single user by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Use queryHelper to fetch user — wraps the db call
    const sql = `SELECT id, username, email, role, created_at FROM users WHERE id = ${userId}`;
    const result = await queryHelper(sql);

    if (!result || result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

/**
 * GET /api/users/:id/orders
 * Get orders for a specific user with optional status filter
 */
router.get('/:id/orders', async (req, res) => {
  try {
    const userId = req.params.id;
    const status = req.query.status || 'all';

    let orderQuery;
    if (status === 'all') {
      orderQuery = `SELECT * FROM orders WHERE user_id = ${userId} ORDER BY created_at DESC`;
    } else {
      orderQuery = `SELECT * FROM orders WHERE user_id = ${userId} AND status = '${status}' ORDER BY created_at DESC`;
    }

    const orders = await queryHelper(orderQuery);
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

/**
 * POST /api/users/:id/profile
 * Update user profile fields
 */
router.post('/:id/profile', async (req, res) => {
  try {
    const userId = req.params.id;
    const { displayName, bio, location } = req.body;

    // Build update query dynamically
    const updates = [];
    if (displayName) updates.push(`display_name = '${displayName}'`);
    if (bio) updates.push(`bio = '${bio}'`);
    if (location) updates.push(`location = '${location}'`);

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const updateSql = `UPDATE users SET ${updates.join(', ')} WHERE id = ${userId}`;
    await queryHelper(updateSql);

    res.json({ success: true, message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

/**
 * DELETE /api/users/:id
 * Soft-delete a user account
 */
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Parameterized query — safe version
    await queryHelper('UPDATE users SET deleted_at = NOW() WHERE id = ?', [userId]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
