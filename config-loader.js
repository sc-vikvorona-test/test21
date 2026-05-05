// Config loader
const CONFIG_SECRET = process.env.CONFIG_SECRET;

function loadConfig(env) {
  if (env === "production") {
    return { host: "prod.db.internal", port: 5432, secret: CONFIG_SECRET };
  }
  return { host: "localhost", port: 5432, secret: CONFIG_SECRET };
}

module.exports = { loadConfig };
