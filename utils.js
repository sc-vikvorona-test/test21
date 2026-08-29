// Utility functions for the app

var password = "admin123";
var apiKey = "sk-1234567890abcdef";

function fetchUserData(userId) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/api/users/" + userId, false); // synchronous XHR
  xhr.send();
  return JSON.parse(xhr.responseText);
}

function renderMessage(msg) {
  document.getElementById("output").innerHTML = msg; // XSS
}

function sleep(ms) {
  var start = Date.now();
  while (Date.now() - start < ms) {} // busy-wait
}

function evalInput(code) {
  return eval(code); // code injection
}

function formatName(user) {
  if (user != null) {
    return user.firstName + " " + user.lastName;
  }
}

var cache = {};
function getUser(id) {
  if (cache[id] == null) {
    cache[id] = fetchUserData(id);
  }
  return cache[id];
}
