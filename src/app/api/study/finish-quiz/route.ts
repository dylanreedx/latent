import { db } from "@/db/db";
import { quizAttempts } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, desc, eq, isNull } from "drizzle-orm";
import OpenAI from "openai";

const oai = new OpenAI({
  apiKey: process.env.OPENAI_API_TOKEN,
});
export async function POST(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return Response.json("Unauthorized", { status: 401 });
  }

  type Body = {
    quizAttemptId: number;
    score: number;
    maxScore: number;
    quizId: number;
  };
  const body: Body = await request.json();

  console.log(body);

  await db
    .update(quizAttempts)
    .set({
      finishedAt: new Date().toISOString(),
      score: body.score,
      maxScore: body.maxScore,
      grade: `${Math.round((body.score / body.maxScore) * 100)}%`,
    })
    .where(eq(quizAttempts.id, body.quizAttemptId));

  // get all the quiz question attemps for the quiz attempt and use them for the LLM to see their performance and the understanding better
  const questions = await db.query.quizAttemptQuestions.findMany({
    where: (model, { eq, and, or }) =>
      or(
        eq(model.quizAttemptId, body.quizAttemptId),
        eq(model.quizAttemptId, body.quizAttemptId - 3),
        eq(model.quizAttemptId, body.quizAttemptId - 2),
        eq(model.quizAttemptId, body.quizAttemptId - 1),
      ),
  });

  // questions for last 3 attempts
  const last3Attempts = await db.query.quizAttempts.findMany({
    where: (model, { eq, and }) =>
      and(eq(model.userId, userId), eq(model.quizId, body.quizId)),
    orderBy: (model, { desc }) => [desc(model.finishedAt)],
    limit: 3,
  });

  console.log(questions);
  console.log("last 3: ", last3Attempts);

  // i want to check the users answers with questions[0].correctAnswer and questions[0].userAnswer then pass it to the LLM to generate a report of the users performance and understanding

  const newestQuestionsForLLM = questions.map((question) => {
    return {
      question: question.question,
      correctAnswer: question.correctAnswer,
      userAnswer: question.userAnswer,
      isCorrect: question.isCorrect === 1 ? true : false,
    };
  });

  const previousQuestionsForLLM = last3Attempts.map((attempt) => {
    return last3Attempts.map((question) => {
      return {
        grade: question.grade,
        finishedAt: question.finishedAt,
      };
    });
  });

  const reportPrompt = `
    A user has just taken a quiz and answered the following questions:

    ${JSON.stringify(newestQuestionsForLLM)}

    ${previousQuestionsForLLM.length > 0 ? `Here is the user's grades and completion times for the previous 3 attempts: ${JSON.stringify(previousQuestionsForLLM)}` : ""}

    Generate a report on the user's performance and understanding of the topic. Take in account, if given the previous attempts, how the user has improved or not improved. Though there could be a chance that you weren't provided with the previous attempts due to the user just starting to take quizzes.

    The report should be a paragraph or two long and should be written in a way that is easy to understand for the user. With proactive suggestions on how the user can improve their understanding and performance in the future. Write the report as if you were a teacher giving feedback to a student in an informal way, casually, effective and friendly.

    Here should be the ONLY format:
    - key points
    - suggestions for improvement/practice/understanding (focus on points rather than 'blocks' of text)

    Return the response as HTML (h1, h2, h3, h4, p, ul, li, etc.)
  `;

  const previousPrompt = `
  ${previousQuestionsForLLM.length > 0 ? `Here is the user's grades and completion times for the previous 3 attempts. : ${JSON.stringify(previousQuestionsForLLM)}` : ""}
  `;
  const input = {
    top_p: 1,
    prompt: reportPrompt,
    temperature: 0.75,
    max_new_tokens: 800,
    repetition_penalty: 1,
  };

  const oaiResponse = await oai.chat.completions.create({
    messages: [{ role: "user", content: input.prompt }],
    max_tokens: 800,
    temperature: 0.75,
    model: "gpt-3.5-turbo-0125",
  });

  const report = oaiResponse.choices[0].message.content as string;
  console.log(report);

  await db
    .update(quizAttempts)
    .set({ report })
    .where(eq(quizAttempts.id, body.quizAttemptId));

  // might have to come back to this. i would rather not create a new quiz attempt every time we answer a question '/api/study/answer-question'
  await db
    .delete(quizAttempts)
    .where(
      and(eq(quizAttempts.userId, userId), isNull(quizAttempts.finishedAt)),
    );

  return Response.json({ success: true, report });
}
