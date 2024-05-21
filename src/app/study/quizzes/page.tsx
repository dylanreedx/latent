"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { SignIn, useAuth } from "@clerk/nextjs";
import { EyeOpenIcon, TrashIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import axios from "axios";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useQuizNoteStore } from "@/state/store";

interface Quiz {
  id: number;
  topic: string;
  attempts: any[];
}

const StudyPage = () => {
  const [cachedQuizzes, setCachedQuizzes] = useLocalStorage<Quiz[]>(
    "quizzes",
    [],
  );

  const { userId } = useAuth();

  useEffect(() => {
    const fetchQuizzes = async () => {
      const res = await axios.post("/api/get-quizzes", {
        getAttempts: true,
      });
      const { quizzes } = res.data;
      // Update the local storage with the processed data
      setCachedQuizzes(quizzes);
    };

    fetchQuizzes();
  }, []);

  const deleteQuiz = async (id: number) => {
    await axios.delete("/api/delete-quiz", {
      data: { id },
    });
    const updatedQuizzes = cachedQuizzes.filter((quiz) => quiz.id !== id);
    setCachedQuizzes(updatedQuizzes);
  };

  const viewNote = async (id: number) => {
    const res = await axios.post(
      `${process.env.URL}/api/get-summarized-notes`,
      {
        quizId: id,
      },
    );

    const notes = res.data;

    useQuizNoteStore.setState({ notes });
  };

  if (!userId) {
    return <SignIn />;
  }

  if (!cachedQuizzes || cachedQuizzes?.length === 0) {
    return (
      <div className="mt-12 flex h-full flex-col items-center justify-center space-y-4">
        <p>You have not studied any topics yet.</p>
        <Button>
          <Link href="/study">Get Started</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <h1>Study</h1>

      <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {cachedQuizzes?.map((quiz) => (
          <Card
            className={`h-full w-full animate-come-down overflow-hidden delay-[${Math.floor(Math.random() * 200) + 10}ms]`}
            key={quiz.id}
          >
            <Link href={`/study/${quiz.topic}`}>
              <CardHeader className="mb-4 flex flex-row items-center justify-between rounded-b-2xl duration-200 hover:bg-muted-foreground/15">
                <div>
                  <CardTitle>{quiz.topic}</CardTitle>
                  <CardDescription>
                    Studied {quiz.attempts.length} times
                  </CardDescription>
                </div>
              </CardHeader>
            </Link>
            <CardContent>
              <p>4 days left</p>
            </CardContent>
            <CardFooter className="gap-2">
              <Button
                variant="destructive"
                onClick={() => deleteQuiz(quiz.id)}
                className="flex-1 items-center justify-center gap-2"
              >
                Delete <TrashIcon />
              </Button>

              <Link href={`/study/quizzes/${quiz.id}`} className="flex-1">
                <Button
                  variant="secondary"
                  className="w-full items-center justify-center gap-2"
                >
                  View <EyeOpenIcon />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </ul>
    </>
  );
};

export default StudyPage;
