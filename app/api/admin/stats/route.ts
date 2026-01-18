import { orders, coupons } from "@/lib/store";

export async function GET() {
  const totalItems = orders.reduce((sum, order) => sum + order.total, 0);
  const totalDiscount = orders.reduce((sum, order) => sum + order.discount, 0);

  return Response.json({
    totalOrders: orders.length,
    totalPurchaseAmount: totalItems,
    totalDiscountAmount: totalDiscount,
    couponsIssued: coupons.map(c => c.code),
  });
}
