import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { db } from "@/db/db";
import { useQuizStore } from "@/state/store";
import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Page() {
  const { userId } = auth();
  if (!userId) {
    return <SignIn />;
  }
  const quizes = await db.query.quizes.findMany({
    where: (model, { eq }) => eq(model.userId, userId),
  });
  console.log(quizes);
  return (
    <>
      <h1>Study</h1>

      <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {quizes.map((quiz) => (
          <Link href={`/study/${quiz.topic}`} key={quiz.id}>
            <Card className="h-full w-full">
              <CardHeader>
                <CardTitle>{quiz.topic}</CardTitle>
                <CardDescription>Studied 12 times</CardDescription>
              </CardHeader>
              <CardContent>
                <p>4 days left</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </ul>
    </>
  );
}
