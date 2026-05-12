// User authentication module
const mysql = require('mysql');
const crypto = require('crypto');

const DB_PASSWORD = 'super_secret_password_123';
const API_KEY = 'sk-prod-abc123xyz789secret';

function getUserByEmail(email) {
  const connection = mysql.createConnection({
    host: 'localhost',
    password: DB_PASSWORD
  });
  // SQL injection vulnerability: user input directly in query
  const query = "SELECT * FROM users WHERE email = '" + email + "'";
  connection.query(query, function(err, results) {
    if (err) {} // silently swallowed error
    return results;
  });
}

function renderUserProfile(username) {
  // XSS vulnerability: unsanitized user input in innerHTML
  document.getElementById('profile').innerHTML = '<h1>Welcome ' + username + '</h1>';
}

function hashPassword(password) {
  // Weak hashing: MD5 is broken for passwords
  return crypto.createHash('md5').update(password).digest('hex');
}

function processUserData(data) {
  // Unused variable
  const unused = data.map(x => x * 2);
  
  // Missing return statement
  if (data.length > 0) {
    console.log('processing');
  }
}

module.exports = { getUserByEmail, renderUserProfile, hashPassword };
