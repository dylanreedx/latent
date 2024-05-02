"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import { UploadDropzone } from "@/lib/uploadthing";
import { useQuizStore } from "@/state/store";
import { useRouter } from "next/navigation";
import React from "react";

export default function Home() {
  const router = useRouter();
  const [promptState, setPromptState] = React.useState({
    topic: "",
    timeline: "",
  });
  const [quizLoading, setQuizLoading] = React.useState(false);
  const [pdf, setPdf] = React.useState<{ pdfText: string; pdfName: string }[]>(
    [],
  );

  const suggestions = [
    "i have a biology exam in 4 days",
    "i have a chemistry exam in a week",
    "i have a physics exam in a day",
    "i have a economics exam in two days",
    "i have a data structure and algorithms exam in two weeks",
  ];

  const topics = ["chemistry", "math", "biology", "physics", "history"];
  const timelines = [
    "a week",
    "two weeks",
    "a month",
    "a week",
    "a day",
    "two days",
    "a few days",
  ];

  // @ts-ignore - matching groups should work but im being yelled at by ts
  const EXAM_INPUT_PATTERN = /i have a (?<topic>[^"]+) exam in (?<timeline>.+)/;
  const handleGetQuiz = async () => {
    setQuizLoading(true);
    const res = await fetch("/api/study/quiz", {
      method: "post",
      body: JSON.stringify({
        prompt: `I have a ${promptState.topic} exam in ${promptState.timeline}`,
        timeline: promptState.timeline,
      }),
    });
    if (res.ok) {
      const { questions } = await res.json();
      useQuizStore.setState((state) => (state.questions = questions));
      router.push(`/study/${encodeURIComponent(promptState.topic)}`);
      setQuizLoading(false);
    }
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
          <Button
            onClick={() => {
              handleGetQuiz();
            }}
          >
            {quizLoading ? <Spinner /> : "Study"}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, idx) => (
            <Button
              variant="outline"
              key={idx}
              onClick={() => {
                const match = EXAM_INPUT_PATTERN.exec(suggestion);
                if (match) {
                  setPromptState({
                    topic: match.groups!.topic,
                    timeline: match.groups!.timeline,
                  });
                  // handleGetQuiz();
                } else {
                  console.log("No match");
                }
              }}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
