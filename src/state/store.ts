import { Question } from "@/types";
import { create } from "zustand";

export interface QuizStore {
  id: number;
  numOfQuestions: number;
  currentQuestionNumber: number;
  questions: Question[];
  context: string;
  quizAttemptId: number;
}

export const useQuizStore = create<QuizStore>((set) => ({
  id: 0,
  numOfQuestions: 0,
  currentQuestionNumber: 0,
  questions: [],
  context: "",
  quizAttemptId: 0,
}));
