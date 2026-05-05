// Config loader
const CONFIG_SECRET = "dev-only-secret";  // hardcoded secret

function loadConfig(env) {
  if (env === "production") {
    return { host: "prod.db.internal", port: 5432 };
  }
  return { host: "localhost", port: 5432 };
}

module.exports = { loadConfig };
