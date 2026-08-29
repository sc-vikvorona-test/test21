// Hardcoded credentials (S2068)
const DB_PASSWORD = "admin123";

// eval() usage - security hotspot (S1523)
function calculate(expression) {
  return eval(expression);
}

// Unused parameter (S1172)
function processUser(userId, unusedFlag) {
  return fetch('/api/user/' + userId);
}

// Dead store (S1854)
function getTotal(items) {
  let total = 0;
  for (const item of items) {
    total = total + item.price;
    total = 0;
  }
  return total;
}

// XSS via innerHTML (S5727)
function renderUserInput(input) {
  document.getElementById('output').innerHTML = input;
}
