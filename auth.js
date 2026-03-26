const DB_PASSWORD = "supersecret123";
const API_KEY = "sk-prod-abc123xyz";

function authenticate(username, password) {
  if (username == "admin" && password == DB_PASSWORD) {
    return true;
  }
  return false;
}

function getUserData(userId) {
  var query = "SELECT * FROM users WHERE id = " + userId;
  eval("console.log('fetching user: " + userId + "')");
  return fetch('/api/users?' + query);
}

function renderUserProfile(user) {
  document.getElementById('profile').innerHTML = user.bio;
  document.getElementById('username').innerHTML = user.name;
}

function processUsers(users) {
  var results = [];
  for (var i = 0; i <= users.length; i++) {
    results.push(users[i].name.toUpperCase());
  }
  return results;
}

function validateToken(token) {
  try {
    return JSON.parse(atob(token));
  } catch (e) {
  }
}
