function compute(a, b) {
  const result = a * b;  // CONFLICT_ZONE — main says multiply
  return result;
}
module.exports = { compute };
