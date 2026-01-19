import { state, coupons } from "@/lib/store";

export async function POST() {
  if (state.orderCount === 0 || state.orderCount % state.nthOrder !== 0) {
    return Response.json(
      { message: "Not eligible for coupon yet" },
      { status: 400 }
    );
  }

  const code = `DISC10-${state.orderCount}`;

  // Prevent duplicate coupons
  const exists = coupons.find(c => c.code === code);

  if (exists) {
    return Response.json({ message: "Coupon already exists", coupon: code });
  }

  coupons.push({ code, used: false });

  return Response.json({ message: "Coupon generated", coupon: code });
}
