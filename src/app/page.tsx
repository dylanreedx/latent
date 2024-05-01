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

  // @ts-ignore This file is not being type-checked
  const inputRegex = /i have a (?<topic>[^"]+) exam in (?<timeline>.+)/;
  const handleGetQuiz = async () => {
    setQuizLoading(true);
    const res = await fetch("/api/study/quiz", {
      method: "post",
      body: JSON.stringify({
        prompt: `I have a ${promptTopic} exam in ${promptTimeline}`,
      }),
    });
    if (res.ok) {
      const { questions } = await res.json();
      useQuizStore.setState((state) => (state.questions = questions));
      router.push(`/study/${encodeURIComponent(promptTopic)}`);
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
            {quizLoading ? (
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="dark:muted-foreground h-6 w-6 animate-spin fill-background text-gray-200"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              "Study"
            )}
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
