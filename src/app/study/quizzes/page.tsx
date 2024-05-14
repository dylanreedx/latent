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
import { TrashIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import axios from "axios";

interface Quiz {
  id: number;
  topic: string;
  attempts: any[];
}

const StudyPage = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const { userId } = useAuth();

  useEffect(() => {
    const fetchQuizzes = async () => {
      const res = await axios.post("/api/get-quizzes", {
        getAttempts: true,
      });
      const { quizzes } = res.data;
      // Update the state with the processed data
      setQuizzes(quizzes);
    };

    fetchQuizzes();
  }, []);

  const deleteQuiz = async (id: number) => {
    await axios.delete("/api/delete-quiz", {
      data: { id },
    });
    setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz.id !== id));
  };

  console.log(quizzes);

  if (!userId) {
    return <SignIn />;
  }

  if (!quizzes || quizzes.length === 0) {
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
        {quizzes?.map((quiz) => (
          <Card className="h-full w-full overflow-hidden" key={quiz.id}>
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
            <CardFooter>
              <Button
                variant="secondary"
                onClick={() => deleteQuiz(quiz.id)}
                className="w-full items-center justify-center gap-2"
              >
                Delete <TrashIcon />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </ul>
    </>
  );
};

export default StudyPage;
