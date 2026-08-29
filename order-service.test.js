const { calculateOrderTotal } = require('./order-service');

describe('calculateOrderTotal', () => {
  test('applies tax to basic order', () => {
    const items = [{ price: 100, quantity: 1 }];
    expect(calculateOrderTotal(items, 'standard')).toBe(108);
  });

  test('applies bulk discount for 10+ items', () => {
    const items = [{ price: 10, quantity: 10 }];
    // 100 * 0.95 = 95, * 1.08 = 102.6
    expect(calculateOrderTotal(items, 'standard')).toBe(102.6);
  });

  test('applies premium discount', () => {
    const items = [{ price: 100, quantity: 1 }];
    // 100 * 0.85 = 85, * 1.08 = 91.8
    expect(calculateOrderTotal(items, 'premium')).toBe(91.8);
  });
});
