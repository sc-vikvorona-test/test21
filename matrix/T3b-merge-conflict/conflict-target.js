function compute(a, b) {
  // round-2 RESOLVED: keep all three operations
  const sum = a + b;
  const product = a * b;
  const quotient = b !== 0 ? a / b : null;
  return { sum, product, quotient };
}
module.exports = { compute };
