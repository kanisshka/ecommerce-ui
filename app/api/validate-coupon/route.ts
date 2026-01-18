import { coupons } from "@/lib/store";

export async function POST(req: Request) {
  const { couponCode } = await req.json();

  const coupon = coupons.find(c => c.code === couponCode && !c.used);

  if (!coupon) {
    return Response.json({ valid: false });
  }

  return Response.json({ valid: true });
}
