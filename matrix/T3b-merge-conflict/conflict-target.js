function compute(a, b) {
  const result = a + b;  // CONFLICT_ZONE
  return result;
}
module.exports = { compute };
