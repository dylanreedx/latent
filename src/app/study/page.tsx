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

      <ul>
        {quizes.map((quiz) => (
          <Link href={`/study/${quiz.topic}`} key={quiz.id}>
            <Card className="w-fit">
              <CardHeader>
                <CardTitle>{quiz.topic}</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </ul>
    </>
  );
}
