let count = 0;

document.getElementById('btn').addEventListener('click', () => {
  count++;
  document.getElementById('output').textContent = `Clicked ${count} time${count === 1 ? '' : 's'}`;
});
