function compute(a, b) {
  const result = a - b;  // CONFLICT_ZONE — main says subtract
  return result;
}
module.exports = { compute };
