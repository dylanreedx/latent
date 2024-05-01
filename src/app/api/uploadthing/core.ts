import { downloadPdf } from "@/utils/download-pdf";
import { EmbedAndIndexText } from "@/utils/embed-index-text";
import { extractTextFromPDF } from "@/utils/extract-text-from-pdf";
import { uploadPdf } from "@/utils/upload-pdf";
import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const fileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  pdfUploader: f({ pdf: { maxFileSize: "1MB", maxFileCount: 10 } })
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

      try {
        const { text, title } = await uploadPdf(file);

        console.log("Uploaded PDF:", title, "by", metadata.userId);

        return { uploadedBy: metadata.userId, pdfText: text, pdfName: title };
        // return {uploadedBy: metadata.userId,}
      } catch (error) {
        console.error("Error uploading PDF:", error);
        return "Failed to upload PDF";
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof fileRouter;
