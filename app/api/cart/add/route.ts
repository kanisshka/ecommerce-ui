import { carts } from "@/lib/store";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, itemId, name, price, quantity } = body;

  if (!carts[userId]) carts[userId] = [];

  carts[userId].push({ itemId, name, price, quantity });
console.log(carts[userId],userId,'add-cart')
  return Response.json({ message: "Item added", cart: carts[userId] });
}
