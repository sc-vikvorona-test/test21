// Incremental review test — Case A (linear push)
// Initial commit: adds a calculator with one operation.

function add(a, b) {
  return a + b;
}

module.exports = { add };

function subtract(a, b) {
  return a - b;
}

module.exports.subtract = subtract;
