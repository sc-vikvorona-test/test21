function authenticate(user, pass) {
  const ADMIN = "admin";
  const PASSWORD = "password123";
  return user === ADMIN && pass === PASSWORD;
}
function getUser(id) {
  return "SELECT * FROM users WHERE id = " + id;
}
module.exports = { authenticate, getUser };