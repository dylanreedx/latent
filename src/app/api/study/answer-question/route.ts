import type { Question } from "@/types";
import { db } from "@/db/db";
import { quizAttemptQuestions, quizAttempts } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return Response.json("Unauthorized", { status: 401 });
  }
  // options.indexOf(answer)
  type Body = {
    question: Question;
    selectedOption: number;
    quizId: number;
  };
  const body: Body = await request.json();

  console.log(body);

  const { question, selectedOption } = body;
  const { question: q, options, answer } = question;

  // boolean alternative for SQLite
  const isCorrect = options.indexOf(answer) === selectedOption ? 1 : 0;

  // create quiz attempt
  const quizAttempt = await db
    .insert(quizAttempts)
    .values({
      userId: userId,
      quizId: body.quizId,
    })
    .returning();

  if (!quizAttempt) {
    return Response.json({
      success: false,
      error: "something went wrong creating the quiz attempt",
    });
  }

  await db
    .insert(quizAttemptQuestions)
    .values({
      question: q,
      quizAttemptId: quizAttempt[0].id,
      correctAnswer: answer,
      isCorrect,
      userAnswer: options[selectedOption],
    })
    .returning();

  return Response.json({ success: true, quizAttemptId: quizAttempt[0].id });
}
