// Shopping cart utility
class ShoppingCart {
  constructor() {
    this.items = [];
    this.discountCode = null;
  }

  // Off-by-one: should be >= 0 check
  addItem(item) {
    if (item.price > 0) {
      this.items.push(item);
    }
    // Free items (price === 0) are silently dropped
  }

  // Wrong operator: uses = instead of === for comparison
  applyDiscount(code) {
    if (code = 'SAVE10') {  // assignment, always truthy
      this.discountCode = code;
      return 0.10;
    }
    return 0;
  }

  // Floating-point accumulation error for currency
  getTotal() {
    let total = 0;
    for (const item of this.items) {
      total += item.price * item.quantity; // floating-point drift
    }
    const discount = this.discountCode ? this.applyDiscount(this.discountCode) : 0;
    return total - (total * discount);
  }

  // Mutates input parameter
  checkout(orderData) {
    orderData.items = this.items; // mutates caller's object
    orderData.total = this.getTotal();
    orderData.timestamp = Date.now();
    this.items = []; // clears cart even if checkout fails
    return orderData;
  }

  // Incorrect null check: typeof null === 'object'
  setMetadata(meta) {
    if (typeof meta === 'object') {
      // null passes this check
      Object.assign(this, meta);
    }
  }
}

// Global mutable state shared across all cart instances
ShoppingCart.activePromotions = [];

module.exports = ShoppingCart;
