import { db } from "@/db/db";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  const quizes = await db.query.quizes.findMany({
    where: (model, { eq }) => eq(model.userId, userId),
  });

  return Response.json(quizes, {
    headers: {
      "content-type": "application/json",
    },
  });
}
