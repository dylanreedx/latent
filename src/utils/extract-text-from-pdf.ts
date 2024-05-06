import fs from "fs";
import { pdfToText } from "pdf-ts";

export async function extractTextFromPDF(pdfFilePath: string, title: string) {
  const pdf = fs.readFileSync(pdfFilePath);
  const text = await pdfToText(pdf);

  const cleanedText = text
    .replace(/(6\.0001 LECTURE 1\n\d+|image courtesy.*|[◦›])/g, "")
    .replace(/[\uFFFD\u200B\uFEFF]/g, "") // remove Unicode replacement characters and other unwanted characters
    .replace(/[≤≥]/g, "") // remove mathematical symbols
    .replace(/[$$$$]/g, "") // remove square brackets
    .replace(/[$$$$$$$$\{\}]/g, "") // remove brackets and parentheses
    .replace(/[\u0391-\u03C9]/g, "") // remove Greek letters
    .replace(/[\u2200-\u22FF]/g, "") // remove mathematical operators
    .replace(/[\u2100-\u214F]/g, "") // remove letterlike symbols
    .replace(/\s+/g, " ")
    .replace(/\\n/g, " ") // remove line breaks
    .replace(//g, "") // clean this charcter up: 
    .trim()
    .toLowerCase();

  return { text: cleanedText, title };
}
