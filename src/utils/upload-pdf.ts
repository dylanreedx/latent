import { downloadPdf } from "./download-pdf";
import { EmbedAndIndexText } from "./embed-index-text";
import { extractTextFromPDF } from "./extract-text-from-pdf";

type File = {
  name: string;
  url: string;
};
export async function uploadPdf(file: File, userId: string) {
  console.log("file:", file);

  console.time("upload-pdf");

  const pdfFilePath = await downloadPdf(file.url, file.name);
  console.timeLog("upload-pdf", "Downloaded PDF");

  const { text, title } = await extractTextFromPDF(
    pdfFilePath,
    file.name,
    userId,
  );
  console.timeLog("upload-pdf", "Extracted text from PDF");

  try {
    await EmbedAndIndexText(text, title);
  } catch (error) {
    console.error("Error embedding and indexing text:", error);
  }
  console.timeLog("upload-pdf", "Embedded and indexed text");

  console.timeEnd("upload-pdf");
  return { text, title };
}
