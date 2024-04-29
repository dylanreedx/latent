import { db } from "@/db/db";
import { quizes } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return Response.json("Unauthorized", { status: 401 });
  }
  const ENV = process.env.ENV as string;

  const body: {
    prompt: string;
  } = await request.json();
  console.log(body.prompt);

  if (!body.prompt) {
    return Response.json("Prompt is required", { status: 400 });
  }

  try {
    const getQuiz = await fetch(`${ENV}/quiz`, {
      body: body.prompt,
      headers: {
        "Content-Type": "plain/text",
      },
      method: "POST",
    });

    if (getQuiz.ok) {
      const { questions } = await getQuiz.json();
      console.log(questions);
      await db.insert(quizes).values({
        topic: body.prompt,
        questions: JSON.stringify(questions),
        userId,
      });
      return Response.json(questions);
    }
  } catch (error) {
    return Response.json("Error fetching quiz", { status: 500 });
  }
}
