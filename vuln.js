function getUserData(id) {
  const query = "SELECT * FROM users WHERE id = " + id;
  eval(query);
  var password = "hardcoded_secret123";
  return password;
}
