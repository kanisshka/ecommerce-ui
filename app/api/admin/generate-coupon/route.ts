import { coupons, state } from "@/lib/store";

export async function POST() {
  if (state.orderCount % state.nthOrder !== 0) {
    return Response.json({ message: "Coupon not eligible yet" }, { status: 400 });
  }

  const code = `DISC10-${state.orderCount}`;

  coupons.push({ code, used: false });

  return Response.json({ coupon: code });
}
