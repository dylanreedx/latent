import { RefreshCache } from "@/components/refresh-cache";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { db } from "@/db/db";
import { quizzes } from "@/db/schema";
import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { TrashIcon } from "@radix-ui/react-icons";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function Page() {
  const { userId } = auth();
  if (!userId) {
    return <SignIn />;
  }
  const quizs = await db.query.quizzes.findMany({
    where: (model, { eq }) => eq(model.userId, userId),
  });

  const deleteQuiz = async (formData: FormData) => {
    "use server";

    const id = Number(formData.get("id"));

    await db.delete(quizzes).where(eq(quizzes.id, id));
  };

  const checkIfQuizzesChanged = async () => {
    "use server";
    const newQuizs = await db.query.quizzes.findMany({
      where: (model, { eq }) => eq(model.userId, userId),
    });

    const didChange = newQuizs.length !== quizs.length;
    console.log("didChange", didChange);

    if (didChange) {
      revalidatePath("/study/quizzes");
    }
  };

  return (
    <>
      <h1>Study</h1>

      <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {quizs.map((quiz) => (
          <Card className="h-full w-full overflow-hidden" key={quiz.id}>
            <Link href={`/study/${quiz.topic}`}>
              <CardHeader className="mb-4 flex flex-row items-center justify-between rounded-b-2xl duration-200 hover:bg-muted-foreground/15">
                <div>
                  <CardTitle>{quiz.topic}</CardTitle>
                  <CardDescription>Studied 12 times</CardDescription>
                </div>
              </CardHeader>
            </Link>
            <CardContent>
              <p>4 days left</p>
            </CardContent>
            <CardFooter>
              <RefreshCache check={checkIfQuizzesChanged} />
              <form action={deleteQuiz} className="z-50 w-full">
                <input type="hidden" name="id" value={quiz.id} />
                <Button
                  variant="secondary"
                  type="submit"
                  className="w-full items-center justify-center gap-2"
                >
                  Delete <TrashIcon />
                </Button>
              </form>
            </CardFooter>
          </Card>
        ))}
      </ul>
    </>
  );
}
