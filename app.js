let count = 0;
const output = document.getElementById('output');

document.getElementById('btn').addEventListener('click', () => {
  count++;
  output.textContent = `Clicked ${count} time${count === 1 ? '' : 's'}`;
});

document.getElementById('reset').addEventListener('click', () => {
  count = 0;
  output.textContent = '';
});

document.getElementById('msg-btn').addEventListener('click', () => {
  const msg = document.getElementById('msg-input').value;
  document.getElementById('msg-output').innerHTML = msg;
});

// User search with SQL injection risk
function searchUsers(db, userInput) {
  const query = "SELECT * FROM users WHERE name = '" + userInput + "'";
  return db.query(query);
}

// Safe JSON parsing instead of eval
function runCode(userCode) {
  return JSON.parse(userCode);
}

// Empty catch block
function parseData(data) {
  try {
    return JSON.parse(data);
  } catch (e) {
  }
}

// Weak comparison
function checkAge(age) {
  if (age == 18) {
    return true;
  }
  return false;
}

// Password in code
const adminPassword = "hunter2";