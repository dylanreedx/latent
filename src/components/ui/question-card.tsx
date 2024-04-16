import { Button } from "./button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card";
import QuestionOptions from "./question-options";

export default function QuestionCard(question: {
  question: string;
  options: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{question.question}</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <QuestionOptions options={question.options} />
      </CardContent>
      <CardFooter>
        <Button>Next</Button>
      </CardFooter>
    </Card>
  );
}
