import { EmbedAndIndexNotes } from "@/utils/embed-index-notes";
import { auth } from "@clerk/nextjs/server";

type Body = {
  userNotes: string;
};

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return Response.json("Unauthorized", { status: 401 });
  }
  const { userNotes }: Body = await request.json();
  console.log("userNotes", userNotes);
  try {
    const { notes } = await EmbedAndIndexNotes(userNotes, userId);
    console.log("Embedded and indexed notes");
    return Response.json({ notes });
  } catch (error) {
    console.error("Error embedding and indexing notes:", error);
    return Response.json("Error embedding and indexing notes", { status: 500 });
  }
}
