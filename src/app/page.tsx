"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadDropzone } from "@/lib/uploadthing";

export default function Home() {
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
