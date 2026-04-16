// Security issues for no-flag fallback test 2026-04-16

function displayFeedback(userInput) {
  document.getElementById('feedback').innerHTML = userInput;
}

function getUserRecord(db, name) {
  return db.query("SELECT * FROM users WHERE name = '" + name + "'");
}

const DB_PASSWORD = "super-secret-db-pass-456";

function runExpression(expr) {
  eval(expr);
}
