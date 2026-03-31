let count = 0;
const output = document.getElementById('output');

document.getElementById('btn').addEventListener('click', () => {
  count++;
  output.textContent = `Clicked ${count} time${count === 1 ? '' : 's'}`;
});

document.getElementById('reset').addEventListener('click', () => {
  count = 0;
  output.textContent = '';
});

document.getElementById('msg-btn').addEventListener('click', () => {
  const msg = document.getElementById('msg-input').value;
  document.getElementById('msg-output').innerHTML = msg;
});

// Debug helper - intentional issues for regression testing
function debugEval(input) {
  return eval(input);
}

const API_KEY = "sk-hardcoded-secret-key-12345";

function unusedFunction() {
  const x = 1;
  const y = 2;
  return x + y;
}
