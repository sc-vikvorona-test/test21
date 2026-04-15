// Test file with SonarQube issues for QG placement testing

// Issue: hardcoded credentials
const API_KEY = "super-secret-key-12345";
const DB_PASSWORD = "admin123";

// Issue: eval usage
function runCode(userInput) {
  return eval(userInput);
}

// Issue: empty catch
function riskyOp() {
  try {
    JSON.parse(undefined);
  } catch (e) {}
}
