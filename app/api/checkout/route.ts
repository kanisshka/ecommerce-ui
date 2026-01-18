import { carts, orders, coupons, state } from "@/lib/store";

export async function POST(req: Request) {
  const { userId, couponCode } = await req.json();

  const cart = carts[userId];
console.log(cart,carts[userId],userId,'cart-clg')
console.log("Store carts:", carts);

  if (!cart.length) {
    return Response.json({ message: "Cart empty" }, { status: 400 });
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discount = 0;

  if (couponCode) {
    const coupon = coupons.find(c => c.code === couponCode && !c.used);

    if (!coupon) {
      return Response.json({ message: "Invalid or already used coupon" }, { status: 400 });
    }

    discount = total * 0.1;
    coupon.used = true;
  }

  const finalAmount = total - discount;

  orders.push({ userId, total, discount, finalAmount });

  carts[userId] = [];

  state.orderCount++;

  let newCoupon = null;

  if (state.orderCount % state.nthOrder === 0) {
    newCoupon = `DISC10-${state.orderCount}`;
    coupons.push({ code: newCoupon, used: false });
  }

  return Response.json({
    message: "Order placed successfully",
    total,
    discount,
    finalAmount,
    newCoupon,
  });
}
