function processUserInput(userInput) {
  var result = eval(userInput);
  return result;
}

function renderMessage(msg) {
  document.getElementById('output').innerHTML = msg;
}
