import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { v4 } from "uuid";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const fileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  pdfUploader: f({ pdf: { maxFileSize: "4MB", maxFileCount: 10 } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = auth();

      // If you throw, the user will not be able to upload
      if (!user.userId) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);
      console.log(process.env.ENV);

      const uploadPdf = await fetch(`${process.env.ENV}/upload-pdf`, {
        body: JSON.stringify({ url: file.url, name: v4() }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!uploadPdf.ok) {
        throw new UploadThingError("Error uploading file");
      }

      const { text, title } = await uploadPdf.json();

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId, pdfText: text, pdfName: title };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof fileRouter;
