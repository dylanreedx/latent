import { OpenAIEmbeddings } from "@langchain/openai";
import { Index } from "@upstash/vector";
import pQueue from "p-queue";
import { Token, SentenceTokenizer } from "natural";
import { db } from "@/db/db";
import { userNotes } from "@/db/schema";
import { TranscriptResponse } from "youtube-transcript";
import OpenAI from "openai";
import { randomUUID } from "crypto";

const index = new Index({
  url: process.env.UPSTASH_URL,
  token: process.env.UPSTASH_INDEX_TOKEN,
});

const model = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_TOKEN,
  model: "text-embedding-3-small",
  dimensions: 1536,
});

const oai = new OpenAI({
  apiKey: process.env.OPENAI_API_TOKEN,
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

export async function EmbedAndIndexNotes(notes: string, userId: string) {
  console.log("EmbedAndIndexTranscript started");
  const startTime = Date.now();

  // 1. Chunking (using EmbedAndIndexText technique)
  const chunkSize = 4000; // adjust this value based on your requirements
  const chunks = [];

  for (let i = 0; i < notes.length; i += chunkSize) {
    chunks.push(notes.substring(i, i + chunkSize));
  }

  // 2. Embedding
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

  // 3. Indexing in Upstash
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
    id: randomUUID(),
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

  // 4. Insert into SQLite using Drizzle
  const notesForDB = embeddedChunks
    //@ts-ignore
    .map((chunk) => chunk.text)
    .join("\n\n");

  await db.insert(userNotes).values({
    text: notesForDB,
    userId,
  });

  const endTime = Date.now();
  console.log(
    `EmbedAndIndexTranscript finished at ${endTime}, took ${endTime - startTime}ms`,
  );

  return {
    notes: safeMap(embeddedChunks, (chunk) => chunk.text),
  };
}
