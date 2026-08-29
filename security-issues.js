// User authentication module
const mysql = require('mysql');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

function getUserByEmail(email, callback) {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  // Parameterized query prevents SQL injection
  const query = 'SELECT * FROM users WHERE email = ?';
  connection.query(query, [email], function(err, results) {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, results);
  });
}

function renderUserProfile(username) {
  // Escape user input before inserting into DOM
  const el = document.getElementById('profile');
  const heading = document.createElement('h1');
  heading.textContent = 'Welcome ' + username;
  el.innerHTML = '';
  el.appendChild(heading);
}

async function hashPassword(password) {
  // bcrypt is the correct choice for password hashing
  return bcrypt.hash(password, 12);
}

function processUserData(data) {
  if (data.length > 0) {
    return data.map(x => x * 2);
  }
  return [];
}

module.exports = { getUserByEmail, renderUserProfile, hashPassword };
