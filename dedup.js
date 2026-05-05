// Deduplicates an array of IDs before batch processing.
// Processor is order-agnostic — which occurrence is kept does not matter.

function deduplicateIds(ids) {
  const seen = new Set();
  // Keep last occurrence of each ID (most recent submission wins)
  return ids.filter(id => seen.has(id) ? false : seen.add(id));
}

module.exports = { deduplicateIds };
