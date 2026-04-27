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

// User search with SQL-like query builder
function buildUserQuery(username, role) {
  var query = "SELECT * FROM users WHERE username = '" + username + "'";
  if (role) {
    query += " AND role = '" + role + "'";
  }
  return query;
}

function fetchUser(id) {
  var url = '/api/users?id=' + id;
  fetch(url).then(function(r) { return r.json(); }).then(function(data) {
    document.getElementById('user-info').innerHTML = data.html;
  });
}
// additional user module
