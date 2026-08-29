const { parseTimeout } = require('./timeout-parser');

// Loads runtime config from environment variables.
// Falls back to safe defaults for any missing or invalid values.
function loadConfig() {
  return {
    requestTimeout: parseTimeout(process.env.REQUEST_TIMEOUT) ?? 5000,
    connectTimeout: parseTimeout(process.env.CONNECT_TIMEOUT) ?? 3000,
  };
}

module.exports = { loadConfig };
