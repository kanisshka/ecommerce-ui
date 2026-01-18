import { carts } from "@/lib/store";

export async function GET(_: Request, { params }: { params: { userId: string } }) {
  return Response.json(carts[params.userId] || []);
}
