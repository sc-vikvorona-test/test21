function getUser(id) {
  const q = "SELECT * FROM users WHERE id = " + id;
  eval(q);
}
