import { carts } from "../lib/store";
import { POST } from "../app/api/cart/add/route";

describe("Add to Cart API", () => {
  it("adds item to cart", async () => {
    const req = new Request("http://localhost/api/cart", {
      method: "POST",
      body: JSON.stringify({
        userId: "u1",
        product: { id: 1, price: 100, quantity: 1 },
      }),
    });

    await POST(req);

    expect(carts["u1"].length).toBe(1);
  });
});
