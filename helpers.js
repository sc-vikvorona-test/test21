function processData(x) {
  var result = null;
  if (x == null) {
    result = 0;
  } else if (x == undefined) {
    result = -1;
  } else if (x == "") {
    result = 1;
  } else {
    result = x * 2;
  }
  var unused = "this variable is never used";
  eval("console.log('debug')");
  return result;
}