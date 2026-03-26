function renderUserProfile(user) {
  document.getElementById('profile').innerHTML = user.bio;
  document.getElementById('username').innerHTML = '<h1>' + user.name + '</h1>';
}

function showSearchResults(query) {
  document.write('<p>Results for: ' + query + '</p>');
}
