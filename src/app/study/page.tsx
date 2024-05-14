"use client";
import { AssistantSkeleton } from "@/components/ui/assistant-skeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import QuestionCardSkeleton from "@/components/ui/question-card-skeleton";
import Spinner from "@/components/ui/spinner";
import SuggestionsList from "@/components/ui/suggestions-list";
import { UploadDropzone } from "@/lib/uploadthing";
import { useQuizStore } from "@/state/store";
import { EXAM_INPUT_PATTERN } from "@/utils/exam-pattern-match";
import { useRouter } from "next/navigation";
import React from "react";

export default function Home() {
  const router = useRouter();
  const [promptState, setPromptState] = React.useState({
    topic: "",
    timeline: "",
  });
  const [isAssistantLoading, setIsAssistantLoading] = React.useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = React.useState(false);
  const [pdf, setPdf] = React.useState<{ pdfText: string; pdfName: string }[]>(
    [],
  );
  const [assistedTopics, setAssistedTopics] = React.useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = React.useState<string[]>([]);

  const handleQuizAssistant = async () => {
    setIsAssistantLoading(true);
    const res = await fetch("/api/study/assistant", {
      method: "post",
      body: JSON.stringify({
        prompt: `I have a ${promptState.topic} exam in ${promptState.timeline}`,
        topic: promptState.topic,
        timeline: promptState.timeline,
      }),
    });
    if (res.ok) {
      const topics = await res.json();
      setAssistedTopics(topics);
      setIsAssistantLoading(false);
    }
  };
  const handleGetQuiz = async () => {
    setIsGeneratingQuiz(true);
    const res = await fetch("/api/study/quiz", {
      method: "post",
      body: JSON.stringify({
        prompt: `I have a ${promptState.topic} exam in ${promptState.timeline}`,
        topic: `${promptState.topic} ${selectedTopics.join(" ") ?? ""}`,
        timeline: promptState.timeline,
      }),
    });
    if (res.ok) {
      const { questions } = await res.json();
      useQuizStore.setState((state) => (state.questions = questions));
      router.push(
        `/study/${encodeURIComponent(`I have a ${promptState.topic} exam in ${promptState.timeline}`)}`,
      );
    }
  };
  const handleSelectTopics = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    );
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-2xl font-bold">Science-based studying.</h1>
        <p className="text-foreground">
          Test ur knowledge with science-based protocols to help recall and
          maintain information for ur upcoming exam.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {assistedTopics.length <= 0 && (
          <UploadDropzone
            appearance={{
              button:
                "ut-ready:bg-foreground ut-button:cursor-pointer ut-uploading:bg-foreground text-background w-full after:bg-background ut-readying:text-foreground",
              allowedContent: "hidden",
              container: "border border-2 border-primary/15 rounded-md",
              label: "text-primary hover:text-muted-foreground",
              uploadIcon: "text-primary",
            }}
            endpoint="pdfUploader"
            config={{
              mode: "manual",
            }}
            onClientUploadComplete={(res) => {
              res.map((r) => {
                setPdf((prev) => [
                  ...prev,
                  {
                    pdfText: r.serverData.pdfText,
                    pdfName: r.serverData.pdfName,
                  },
                ]);
              });
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
          />
        )}

        <ul className="flex flex-wrap gap-2">
          {pdf.length > 0 &&
            pdf.map((p, idx) => (
              <li key={idx}>
                <Card className="relative h-32 w-32 overflow-hidden p-2 text-[0.5rem]">
                  {p.pdfText}
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black to-transparent p-4 font-bold">
                    <span>{p.pdfName}.pdf</span>
                  </div>
                </Card>
              </li>
            ))}
        </ul>

        <div className="flex items-center gap-2">
          <h3 className="text-nowrap">I have a</h3>

          <Input
            placeholder="History, Math, Science, ..."
            onChange={(e) => {
              setPromptState((prev) => ({
                ...prev,
                topic: e.target.value,
              }));
            }}
            value={promptState.topic}
          />

          <h3 className="text-nowrap">exam in</h3>
          <Input
            className="w-1/2"
            placeholder="a week, 2 days, month ..."
            onChange={(e) => {
              setPromptState((prev) => ({
                ...prev,
                timeline: e.target.value,
              }));
            }}
            value={promptState.timeline}
          />
          {assistedTopics.length <= 0 && (
            <Button
              onClick={() => {
                handleQuizAssistant();
              }}
            >
              Study
            </Button>
          )}
        </div>
        {!isAssistantLoading && assistedTopics.length <= 0 && (
          <SuggestionsList setPromptState={setPromptState} />
        )}
        {isAssistantLoading && <AssistantSkeleton />}
        {assistedTopics.length > 0 && !isGeneratingQuiz && (
          <Card className="mt-4 space-y-4 p-6">
            <div>
              <h3 className="text-lg">
                Let&apos;s dial in what you need to study
              </h3>
              <p className="text-foreground/80">
                Skip or select topics to generate the most efficient quiz for
                you.
              </p>
            </div>
            <ul className="flex flex-wrap gap-2">
              {assistedTopics.map((topic, idx) => (
                <li key={idx}>
                  <Button
                    variant={
                      selectedTopics.includes(topic) ? "default" : "outline"
                    }
                    onClick={() => handleSelectTopics(topic)}
                  >
                    {topic}
                  </Button>
                </li>
              ))}
            </ul>
            <div className="space-y-2">
              <Button className="w-full" onClick={handleGetQuiz}>
                Generate Quiz
              </Button>
              <Button className="w-full" variant="ghost">
                Skip
              </Button>
            </div>
          </Card>
        )}
        {isGeneratingQuiz && (
          <div className="mx-auto">
            <QuestionCardSkeleton />
          </div>
        )}
      </div>
    </div>
  );
}
