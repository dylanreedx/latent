import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { db } from "@/db/db";

import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: { timesCompleted: string; topic: string };
}) {
  const { userId } = auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const quizzes = await db.query.quizzes.findMany({
    where: (model, { eq }) => eq(model.userId, userId),
  });

  const quiz = quizzes.find(
    (quiz: any) => quiz.topic === decodeURI(params.topic),
  );

  if (!quiz) {
    return new Response("Quiz not found", { status: 404 });
  }

  const endOfQuiz = await db.query.quizAttempts.findFirst({
    where: (model, { eq, and }) =>
      and(
        eq(model.userId, userId),
        eq(model.quizId, quiz.id),
        eq(model.id, parseInt(params.timesCompleted)),
      ),
  });

  if (!endOfQuiz) {
    return <Card>Quiz not found</Card>;
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-12">
      <h1>{decodeURI(params.topic)}</h1>

      <Card className="p-6">
        <h2 className="space-x-1">
          <span className="text-2xl font-bold">{endOfQuiz?.score}</span>
          <span>/</span>
          <span className="font-semibold">{endOfQuiz?.maxScore}</span>
        </h2>
        <p className="text-lg font-bold text-muted-foreground">
          {endOfQuiz?.grade}
        </p>
      </Card>
      <Progress value={100} />

      <Link href={process.env.URL + "/study/quizzes"} className="w-full">
        <Button className="w-full">Finish</Button>
      </Link>
    </main>
  );
}
