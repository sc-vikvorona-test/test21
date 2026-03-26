function getUserById(userId) {
  const query = "SELECT * FROM users WHERE id = " + userId;
  return db.execute(query);
}

function loginUser(username, password) {
  const sql = "SELECT * FROM accounts WHERE username = '" + username + "' AND password = '" + password + "'";
  return db.query(sql);
}

module.exports = { getUserById, loginUser };
