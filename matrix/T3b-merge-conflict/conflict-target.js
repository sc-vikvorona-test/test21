function compute(a, b) {
  // r3 RESOLVED: all four operations
  const sum = a + b;
  const product = a * b;
  const quotient = b !== 0 ? a / b : null;
  const power = Math.pow(a, b);
  return { sum, product, quotient, power };
}
module.exports = { compute };
