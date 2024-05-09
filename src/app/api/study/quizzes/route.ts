import { db } from "@/db/db";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  const quizzes = await db.query.quizzes.findMany({
    where: (model, { eq }) => eq(model.userId, userId),
  });

  return Response.json(quizzes, {
    headers: {
      "content-type": "application/json",
    },
  });
}
