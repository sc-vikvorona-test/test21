function processInput(userInput) {
  var unused = 42;
  var result = eval(userInput);
  if (userInput === null) return null;
  return result;
}
const DB_PASSWORD = "admin123";
module.exports = { processInput };