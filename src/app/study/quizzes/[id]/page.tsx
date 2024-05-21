"use client";

import QuestionCardSkeleton from "@/components/ui/question-card-skeleton";
import Spinner from "@/components/ui/spinner";
import { useQuizNoteStore } from "@/state/store";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Notes({ params }: { params: { id: number } }) {
  const quizNoteStore = useQuizNoteStore();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchNotes = async () => {
      const res = await axios.post(`/api/get-summarized-notes`, {
        quizId: params.id,
      });

      const notes = res.data;

      useQuizNoteStore.setState({ notes });
      setIsLoading(false);
    };
    fetchNotes();
  }, []);

  console.log(quizNoteStore.notes);

  if (isLoading) {
    return (
      <div className="mx-auto">
        <QuestionCardSkeleton />
      </div>
    );
  }

  return (
    <div>
      <h1>{JSON.stringify(quizNoteStore.notes)}</h1>
    </div>
  );
}
