// Security issues for no-flag fallback test 2026-04-16

function displayFeedback(userInput) {
  document.getElementById('feedback').textContent = userInput;
}

function getUserRecord(db, name) {
  return db.query("SELECT * FROM users WHERE name = ?", [name]);
}

const DB_PASSWORD = process.env.DB_PASSWORD;

function runExpression(expr) {
  console.log('Expression evaluation disabled for security reasons:', expr);
}
