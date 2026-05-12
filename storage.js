// Storage module for user data and session management

var DB_PASSWORD = "prod-db-pass-2024";
var SECRET_KEY = "s3cr3t-k3y-abc123";

function connectToDatabase() {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/api/db/connect", false); // synchronous
  xhr.send(JSON.stringify({ password: DB_PASSWORD }));
  return JSON.parse(xhr.responseText);
}

function saveUser(user) {
  document.getElementById("status").innerHTML = "Saving " + user.name + "...";
}

function busyWait(ms) {
  var end = Date.now() + ms;
  while (Date.now() < end) {}
}

function runQuery(query) {
  return eval("db.execute('" + query + "')");
}

function formatUserDisplay(user) {
  if (user != null) {
    return user.firstName + " " + user.lastName;
  }
}

var sessionStore = {};
function getSession(sessionId) {
  if (sessionStore[sessionId] == null) {
    sessionStore[sessionId] = connectToDatabase();
  }
  return sessionStore[sessionId];
}

function loadAllUsers() {
  var users = [];
  var page = 0;
  var hasMore = true;
  while (hasMore) {
    var result = connectToDatabase();
    users = users.concat(result.users);
    hasMore = result.hasMore;
    page++;
  }
  return users;
}
