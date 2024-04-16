"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import QuestionCard from "@/components/ui/question-card";
import QuestionOptions from "@/components/ui/question-options";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";

const questions = [
  {
    question: "Why do we need dictionaries in programming?",
    options: [
      "They allow us to store and retrieve data efficiently.",
      "They provide a way to organize and manage complex data structures.",
      "They are a fundamental data structure in computer science.",
      "They are used to implement the concept of recursion in programming.",
    ],
    answer: "They allow us to store and retrieve data efficiently.",
  },
  {
    question:
      "What is the advantage of using dictionaries over other data structures?",
    options: [
      "They are faster and more efficient than lists.",
      "They provide a way to store and retrieve data in a organized manner.",
      "They are more flexible and can be used in a variety of contexts.",
      "They are easier to implement and understand than other data structures.",
    ],
    answer: "They are faster and more efficient than lists.",
  },
  {
    question: "Why are dictionaries also known as 'associative arrays'?",
    options: [
      "Because they allow us to associate a key with a value.",
      "Because they are a type of array that is associated with a particular value.",
      "Because they are a way of storing and retrieving data in an associative manner.",
      "Because they are a fundamental data structure in computer science.",
    ],
    answer:
      "Because they are a way of storing and retrieving data in an associative manner.",
  },
];

export default function Home() {
  const question = questions[0];
  return (
    <main className="flex min-h-screen flex-col gap-12 p-24">
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
              // Do something with the response
              console.log("Files: ", res);
              alert("Upload Completed");
            }}
            onUploadError={(error: Error) => {
              // Do something with the error.
              alert(`ERROR! ${error.message}`);
            }}
          />

          <div className="flex gap-2">
            <Input placeholder="I have an exam for ..." />
            <Button>Study</Button>
          </div>
        </div>
      </div>
    </main>
  );
}
