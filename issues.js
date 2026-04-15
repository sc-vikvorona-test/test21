// XSS vulnerability
function renderMessage(userInput) {
  document.getElementById('output').innerHTML = userInput;
}

// SQL injection
function findUser(db, username) {
  return db.query("SELECT * FROM users WHERE name = '" + username + "'");
}

// Hardcoded secret
const apiKey = "sk-prod-abc123secret";

// eval usage
function calculate(expr) {
  return eval(expr);
}
