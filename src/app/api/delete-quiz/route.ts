import { db } from "@/db/db";
import { quizzes } from "@/db/schema";
import { eq } from "drizzle-orm";
export async function DELETE(request: Request) {
  const { id } = await request.json();

  await db.delete(quizzes).where(eq(quizzes.id, id));

  return new Response("Deleted");
}
