function computeTotalA(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}

function isMatchA(a, b) {
  if (a === b) {
    return true;
  }
  return false;
}

function safeParseA(raw) {
  try {
    return JSON.parse(raw);
  } catch (e) {
  }
  return null;
}

function buildSummaryA(order) {
  var unusedDiscount = order.discount;
  return `Order total: ${computeTotalA(order.items)}`;
}

module.exports = { computeTotalA, isMatchA, safeParseA, buildSummaryA };
