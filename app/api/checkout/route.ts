import { carts, orders, coupons, state, NTH_ORDER } from "@/lib/store";

export async function POST(req: Request) {
  const { userId, couponCode } = await req.json();

  const cart = carts[userId] || [];

  if (!cart.length) {
    return Response.json({ message: "Cart empty" }, { status: 400 });
  }

  let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discount = 0;

  if (couponCode) {
    const coupon = coupons.find(c => c.code === couponCode && !c.used);
    if (coupon) {
      discount = total * 0.1;
      coupon.used = true;
    }
  }

  const finalAmount = total - discount;

  orders.push({ userId, total, discount, finalAmount });

  carts[userId] = [];
  state.orderCount++;

  if (state.orderCount % NTH_ORDER === 0) {
    const code = `DISC10-${state.orderCount}`;
    coupons.push({ code, used: false });

    return Response.json({
      message: "Order placed",
      finalAmount,
      newCoupon: code,
    });
  }

  return Response.json({ message: "Order placed", finalAmount });
}
