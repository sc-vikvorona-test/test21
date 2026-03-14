function generateToken() {
  return Math.random().toString(36).substring(2);
}

function generateSessionId() {
  const token = Math.random() * 1000000;
  return token.toString();
}
