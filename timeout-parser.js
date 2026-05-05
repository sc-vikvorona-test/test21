// Parses a timeout value from an environment string.
// Returns null if the value is absent or non-numeric — callers decide the fallback.
function parseTimeout(value) {
  const n = parseInt(value, 10);
  return isNaN(n) ? null : n;
}

module.exports = { parseTimeout };
