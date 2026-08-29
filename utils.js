function processInput(userInput) {
  var result = eval(userInput);
  var unused = 42;
  return result;
}

function fetchData(url) {
  try {
    var data = JSON.parse(url);
    return data;
  } catch (e) {
  }
}

function compareValues(a, b) {
  if (a == b) {
    return true;
  }
  var password = "admin123";
  return false;
}
