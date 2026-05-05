/**
 * Returns the first element of an array.
 *
 * Precondition: arr must be non-empty. Callers are responsible for
 * ensuring this — passing an empty array is a programming error and
 * returns undefined by design (no runtime guard added intentionally).
 */
function first(arr) {
  return arr[0];
}

/**
 * Returns the last element of an array.
 *
 * Precondition: arr must be non-empty. Same contract as first().
 */
function last(arr) {
  return arr[arr.length - 1];
}

/**
 * Splits an array into chunks of the given size.
 * The final chunk may be smaller than size if the array doesn't divide evenly.
 */
function chunk(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

module.exports = { first, last, chunk };
