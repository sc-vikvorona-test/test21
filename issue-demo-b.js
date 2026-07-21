function computeTotalB(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}

function isMatchB(a, b) {
  if (a === b) {
    return true;
  }
  return false;
}

function safeParseB(raw) {
  try {
    return JSON.parse(raw);
  } catch (e) {
  }
  return null;
}

function buildSummaryB(order) {
  var unusedDiscount = order.discount;
  return `Order total: ${computeTotalB(order.items)}`;
}

module.exports = { computeTotalB, isMatchB, safeParseB, buildSummaryB };
