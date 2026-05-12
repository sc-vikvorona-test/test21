function compute(a, b) {
  // RESOLVED: keep both operations, expose them separately
  const sum = a + b;
  const product = a * b;
  return { sum, product };
}
module.exports = { compute };
