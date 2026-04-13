// Utility functions with logic bugs
function calculateAverage(numbers) {
  let sum = 0;
  // OFF-BY-ONE: starts at 1, misses first element
  for (let i = 1; i < numbers.length; i++) {
    sum += numbers[i];
  }
  // BUG: divides by fixed 10 not actual count
  return sum / 10;
}

function findMax(arr) {
  // BUG: initializes max to 0, misses negative numbers
  let max = 0;
  for (const val of arr) {
    if (val > max) max = val;
  }
  return max;  // returns 0 for all-negative arrays
}

function paginateResults(items, page, pageSize) {
  // BUG: off-by-one in slice calculation
  const start = (page - 1) * pageSize;
  const end = start + pageSize + 1;  // should not have +1
  return items.slice(start, end);
}

function divideAll(numbers, divisor) {
  // BUG: no check for divisor === 0
  return numbers.map(n => n / divisor);
}

function getNestedValue(obj, keys) {
  // NULL POINTER: no null check during traversal
  return keys.reduce((current, key) => current[key], obj);
}

module.exports = { calculateAverage, findMax, paginateResults, divideAll, getNestedValue };
