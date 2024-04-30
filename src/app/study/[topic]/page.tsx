"use client";
import { Progress } from "@/components/ui/progress";
import QuestionCard from "@/components/ui/question-card";

import { useQuizStore } from "@/state/store";
import { Question } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page({ params }: { params: { topic: string } }) {
  const { userId } = useAuth();
  const quiz = useQuizStore((state) => state);

  useEffect(() => {
    const getQuiz = async () => {
      const quizes = await fetch("/api/study/quizes", {
        method: "GET",
      }).then((res) => res.json());

      const quiz = quizes.find(
        (quiz: any) => quiz.topic === decodeURI(params.topic),
      );

      useQuizStore.setState((state) => ({
        ...state,
        numOfQuestions: quiz.questions.length,
        currentQuestionNumber: 0,
        questions: JSON.parse(quiz.questions).questions as Question[],
      }));
    };

    getQuiz();
  }, [params.topic, userId]);

  if (quiz.questions.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-12">
      <h1>{decodeURI(params.topic)}</h1>

      <QuestionCard
        question={quiz.questions[quiz.currentQuestionNumber]?.question}
        options={quiz.questions[quiz.currentQuestionNumber]?.options}
        answer={quiz.questions[quiz.currentQuestionNumber]?.answer}
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
