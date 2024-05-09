"use client";
import React from "react";
import { Button } from "./button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useQuizStore } from "@/state/store";

type QuestionCardProps = {
  question: string;
  options: string[];
  answer: string;
  numOfQuestions: number;
  currentQuestionNumber: number;
  quizId: number;
  topic: string;
  next: () => void;
};

export default function QuestionCard({
  question,
  options,
  answer,
  numOfQuestions,
  currentQuestionNumber,
  quizId,
  topic,
  next,
}: QuestionCardProps) {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = React.useState<number | null>(
    null,
  );
  const [isAnswerSubmitted, setIsAnswerSubmitted] = React.useState(false);
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null); // added

  const handleSubmitAnswer = async () => {
    const ans = await axios.post("/api/study/answer-question", {
      question: { question, options, answer },
      quizId,
      selectedOption,
      quizAttemptId: useQuizStore.getState().quizAttemptId || null,
    });
    console.log(ans);

    setIsAnswerSubmitted(true);
    setIsCorrect(ans.data.isCorrect);
    console.log("isCorrect", isCorrect);
    useQuizStore.setState((state) => ({
      ...state,
      quizAttemptId: ans.data.quizAttemptId,
      score: ans.data.isCorrect ? state.score + 1 : state.score,
    }));

    console.log("score", useQuizStore.getState().score);
  };

  const handleNextQuestion = async () => {
    const quiz = useQuizStore.getState();
    if (currentQuestionNumber === numOfQuestions - 1) {
      try {
        // handle last question
        await axios.post("/api/study/finish-quiz", {
          quizAttemptId: quiz.quizAttemptId,
          maxScore: numOfQuestions,
          score: quiz.score,
        });
      } catch (error) {
        console.error("Error finishing quiz", error);
      } finally {
        router.push(`/study/completed/${quiz.quizAttemptId}/${topic}`);
      }
    } else {
      next();
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setIsCorrect(null);
    }
  };
  const getOptionClassName = (index: number) => {
    if (isAnswerSubmitted) {
      if (selectedOption === index && options[index] !== answer) {
        return cn(
          "cursor-not-allowed rounded-md p-2 duration-200",
          "bg-red-500/25 text-white",
        );
      } else if (selectedOption === index && options[index] === answer) {
        return cn(
          "cursor-not-allowed rounded-md p-2 duration-200",
          "bg-green-500/25 text-white",
        );
      } else {
        return "cursor-not-allowed rounded-md p-2 duration-200";
      }
    } else {
      return cn(
        "cursor-pointer rounded-md p-2 duration-200 hover:bg-muted-foreground/15",
        {
          "bg-muted-foreground/15 text-primary": selectedOption === index,
        },
      );
    }
  };

  const handleSelectOption = (index: number) => {
    if (!isAnswerSubmitted) {
      setSelectedOption(index);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{question}</CardTitle>
        <CardDescription>Click an option</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-2">
          {options?.map((option, index) => (
            <li key={index} className="align flex items-center gap-2">
              <span
                onClick={() => handleSelectOption(index)}
                className={getOptionClassName(index)}
              >
                {option}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex flex-col justify-between">
        <div className="w-full">
          <p className="font-bold">
            {isAnswerSubmitted
              ? selectedOption === null
                ? "Please select an option"
                : isCorrect
                  ? "Correct!"
                  : `Incorrect. The correct answer is: ${answer}`
              : ""}
          </p>
        </div>
        <div className="flex w-full justify-end">
          {!isAnswerSubmitted && selectedOption !== null && (
            <Button onClick={handleSubmitAnswer}>Check</Button>
          )}
          {isAnswerSubmitted && (
            <Button
              onClick={() =>
                handleNextQuestion().catch((error) => console.error(error))
              }
            >
              {currentQuestionNumber === numOfQuestions - 1 ? "Finish" : "Next"}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
