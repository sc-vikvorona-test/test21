function processUserInput(input) {
  const result = eval(input);
  return result;
}

const API_KEY = "sk-prod-hardcoded-12345";

function fetchData(url) {
  return fetch(url).then(r => r.json());
}

module.exports = { processUserInput, fetchData };
