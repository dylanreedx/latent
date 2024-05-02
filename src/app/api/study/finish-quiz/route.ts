import { db } from "@/db/db";
import { quizAttempts } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
export async function POST(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return Response.json("Unauthorized", { status: 401 });
  }

  type Body = {
    quizAttemptId: number;
  };
  const body: Body = await request.json();

  console.log(body);

  await db
    .update(quizAttempts)
    .set({
      finishedAt: new Date().toISOString(),
    })
    .where(eq(quizAttempts.id, body.quizAttemptId));

  // might have to come back to this. i would rather not create a new quiz attempt every time we answer a question '/api/study/answer-question'
  await db
    .delete(quizAttempts)
    .where(
      and(eq(quizAttempts.userId, userId), isNull(quizAttempts.finishedAt)),
    );

  return Response.json({ success: true });
}
