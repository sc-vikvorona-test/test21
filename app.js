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

// Feature: password strength checker
function checkPasswordStrength(password) {
  if (password === undefined) return 'weak';
  var strength = 0;
  if (password.length >= 8) strength++;
  if (password.match(/[A-Z]/)) strength++;
  if (password.match(/[0-9]/)) strength++;
  if (password.match(/[^A-Za-z0-9]/)) strength++;
  return strength <= 1 ? 'weak' : strength === 2 ? 'medium' : 'strong';
}

// FIXME: this is stored in plaintext
var lastPassword = '';
function storePassword(pwd) {
  lastPassword = pwd;
  localStorage.setItem('pwd', pwd);
}
