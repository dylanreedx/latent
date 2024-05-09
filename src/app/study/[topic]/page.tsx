"use client";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import QuestionCard from "@/components/ui/question-card";
import QuestionCardSkeleton from "@/components/ui/question-card-skeleton";

import { useQuizStore } from "@/state/store";
import { Question } from "@/types";
import { useAuth } from "@clerk/nextjs";
import React, { useEffect } from "react";

export default function Page({ params }: { params: { topic: string } }) {
  const { userId } = useAuth();
  const quiz = useQuizStore((state) => state);

  useEffect(() => {
    const getQuiz = async () => {
      const quizzes = await fetch("/api/study/quizzes", {
        method: "GET",
      }).then((res) => res.json());

      const quiz = quizzes.find(
        (quiz: any) => quiz.topic === decodeURI(params.topic),
      );

      if (!quiz) {
        console.error("Quiz not found");
        return;
      }

      console.log(quiz);

      useQuizStore.setState((state) => ({
        ...state,
        id: quiz.id,
        numOfQuestions: JSON.parse(quiz.questions).length,
        context: quiz.context,
        currentQuestionNumber: 0,
        questions: JSON.parse(quiz.questions) as Question[],
      }));
    };

    getQuiz();
  }, [params.topic, userId]);

  const next = () => {
    useQuizStore.setState((state) => ({
      ...state,
      currentQuestionNumber: state.currentQuestionNumber + 1,
    }));
  };

  if (!quiz || !quiz.questions || !quiz.questions.length)
    return <QuestionCardSkeleton />;

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-12">
      <h1>{decodeURI(params.topic)}</h1>

      {quiz.context.length > 0 && (
        <Card className="relative mx-auto h-32 overflow-hidden p-2">
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <span className="text-justify">{quiz.context}</span>
        </Card>
      )}

      <QuestionCard
        question={quiz.questions[quiz.currentQuestionNumber]?.question}
        options={quiz.questions[quiz.currentQuestionNumber]?.options}
        answer={quiz.questions[quiz.currentQuestionNumber]?.answer}
        numOfQuestions={quiz.numOfQuestions}
        currentQuestionNumber={quiz.currentQuestionNumber}
        topic={decodeURI(params.topic)}
        quizId={quiz.id}
        next={next}
      />
      <Progress
        value={(quiz.currentQuestionNumber / quiz.numOfQuestions) * 100}
      />
    </main>
  );
}
