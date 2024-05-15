import { TranscriptResponse, YoutubeTranscript } from "youtube-transcript";
import { randomUUID } from "crypto";
import { EmbedAndIndexTranscript } from "@/utils/embed-index-transcript";
import { auth } from "@clerk/nextjs/server";

type Body = {
  videoUrl: string;
};

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return Response.json("Unauthorized", { status: 401 });
  }
  const { videoUrl }: Body = await request.json();
  const transcript = await YoutubeTranscript.fetchTranscript(videoUrl);
  const title = randomUUID();
  try {
    const { summary, fullTranscript } = await EmbedAndIndexTranscript(
      transcript,
      videoUrl,
      title,
      title,
    );
    const transcriptHtml = summary.replace(/```html/g, "").replace(/```/g, "");
    console.log("Embedded and indexed transcript");
    return Response.json({ transcript: fullTranscript, transcriptHtml });
  } catch (error) {
    console.error("Error embedding and indexing transcript:", error);
  }
}
