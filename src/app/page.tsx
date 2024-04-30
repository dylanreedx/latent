"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UploadDropzone } from "@/lib/uploadthing";
import { useQuizStore } from "@/state/store";
import { useRouter } from "next/navigation";
import React from "react";

export default function Home() {
  const router = useRouter();
  const [promptTopic, setPromptTopic] = React.useState("");
  const [promptTimeline, setPromptTimeline] = React.useState("");
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

  // @ts-ignore This file is not being type-checked
  const inputRegex = /i have a (?<topic>[^"]+) exam in (?<timeline>.+)/;
  const handleGetQuiz = async () => {
    const res = await fetch("/api/study/quiz", {
      method: "post",
      body: JSON.stringify({
        prompt: `I have a ${promptTopic} exam in ${promptTimeline}`,
      }),
    });
    if (res.ok) {
      const { questions } = await res.json();
      // store
      useQuizStore.setState((state) => (state.questions = questions));
      router.push(`/study/${encodeURIComponent(promptTopic)}`);
      console.log(useQuizStore.getState().questions);
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
            button: "bg-foreground text-background w-full",
            allowedContent: "hidden",
            container: "border border-2 border-primary/25 rounded-md",
            label: "text-primary",
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
            console.log("Files: ", res);
            alert("Upload Completed");
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
          {/* <Input
            placeholder="I have an exam for ..."
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
          /> */}
          <h3 className="text-nowrap">I have a</h3>

          <Input
            placeholder="History, Math, Science, ..."
            onChange={(e) => setPromptTopic(e.target.value)}
            value={promptTopic}
          />

          <h3 className="text-nowrap">exam in</h3>
          <Input
            className="w-1/2"
            placeholder="a week, 2 days, month ..."
            onChange={(e) => setPromptTimeline(e.target.value)}
            value={promptTimeline}
          />
          <Button
            onClick={() => {
              handleGetQuiz();
            }}
          >
            Study
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, idx) => (
            <Button
              variant="outline"
              key={idx}
              onClick={() => {
                const match = inputRegex.exec(suggestion);
                console.log("Match:", match);
                if (match) {
                  console.log("Groups:", match.groups);
                  setPromptTopic(match.groups!.topic);
                  setPromptTimeline(match.groups!.timeline);
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
