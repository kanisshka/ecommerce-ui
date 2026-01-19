import { orders } from "../lib/store";
import { GET } from "../app/api/admin/stats/route";

test("returns correct stats", async () => {
  orders.length = 0;

  orders.push({ userId: "u1", total: 100, discount: 10, totalItemsPurchased: 1 });

  const res = await GET();
  const data = await res.json();

  expect(data.totalPurchaseAmount).toBe(100);
  expect(data.totalDiscountAmount).toBe(10);
});
