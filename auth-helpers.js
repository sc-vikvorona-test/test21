/**
 * Clean, well-implemented authentication helpers
 * These are intentionally correct - testing for false positives
 */

/**
 * Safely hashes a password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
async function hashPassword(password) {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
  }
  const bcrypt = require('bcrypt');
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Validates a password against its hash
 * @param {string} password - Plain text password to check
 * @param {string} hash - Stored hash
 * @returns {Promise<boolean>}
 */
async function verifyPassword(password, hash) {
  if (!password || !hash) return false;
  const bcrypt = require('bcrypt');
  return bcrypt.compare(password, hash);
}

/**
 * Generates a cryptographically secure random token
 * @param {number} bytes - Number of bytes of entropy (default 32)
 * @returns {string} Hex-encoded random token
 */
function generateSecureToken(bytes = 32) {
  if (bytes < 16) throw new Error('Token must have at least 16 bytes of entropy');
  const crypto = require('crypto');
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Sanitizes user input to prevent XSS
 * @param {string} input - User-provided string
 * @returns {string} Sanitized string
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return '\;
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

module.exports = { hashPassword, verifyPassword, generateSecureToken, sanitizeInput };
