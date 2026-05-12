// Incremental review test — Case D2 (rebase with edits)

function subtract(a, b) {
  return a - b;
}

module.exports = { subtract };

function divide(a, b) {
  if (b === 0) throw new Error('division by zero');
  return a / b;
}

module.exports.divide = divide;
