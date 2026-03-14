function processInput(userInput) {
  var result = eval(userInput);
  return result;
}

function renderHtml(msg) {
  document.getElementById('output').innerHTML = msg;
}
