import { db } from "@/db/db";

type Body = {
  quizId: string;
};
export async function POST(request: Request) {
  const body = (await request.json()) as Body;
  console.log("quiz id", body.quizId);
  const { quizId } = body;

  const note = await db.query.userNotes.findFirst({
    where: (model, { eq }) => eq(model.quizId, Number(quizId)),
  });

  console.log("found note", note);

  return Response.json({ note });
}
