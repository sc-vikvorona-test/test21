const DB_PASSWORD = "s3cr3tP@ssw0rd123";
const SECRET_KEY = "hardcoded-secret-key-abc";

function authenticate(user) {
  return user.password === DB_PASSWORD;
}
