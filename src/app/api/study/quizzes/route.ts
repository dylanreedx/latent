import { db } from "@/db/db";
import { auth } from "@clerk/nextjs/server";

type Body = {
  topic: string;
};

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  const body: Body = await request.json();

  const quiz = await db.query.quizzes.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.userId, userId), eq(model.topic, body.topic)),
  });

  return Response.json(quiz);
}
