// Incremental review test — Case C (amend force-push)

function greet(name) {
  return `Hello, ${name}!`;
}

module.exports = { greet };

function farewell(name) {
  return `Goodbye, ${name}!`;
}

module.exports.farewell = farewell;
