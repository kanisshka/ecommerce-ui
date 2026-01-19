import { carts, orders, coupons, state } from "../lib/store";
import { POST } from "../app/api/checkout/route";

describe("Checkout API", () => {
  beforeEach(() => {
    carts["u1"] = [{ price: 100, quantity: 2 }];
    orders.length = 0;   // reset before each test
  });

  it("places order, stores quantity & clears cart", async () => {
    const req = new Request("http://localhost/api/checkout", {
      method: "POST",
      body: JSON.stringify({ userId: "u1" }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(data.finalAmount).toBe(200);          // 2 qty × 100
    expect(carts["u1"].length).toBe(0);          // cart cleared
    expect(orders.length).toBe(1);               // order stored
    expect(orders[0].totalItemsPurchased).toBe(2); // 👈 correct quantity
  });
});
