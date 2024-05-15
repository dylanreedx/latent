import { OpenAIEmbeddings } from "@langchain/openai";
import { Index } from "@upstash/vector";
import pQueue from "p-queue";

const index = new Index({
  url: process.env.UPSTASH_URL,
  token: process.env.UPSTASH_INDEX_TOKEN,
});

const model = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_TOKEN,
  model: "text-embedding-3-small",
  dimensions: 1536,
});

const queue = new pQueue({ concurrency: 5 }); // adjust concurrency based on your system

function safeMap<T, U>(
  array: (T | void)[],
  callback: (item: T) => U,
  maxLength: number = 45000,
): U[] {
  return array
    .filter((item): item is T => item !== undefined && item !== null)
    .map((item) => {
      const result = callback(item);
      if (typeof result === "string" && result.length > maxLength) {
        return result.substring(0, maxLength) as U; // Add the type assertion
      }
      return result;
    });
}

function safeString(str: string, maxLength: number = 2000): string {
  if (str.length > maxLength) {
    return str.substring(0, maxLength);
  }
  return str;
}

export async function EmbedAndIndexText(text: string, title: string) {
  console.log("EmbedAndIndexText started");

  const startTime = Date.now();
  console.log(`EmbedAndIndexText started at ${startTime}`);

  const chunkSize = 4000; // adjust this value based on your requirements
  const chunks = [];

  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.substring(i, i + chunkSize));
  }

  const chunkPromises = chunks.map((chunk) => {
    return queue.add(async () => {
      const embeddingStartTime = Date.now();
      const embedding = await model.embedQuery(chunk);
      console.log(chunk);
      return { text: chunk, vector: embedding };
    });
  });

  const embeddedChunks = await Promise.all(chunkPromises);
  const processingChunksTime = Date.now();
  console.log(`Processing chunks took ${processingChunksTime - startTime}ms`);

  const vectors = embeddedChunks
    .filter(
      (chunk): chunk is { text: string; vector: number[] } =>
        chunk !== undefined && chunk !== null,
    )
    .map((chunk) => chunk.vector);

  const avgVector: number[] = vectors
    .reduce((acc, vector) => {
      acc = acc.map((val, i) => val + vector[i]);
      return acc;
    }, new Array(vectors[0].length).fill(0))
    .map((val) => val / vectors.length);

  const calculatingAvgVectorTime = Date.now();
  console.log(
    `Calculating average vector took ${
      calculatingAvgVectorTime - processingChunksTime
    }ms`,
  );

  const doc = {
    id: title,
    metadata: {
      text: safeString(
        embeddedChunks
          .filter(
            (chunk): chunk is { text: string; vector: number[] } =>
              chunk !== undefined && chunk !== null,
          )
          .map((chunk) => chunk.text)
          .join("\n\n"),
      ),
    },
    vector: avgVector,
  };

  const upsertStartTime = Date.now();
  try {
    await index.upsert([doc]);
  } catch (error) {
    console.dir(error);
  }

  console.log(`Upserting document took ${Date.now() - upsertStartTime}ms`);

  const endTime = Date.now();
  console.log(
    `EmbedAndIndexText finished at ${endTime}, took ${endTime - startTime}ms`,
  );

  return {
    text: safeMap(embeddedChunks, (chunk) => chunk.text),
    title,
  };
}
