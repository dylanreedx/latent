import { Question } from "@/types";
import { create } from "zustand";

export interface QuizStore {
  id: number;
  numOfQuestions: number;
  currentQuestionNumber: number;
  questions: Question[];
  context: string;
  score: number;
  quizAttemptId: number;
}

export const useQuizStore = create<QuizStore>((set) => ({
  id: 0,
  numOfQuestions: 0,
  currentQuestionNumber: 0,
  questions: [],
  context: "",
  score: 0,
  quizAttemptId: 0,
}));

export interface QuizNoteStore {
  notes: string;
}

export const useQuizNoteStore = create<QuizNoteStore>((set) => ({
  notes: "",
}));
