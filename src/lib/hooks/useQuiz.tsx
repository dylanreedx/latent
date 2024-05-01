import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const useQuiz = (topic: string) => {
  const { userId } = useAuth();
  const [quiz, setQuiz] = useState<any>({});

  useEffect(() => {
    const getQuiz = async () => {
      const quizes = await fetch("/api/study/quizes", {
        method: "GET",
      }).then((res) => res.json());

      const quizData = quizes.find(
        (quiz: any) => quiz.topic === decodeURI(topic),
      );

      setQuiz({
        numOfQuestions: quizData?.questions?.length,
        currentQuestionNumber: 0,
        questions: JSON.parse(quizData?.questions).questions,
      });
    };

    getQuiz();
  }, [topic, userId]);
  console.log(quiz);

  return quiz;
};

export { useQuiz };
