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
// test receiver-processor split Fri Mar 27 12:30:43 CET 2026
