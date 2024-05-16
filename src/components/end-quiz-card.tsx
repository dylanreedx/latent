"use client";
import { Card } from "./ui/card";
import Link from "next/link";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import Lottie from "lottie-react";
import anim from "@/utils/confetti-anim.json";

type Props = {
  endOfQuiz:
    | {
        userId: string;
        id: number;
        quizId: number;
        score: number | null;
        maxScore: number | null;
        grade: string | null;
        report: string | null;
        startedAt: string;
        finishedAt: string | null;
      }
    | undefined;
};

export function EndQuizCard({ endOfQuiz }: Props) {
  return (
    <>
      <Lottie animationData={anim} className="absolute" loop={false} />
      <Card className="p-6">
        <h1 className="text-3xl font-bold">{endOfQuiz?.grade}</h1>
        <h2 className="space-x-1 text-muted-foreground">
          <span className="text-2xl font-bold">{endOfQuiz?.score}</span>
          <span>/</span>
          <span className="font-semibold">{endOfQuiz?.maxScore}</span>
        </h2>

        <div
          className="prose mt-4 max-w-none overflow-hidden [&>h1]:mb-4 [&>h1]:font-bold [&>h2]:mb-4 [&>h2]:font-semibold [&>h3]:mb-4 [&>h3]:font-medium [&>ol>li]:list-inside [&>ol>li]:pl-4 [&>ol]:list-decimal [&>p]:mb-4 [&>ul>li]:mb-2 [&>ul>li]:list-inside [&>ul>li]:pl-4 [&>ul]:list-disc"
          dangerouslySetInnerHTML={{ __html: endOfQuiz?.report as string }}
        ></div>
      </Card>
      <Progress value={100} />
      <Link href={process.env.URL + "/study/quizzes"} className="w-full">
        <Button className="w-full">Finish</Button>
      </Link>
    </>
  );
}
