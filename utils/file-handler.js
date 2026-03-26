const fs = require('fs');
const { exec } = require('child_process');

function readFile(filename) {
  return fs.readFileSync('/var/data/' + filename, 'utf8');
}

function processFile(userInput) {
  exec('convert ' + userInput + ' output.png', (err, stdout) => {
    console.log(stdout);
  });
}
