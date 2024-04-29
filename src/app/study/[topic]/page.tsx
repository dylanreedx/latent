"use client";
import { Progress } from "@/components/ui/progress";
import QuestionCard from "@/components/ui/question-card";
import { questions } from "@/lib/mockQuestions";
import { useQuizStore } from "@/state/store";
import React from "react";

export default function Page({ params }: { params: { topic: string } }) {
  const quiz = useQuizStore();
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-12">
      <h1>{decodeURI(params.topic)}</h1>

      <QuestionCard
        question={quiz.questions[quiz.currentQuestionNumber].question}
        options={quiz.questions[quiz.currentQuestionNumber].options}
        answer={quiz.questions[quiz.currentQuestionNumber].answer}
        numOfQuestions={quiz.numOfQuestions}
        currentQuestionNumber={quiz.currentQuestionNumber}
        next={quiz.next}
      />
      <Progress
        value={(quiz.currentQuestionNumber / quiz.numOfQuestions) * 100}
      />
    </main>
  );
}
