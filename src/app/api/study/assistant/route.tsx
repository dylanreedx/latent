import { convertToJSON } from "@/utils/convert-to-json";
import OpenAI from "openai";

type Query = {
  prompt: string;
  topic: string;
  timeline: string;
};
const oai = new OpenAI({
  apiKey: process.env.OPENAI_API_TOKEN,
});
export async function POST(request: Request) {
  const q: Query = await request.json();

  const prompt = `
    A user wants to generate a quiz for ${q.topic} in ${q.timeline}. 

    to generate the best quiz, you need to be sure that the topic (${q.topic}) itself isn't too generic. If it is, it needs to be narrowed down to a specific subject. For the best questions

    can you give me a list of 3-5 topics that are more narrowed down and still related to ${q.topic}?

    the list of topics should be in the format of a JSON array. AND ONLY RETURN THE ARRAY.
    `;

  const input = {
    top_p: 1,
    prompt,
    temperature: 0.75,
    system_prompt:
      "You are an expert at helping students learn and study. By using science-based practices you are creating assessments like multiple choice questions to help students learn better.",
    max_new_tokens: 400,
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

  const response = oaiResponse.choices[0].message.content as string;
  const topics = convertToJSON(response);

  if ("error" in topics) {
    return Response.json(topics, { status: 400 });
  }

  return Response.json(topics);
}
