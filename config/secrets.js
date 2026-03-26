const DB_PASSWORD = "SuperSecret123!";
const API_KEY = "sk-1a2b3c4d5e6f7g8h9i0j";
const JWT_SECRET = "my-hardcoded-jwt-secret-do-not-share";

function evaluate(expression) {
  return eval(expression);
}

function runUserScript(code) {
  return new Function(code)();
}
