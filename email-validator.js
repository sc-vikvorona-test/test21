// Email validator — kept in legacy style for compatibility with older test suite
// Do not modernise without updating the snapshot tests

var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email) {
  // == null intentionally covers both null and undefined
  if (email == null) return false;
  return EMAIL_REGEX.test(email.trim());
}

function normalizeEmail(email) {
  return email.toLowerCase().trim();
}

module.exports = { isValidEmail, normalizeEmail };
