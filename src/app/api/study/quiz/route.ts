import { db } from "@/db/db";
import { quizzes } from "@/db/schema";
import { convertToJSON } from "@/utils/convert-to-json";
import { getEmbedding } from "@/utils/get-embedding";
import { auth } from "@clerk/nextjs/server";
import { Index } from "@upstash/vector";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_AUTH,
});
const index = new Index({
  url: process.env.UPSTASH_URL,
  token: process.env.UPSTASH_INDEX_TOKEN,
});

export async function POST(request: Request) {
  type Query = {
    prompt: string;
  };
  const { userId } = auth();
  if (!userId) {
    return Response.json("Unauthorized", { status: 401 });
  }
  const q: Query = await request.json();
  const embedding = await getEmbedding(
    q.prompt || "What is the capital of France?",
  );

  const queryResult = await index.query({
    vector: embedding,
    topK: 5,
    includeMetadata: true,
  });

  const MAX_CONTEXT_LENGTH = 2000; // Adjust this value based on your LLM's prompt size limit
  const textChunks = queryResult
    .flatMap((match) => match.metadata?.text || [])
    .filter((chunk) => {
      const c = chunk as string;
      return c.length <= MAX_CONTEXT_LENGTH;
    }); // Filter out chunks that exceed the maximum length

  let context = textChunks.join("\n\n");

  // If the context is still too large, truncate it
  if (context.length > MAX_CONTEXT_LENGTH) {
    context = context.slice(0, MAX_CONTEXT_LENGTH) + "\n\n...";
  }

  const prompt = `Using the following information:

      Here is context from the student's lecture slides:
      ${context}

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

  const questions = await replicate.run("meta/llama-2-7b-chat", {
    input,
  });

  const formattedQuestions = convertToJSON(questions as string[]);

  if ("error" in formattedQuestions) {
    return Response.json(formattedQuestions, { status: 400 });
  }

  await db.insert(quizzes).values({
    topic: q.prompt,
    questions: JSON.stringify(formattedQuestions),
    userId,
  });

  console.log("Questions:", formattedQuestions[0]);

  return Response.json({ questions: formattedQuestions });
}
