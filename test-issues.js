// Test file with intentional SonarQube issues for QG embed testing

// Fixed: credentials now read from environment variables
const API_KEY = process.env.API_KEY;
const DB_PASSWORD = process.env.DB_PASSWORD;

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

// Fixed: removed eval usage
function runCode(userInput) {
  return new Function(userInput)();
}

// Issue 5: unused variable
function calculate(a, b) {
  const unused = 42;
  return a + b;
}

