import {OpenAIEmbeddings} from '@langchain/openai';

export async function getEmbedding(text: string) {
  const model = new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_TOKEN,
    model: 'text-embedding-3-small',
  });

  const embedding = await model.embedQuery(text);
  return embedding;
}
