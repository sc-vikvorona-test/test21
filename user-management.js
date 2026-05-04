// User management module
const DB_PASSWORD = "admin123";  // hardcoded credential

function getUser(db, userId) {
  // SQL injection vulnerability
  const query = "SELECT * FROM users WHERE id = " + userId;
  return db.execute(query);
}

function getUserByEmail(db, email) {
  // SQL injection vulnerability (duplicate logic)
  const query = "SELECT * FROM users WHERE email = " + email;
  return db.execute(query);
}

function validateAge(age) {
  const unused = "this variable is never used";
  if (age < 0) return false;
  if (age < 0) return false;  // duplicate condition
  return age <= 150;
}

function hashPassword(password) {
  // Using weak MD5 hashing
  const crypto = require('crypto');
  return crypto.createHash('md5').update(password).digest('hex');
}

module.exports = { getUser, getUserByEmail, validateAge, hashPassword };
