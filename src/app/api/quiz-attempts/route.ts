import { db } from "@/db/db";
import { auth } from "@clerk/nextjs/server";

type Body = {
  ids: number[];
};

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  const body: Body = await request.json();

  // find all the quiz attemps with the given ids
  const attempts = await db.query.quizAttempts.findMany({
    where: (model, { inArray }) => inArray(model.id, body.ids),
  });

  console.log(attempts);

  return Response.json(attempts);
}
