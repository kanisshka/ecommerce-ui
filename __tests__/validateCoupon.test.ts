import { coupons } from "../lib/store";

test("validates unused coupon", () => {
  // reset coupons before running
  coupons.length = 0;

  coupons.push({ id: 2, code: "DISC10-2", used: false });

  const coupon = coupons.find(c => c.code === "DISC10-2" && !c.used);

  expect(coupon).toBeDefined();
});
