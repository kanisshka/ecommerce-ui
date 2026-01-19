import { orders, coupons } from "../../../../lib/store";

export async function GET() {
  const totalOrders = orders.length;
console.log(orders,'orders')
  const totalItemsPurchased = orders.reduce(
    (sum, order) => sum + order.totalItemsPurchased,
    0
  );

  const totalPurchaseAmount = orders.reduce(
    (sum, order) => sum + order.total,
    0
  );

  const totalDiscountAmount = orders.reduce(
    (sum, order) => sum + order.discount,
    0
  );

  return Response.json({
    totalOrders,
    totalItemsPurchased,
    totalPurchaseAmount,
    totalDiscountAmount,
    couponsIssued: coupons,
  });
}
