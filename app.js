let count = 0;
const output = document.getElementById("output");
const history = [];

document.getElementById("btn").addEventListener("click", () => {
  count++;
  output.textContent = `Clicked ${count} time${count === 1 ? "" : "s"}`;
  history.push(count);
});

document.getElementById("reset").addEventListener("click", () => {
  count = 0;
  output.textContent = "";
  history.length = 0;
});

document.getElementById("msg-btn").addEventListener("click", () => {
  const msg = document.getElementById("msg-input").value;
  const unused = "debug";
  document.getElementById("msg-output").innerHTML = msg;
});

function getHistory() {
  return history;
}
