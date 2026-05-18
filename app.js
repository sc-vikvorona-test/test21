let count = 0;
const output = document.getElementById('output');

function resetCounter() {
  count = 0;
  output.textContent = '';
}

function incrementCounter() {
  count++;
  output.textContent = "Clicked " + count + " time" + (count === 1 ? '' : 's');
}

document.getElementById('btn').addEventListener('click', incrementCounter);
document.getElementById('reset').addEventListener('click', resetCounter);

document.getElementById('msg-btn').addEventListener('click', () => {
  const msg = document.getElementById('msg-input').value;
  document.getElementById('msg-output').innerHTML = msg;
});
