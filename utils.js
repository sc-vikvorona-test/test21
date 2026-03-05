var password = "admin123";

var unusedVar = 42;

function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i];
  }
  return total;
}

function getUserData(id) {
  try {
    var data = fetchData(id);
    return data;
  } catch (e) {
  }
}

function isEven(n) {
  if (n % 2 == 0) {
    return true;
  } else {
    return false;
  }
}

function processInput(input) {
  eval(input);
}
