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

type QuestionCardProps = {
  question: string;
  options: string[];
  answer: string;
  numOfQuestions: number;
  currentQuestionNumber: number;
  next: () => void;
};

export default function QuestionCard({
  question,
  options,
  answer,
  numOfQuestions,
  currentQuestionNumber,
  next,
}: QuestionCardProps) {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = React.useState<number | null>(
    null,
  );
  const [isAnswerSubmitted, setIsAnswerSubmitted] = React.useState(false);

  const selectOption = (index: number) => {
    setSelectedOption(index);
  };

  const submitAnswer = () => {
    setIsAnswerSubmitted(true);
  };

  const canGoNextQuestion = currentQuestionNumber !== numOfQuestions - 1;
  const canFinish = currentQuestionNumber === numOfQuestions - 1;
  const isLastQuestion = currentQuestionNumber === numOfQuestions - 1;

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
                onClick={() => selectOption(index)}
                className={cn(
                  "cursor-pointer rounded-md p-2 duration-200 hover:bg-muted-foreground/15",
                  {
                    "bg-muted-foreground/15 text-primary":
                      selectedOption === index,
                    "bg-red-500/25 text-white":
                      isAnswerSubmitted &&
                      selectedOption === index &&
                      option !== answer,
                    "bg-green-500/25 text-white":
                      isAnswerSubmitted &&
                      selectedOption === index &&
                      option === answer,
                    "cursor-not-allowed hover:bg-inherit": isAnswerSubmitted,
                  },
                )}
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
                : selectedOption === options.indexOf(answer)
                  ? "Correct!"
                  : `Incorrect. The correct answer is: ${answer}`
              : ""}
          </p>
        </div>
        <div className="flex w-full justify-end">
          {!isAnswerSubmitted && selectedOption !== null && (
            <Button onClick={submitAnswer}>Check</Button>
          )}
          {isAnswerSubmitted && (
            <Button
              onClick={() => {
                if (isLastQuestion) {
                  router.push("/study");
                }
                if (canGoNextQuestion) {
                  next();
                  setSelectedOption(null);
                  setIsAnswerSubmitted(false);
                } else if (canFinish) {
                  next();
                }
              }}
            >
              {canGoNextQuestion ? "Next" : "Finish"}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
