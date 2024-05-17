"use client";
import { AssistantSkeleton } from "@/components/ui/assistant-skeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import QuestionCardSkeleton from "@/components/ui/question-card-skeleton";
import { Separator } from "@/components/ui/separator";
import Spinner from "@/components/ui/spinner";
import SuggestionsList from "@/components/ui/suggestions-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { UploadDropzone } from "@/lib/uploadthing";
import { useQuizStore } from "@/state/store";
import { EXAM_INPUT_PATTERN } from "@/utils/exam-pattern-match";
import axios from "axios";
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

  const [videoUrl, setVideoUrl] = React.useState("");
  const [isUploadTranscript, setIsUploadTranscript] = React.useState(false);
  const [isUploadingTranscriptDone, setIsUploadingTranscriptDone] =
    React.useState(false);
  const [transcriptHtml, setTranscriptHtml] = React.useState("");

  const [notes, setNotes] = React.useState<string>("");
  const [isUploadingNotes, setIsUploadingNotes] = React.useState(false);
  const [isUploadingNotesDone, setIsUploadingNotesDone] = React.useState(false);

  const handleSelectTopics = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    );
  };

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

  const handleTranscribe = async (url: string) => {
    setIsUploadTranscript(true);
    try {
      const res = await axios.post("/api/upload-yt", { videoUrl: url });

      setTranscriptHtml(res.data.transcriptHtml);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploadTranscript(false);
      setIsUploadingTranscriptDone(true);
    }
  };

  const handleUploadNotes = async (notes: string) => {
    setIsUploadingNotes(true);
    try {
      const res = await axios.post("/api/upload-notes", { userNotes: notes });
      console.log(res);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploadingNotes(false);
      setIsUploadingNotesDone(true);
    }
  };

  if (isGeneratingQuiz) {
    return (
      <div className="mx-auto">
        <QuestionCardSkeleton />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-2xl font-bold">Science-based studying.</h1>
        <p className="text-foreground">
          Test ur knowledge with science-based protocols to help recall and
          maintain information for ur upcoming exam.
        </p>
      </div>

      <Tabs defaultValue="notes" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="notes" className="flex-1">
            Notes
          </TabsTrigger>
          <TabsTrigger value="yt" className="flex-1">
            YouTube
          </TabsTrigger>
          <TabsTrigger value="pdf" className="flex-1">
            PDF
          </TabsTrigger>
        </TabsList>
        <TabsContent value="notes">
          <div className="flex flex-col gap-2">
            <Textarea
              placeholder="Type or paste your notes here."
              rows={6}
              disabled={isUploadingNotesDone}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <Button
              onClick={() => handleUploadNotes(notes)}
              disabled={isUploadingNotesDone || notes.length <= 20}
            >
              {isUploadingNotes ? (
                <Spinner />
              ) : isUploadingNotesDone ? (
                "Uploaded"
              ) : (
                "Upload your notes"
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="yt">
          <div className="flex flex-col gap-2">
            <Input
              placeholder="https://www.youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
            <Button
              onClick={() => handleTranscribe(videoUrl)}
              disabled={isUploadingTranscriptDone}
            >
              {isUploadTranscript ? (
                <Spinner />
              ) : isUploadingTranscriptDone ? (
                "Uploaded"
              ) : (
                "Transcribe Video"
              )}
            </Button>
            {transcriptHtml.length > 0 && (
              <Card className="relative">
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-background to-transparent p-4 font-bold" />
                <div
                  dangerouslySetInnerHTML={{ __html: transcriptHtml }}
                  className="prose h-60 max-w-none overflow-hidden p-4 [&>article>h1]:mb-4 [&>article>h1]:font-bold [&>article>h2]:mb-4 [&>article>h2]:font-semibold [&>article>h3]:mb-4 [&>article>h3]:font-medium [&>article>ol>li]:list-inside [&>article>ol>li]:pl-4 [&>article>ol]:list-decimal [&>article>p]:mb-4 [&>article>ul>li]:mb-2 [&>article>ul>li]:list-inside [&>article>ul>li]:pl-4 [&>article>ul]:list-disc"
                ></div>
              </Card>
            )}
          </div>
        </TabsContent>
        <TabsContent value="pdf">
          <div className="flex flex-col gap-4">
            {isAssistantLoading ||
              (assistedTopics.length <= 0 && (
                <UploadDropzone
                  appearance={{
                    button:
                      "ut-ready:bg-foreground ut-button:cursor-pointer ut-uploading:bg-foreground text-background w-full after:bg-background ut-readying:text-foreground",
                    container: "border border-2 border-primary/15 rounded-md",
                    label: "text-primary hover:text-muted-foreground",
                    uploadIcon: "text-primary",
                  }}
                  endpoint="pdfUploader"
                  onClientUploadComplete={(res) => {
                    console.log("done?");
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
              ))}

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
          </div>
        </TabsContent>
      </Tabs>
      <Separator className="my-4" />
      {isUploadingNotesDone && (
        <Card className="p-4">
          <h3 className="font-semibold">Your notes have been uploaded!</h3>
          <p className="text-muted-foreground">
            Generate your quiz here. Select what you need to study for.
          </p>
        </Card>
      )}
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
            <h3 className="text-base md:text-lg">
              Let&apos;s dial in what you need to study
            </h3>
            <p className="text-sm text-foreground/80 md:text-base">
              Skip or select topics to generate the most efficient quiz for you.
              It is best to dial in the topics you need to study to get a more
              efficient quiz.
            </p>
          </div>
          <ul className="flex flex-wrap gap-2 text-sm md:text-base">
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
            <Button className="w-full" variant="ghost" onClick={handleGetQuiz}>
              Skip
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
