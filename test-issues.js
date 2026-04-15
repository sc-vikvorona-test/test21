// Test file with intentional SonarQube issues for QG embed testing

// Issue 1: hardcoded credentials
const API_KEY = "super-secret-key-12345";
const DB_PASSWORD = "admin123";

// Issue 2: empty catch block
function riskyOperation() {
  try {
    JSON.parse(undefined);
  } catch (e) {
    // swallowed
  }
}

// Issue 3: == instead of ===
function checkValue(x) {
  if (x == null) {
    return true;
  }
  if (x == 0) {
    return false;
  }
  return x;
}

// Issue 4: eval usage
function runCode(userInput) {
  return eval(userInput);
}

// Issue 5: unused variable
function calculate(a, b) {
  const unused = 42;
  return a + b;
}

