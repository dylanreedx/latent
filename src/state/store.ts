import { Question } from "@/types";
import { create } from "zustand";

export interface QuizStore {
  numOfQuestions: number;
  currentQuestionNumber: number;
  questions: Question[];
}

export const useQuizStore = create<QuizStore>((set) => ({
  numOfQuestions: 0,
  currentQuestionNumber: 0,
  questions: [],
}));
