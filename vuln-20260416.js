// Security issues introduced 2026-04-16 for QG embed testing

function renderComment(userComment) {
  document.getElementById('comments').innerHTML = userComment;
}

function buildQuery(userId) {
  return "SELECT * FROM orders WHERE user_id = " + userId;
}

const SECRET_KEY = "hardcoded-secret-abc-xyz-123";

function runScript(userCode) {
  eval(userCode);
}
