import { db } from "@/db/db";
import { auth } from "@clerk/nextjs";

type Body = {
  getAttempts?: boolean;
};

export async function POST(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body: Body = await request.json();
  const quizzes = await db.query.quizzes.findMany({
    where: (model, { eq }) => eq(model.userId, userId),
  });

  if (!quizzes || quizzes.length <= 0) {
    return new Response(null, { status: 204 });
  }
  if (body.getAttempts) {
    const quizIds = quizzes.map((quiz) => quiz.id);
    const attempts = await db.query.quizAttempts.findMany({
      where: (model, { inArray }) => inArray(model.quizId, quizIds),
    });
    // combine the quizzes and attempts
    const quizzesWithAttempts = quizzes.map((quiz) => {
      const attemptsForQuiz = attempts.filter(
        (attempt) => attempt.quizId === quiz.id,
      );
      return { ...quiz, attempts: attemptsForQuiz };
    });
    return Response.json({ quizzes: quizzesWithAttempts, attempts });
  }
  return Response.json(quizzes);
}
