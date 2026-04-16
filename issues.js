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
// re-trigger 20260415-152727

// New XSS - unique to this branch
function showUserData(data) {
  document.write(data.userInput);
}
