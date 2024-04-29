import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const quizes = sqliteTable("quizes", {
  id: integer("id").primaryKey(),
  topic: text("topic").notNull(),
  questions: text("questions").notNull(),
  userId: text("user_id").notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type InsertPost = typeof quizes.$inferInsert;
export type SelectPost = typeof quizes.$inferSelect;
