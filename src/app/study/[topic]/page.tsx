"use client";
import { Progress } from "@/components/ui/progress";
import QuestionCard from "@/components/ui/question-card";
import { questions } from "@/lib/mockQuestions";
import React from "react";

export default function Page({ params }: { params: { topic: string } }) {
  const [questionNumber, setQuestionNumber] = React.useState(0);
  const [currentQuestion, setCurrentQuestion] = React.useState(
    questions[questionNumber],
  );

  React.useEffect(() => {
    setCurrentQuestion(questions[questionNumber]);
  }, [questionNumber]);
  return (
    <main className="flex min-h-screen flex-col gap-12 p-24">
      <h1>{decodeURI(params.topic)}</h1>

      <QuestionCard
        question={currentQuestion.question}
        options={currentQuestion.options}
        answer={currentQuestion.answer}
        numOfQuestions={questions.length}
        currentQuestionNumber={questionNumber}
        next={() => {
          setQuestionNumber((prev) => prev + 1);
        }}
      />
      <Progress value={(questionNumber / questions.length) * 100} />
    </main>
  );
}
