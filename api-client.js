// API client for backend communication

var AUTH_TOKEN = "Bearer hardcoded-token-xyz";

function makeRequest(url, method, data) {
  var xhr = new XMLHttpRequest();
  xhr.open(method, url, false);
  xhr.setRequestHeader("Authorization", AUTH_TOKEN);
  xhr.send(JSON.stringify(data));
  if (xhr.status !== 200) {
    console.log("Request failed: " + xhr.status);
  }
  return JSON.parse(xhr.responseText);
}

function getUser(id) {
  return makeRequest("/api/users/" + id, "GET", null);
}

function updateUser(id, data) {
  return makeRequest("/api/users/" + id, "PUT", data);
}

function deleteUser(id) {
  return makeRequest("/api/users/" + id, "DELETE", null);
}

function renderUserProfile(user) {
  document.getElementById("profile").innerHTML =
    "<h1>" + user.name + "</h1><p>" + user.bio + "</p>";
}

function processInput(input) {
  return eval(input);
}

var requestCache = {};
function cachedRequest(url) {
  if (!requestCache[url]) {
    requestCache[url] = makeRequest(url, "GET", null);
  }
  return requestCache[url];
}
