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
  const [prompt, setPrompt] = React.useState("");
  const [pdf, setPdf] = React.useState<{ pdfText: string; pdfName: string }[]>(
    [],
  );

  const handleGetQuiz = async () => {
    const res = await fetch("/api/study/quiz", {
      method: "post",
      body: JSON.stringify({ prompt }),
    });
    if (res.ok) {
      const { questions } = await res.json();
      // store
      useQuizStore.setState((state) => (state.questions = questions));
      router.push(`/study/${encodeURIComponent(prompt)}`);
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

        <div className="flex gap-2">
          <Input
            placeholder="I have an exam for ..."
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
          />
          <Button
            onClick={() => {
              handleGetQuiz();
            }}
          >
            Study
          </Button>
        </div>
      </div>
    </div>
  );
}
