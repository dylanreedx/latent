import { db } from "@/db/db";
import { userNotes, quizzes } from "@/db/schema";
import { convertToJSON } from "@/utils/convert-to-json";
import { getEmbedding } from "@/utils/get-embedding";
import { auth } from "@clerk/nextjs/server";
import { Index } from "@upstash/vector";
import { eq } from "drizzle-orm";
import { OpenAI } from "openai";

const oai = new OpenAI({
  apiKey: process.env.OPENAI_API_TOKEN,
});
const index = new Index({
  url: process.env.UPSTASH_URL,
  token: process.env.UPSTASH_INDEX_TOKEN,
});

type ResultQuery = {
  id: string;
  score: number;
  metadata: { text: string[] };
};

export async function POST(request: Request) {
  type Query = {
    prompt: string;
    topic: string;
    timeline: string;
  };
  const { userId } = auth();
  if (!userId) {
    return Response.json("Unauthorized", { status: 401 });
  }
  const q: Query = await request.json();
  const embedding = await getEmbedding(
    q.topic || "What is the capital of France?",
  );
  console.log("prompt", q.topic);
  console.log("embedding", embedding);

  const queryResult = (await index.query({
    vector: embedding,
    topK: 20,
    includeMetadata: true,
  })) as ResultQuery[];
  const top3Chunks = queryResult.slice(0, 3);

  let context: string = top3Chunks
    .flatMap((chunk) => chunk.metadata.text)
    .join("\n\n");

  // If the context is still too large, truncate it
  const MAX_CONTEXT_LENGTH = 8000;
  if (context.length > MAX_CONTEXT_LENGTH) {
    context = context.slice(0, MAX_CONTEXT_LENGTH) + "\n\n...";
  }

  // Fetch context from pdfData table if not available in vector database
  if (!context) {
    const chunkId = top3Chunks[0].id; // Get the id from the first chunk
    const pdf = await db.query.pdfData.findFirst({
      where: (model, { eq }) => eq(model.id, chunkId),
    });
    if (pdf && pdf.text) {
      context = pdf.text;
    }
  }

  console.log(context);

  const prompt = `Using the following information:

      Here is context from the student's lecture slides:
      ${context}

      If the context isn't sufficient, you can generate a quiz with information you think is relevant to the topic.

      Create 3 multiple-choice questions about ${q.prompt}. Each question should have 4 answer options. Format the questions and answers as a JSON array like this:

      [
        {
          "question": "...",
          "options": [
            "...",
            "...",
            "...",
            "..."
          ],
          "answer": "..."
        },
        ...
      ]
  `;

  const input = {
    top_p: 1,
    prompt,
    temperature: 0.75,
    system_prompt:
      "You are an expert at helping students learn and study. By using science-based practices you are creating assessments like multiple choice questions to help students learn better. You are creating multiple-choice questions about various/all/any subjects. Each question should have 4 answer options. Format the questions and answers as a JSON array.",
    max_new_tokens: 800,
    repetition_penalty: 1,
  };

  const oaiResponse = await oai.chat.completions.create({
    messages: [
      { role: "system", content: input.system_prompt },
      { role: "user", content: input.prompt },
    ],
    max_tokens: 800,
    temperature: 0.75,
    model: "gpt-3.5-turbo-0125",
  });

  const quiz = oaiResponse.choices[0].message.content as string;
  const formattedQuestions = convertToJSON(quiz);

  if ("error" in formattedQuestions) {
    return Response.json(formattedQuestions, { status: 400 });
  }

  const createdQuiz = await db
    .insert(quizzes)
    .values({
      topic: q.prompt,
      questions: JSON.stringify(formattedQuestions),
      timeline: q.timeline,
      context,
      userId,
    })
    .returning({ id: quizzes.id });

  try {
    const note = await db.query.userNotes.findFirst({
      where: (model, { eq, and, isNull }) =>
        and(isNull(model.quizId), eq(model.userId, userId)),
    });

    if (!note) {
      return Response.json({ questions: formattedQuestions, context });
    }

    console.log("updating userNotes", note.id, createdQuiz[0].id);

    await db
      .update(userNotes)
      .set({ quizId: createdQuiz[0].id })
      .where(eq(userNotes.id, note.id));
  } catch (error) {
    console.log("error updating userNotes", error);
  }

  return Response.json({ questions: formattedQuestions, context });
}
