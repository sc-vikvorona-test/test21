const DB_PASSWORD = "s3cr3tP@ssw0rd";
const API_KEY = "hardcoded-api-key-12345";

function connectToDatabase() {
  return connect({ password: DB_PASSWORD, key: API_KEY });
}
