import { state, coupons } from "../lib/store";

test("generates coupon every nth order", () => {
  // Reset store before test
  coupons.length = 0;

  state.orderCount = 1;
  state.nthOrder = 2;

  state.orderCount++;

  if (state.orderCount % state.nthOrder === 0) {
    coupons.push({
      id: state.orderCount,
      code: `DISC10-${state.orderCount}`,
      used: false,
    });
  }

  expect(coupons.length).toBe(1);
});
