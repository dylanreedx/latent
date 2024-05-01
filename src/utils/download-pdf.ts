import axios from "axios";
import fs from "fs";

export async function downloadPdf(url: string, name: string): Promise<string> {
  const response = await axios.get(url, {
    responseType: "arraybuffer",
  });

  const fileData = Buffer.from(response.data);

  const pdfFilePath = `/tmp/${name}.pdf`;

  try {
    fs.writeFileSync(pdfFilePath, fileData);
    return pdfFilePath;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    return "Failed to extract text from PDF";
  }
}
