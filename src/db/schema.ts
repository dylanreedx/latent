import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const quizzes = sqliteTable("quizzes", {
  id: integer("id").primaryKey(),
  topic: text("topic").notNull(),
  questions: text("questions").notNull(),

  orginalQuizId: integer("orginal_quiz_id"),

  timeline: text("timeline"),

  context: text("context"),

  userId: text("user_id").notNull(),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

/* attemps for entire quizzes. */
export const quizAttempts = sqliteTable("quiz_attempts", {
  id: integer("id").primaryKey(),
  quizId: integer("quiz_id")
    .notNull()
    .references(() => quizzes.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull(),

  // the user score and the max score can calculate the grade
  score: integer("score"),
  maxScore: integer("max_score"),
  grade: text("grade"), // e.g., "80%" or "8/10"
  report: text("report"),

  startedAt: text("started_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  finishedAt: text("finished_at"),
});

/* attemps per question */
export const quizAttemptQuestions = sqliteTable("quiz_attempt_questions", {
  id: integer("id").primaryKey(),
  quizAttemptId: integer("quiz_attempt_id")
    .notNull()
    .references(() => quizAttempts.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  userAnswer: text("user_answer"),
  correctAnswer: text("correct_answer"),
  isCorrect: integer("is_correct"),
});

export const quizShares = sqliteTable("quiz_shares", {
  id: integer("id").primaryKey(),
  quizId: integer("quiz_id")
    .notNull()
    .references(() => quizzes.id, { onDelete: "cascade" }),
  shareToken: text("share_token").notNull(), // unique, random token for sharing
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const pdfData = sqliteTable("pdf_data", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  text: text("text").notNull(),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const payment = sqliteTable("payment", {
  id: integer("id").primaryKey(),
  userId: text("user_id").notNull(),
  email: text("email"),
  type: text("type").notNull(),
  amount: integer("amount").notNull(),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const youtubeVideo = sqliteTable("youtube_video", {
  id: integer("id").primaryKey(),
  userId: text("user_id").notNull(),
  videoId: text("video_id").notNull(),
  title: text("title").notNull(),
  transcript: text("transcript").notNull(),
  summarizedTranscript: text("summarized_transcript"),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const userNotes = sqliteTable("notes", {
  id: integer("id").primaryKey(),
  userId: text("user_id").notNull(),
  text: text("text").notNull(),
  quizId: integer("quiz_id"),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export type InsertPost = typeof quizzes.$inferInsert;
export type SelectPost = typeof quizzes.$inferSelect;
