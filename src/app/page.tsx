import { SuggestionsList } from "@/components/suggestion-scroll-list";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { suggestions } from "@/utils/exam-suggestions";
import { SignUpButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="mx-auto text-center">
        <Image
          src="/logot.svg"
          width={150}
          height={150}
          alt="Latent Logo"
          className="mx-auto my-12"
        />
        <h1 className="mx-auto max-w-lg text-4xl font-semibold">
          Get the grades you need easier with science and AI.
        </h1>
        <p className="text-lg text-foreground/85">
          Upload your lecture slides and study AI-powered quiz and flashcards.
        </p>
        <div className="mt-6">
          <SignUpButton afterSignInUrl="/study" afterSignUpUrl="/study">
            <button className="cursor-pointer rounded-lg bg-foreground px-12 py-4 font-semibold text-background">
              Start Studying
            </button>
          </SignUpButton>
        </div>
      </section>
      <SuggestionsList />
      <section className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold">
          AI-powered assessments custom from your lectures
        </h2>
        <p className="text-foreground/85">
          We use AI to generate quizzes and flashcards from your lecture slides.
          We also generate keywords for your exam to help you study better.
        </p>
      </section>
      <section className="space-y-2 text-center">
        <h3 className="text-2xl font-semibold">How it works</h3>
        <p className="text-foreground/85">
          Upload your lecture slides, and we will generate quizzes and
          flashcards for you to study.
        </p>
      </section>
      <section>
        <Card>
          <CardHeader>
            <CardDescription>Monthly subscription to Latent</CardDescription>
            <CardTitle className="text-3xl">$8.99</CardTitle>
            <CardDescription>
              Study using AI by generating quizzes and flashcards from your
              lecture slides.
            </CardDescription>
          </CardHeader>

          <CardFooter>
            <Link
              href="https://buy.stripe.com/dR6eVDcu85KT0Mw9AA"
              className="w-full"
            >
              <Button className="w-full">Start Studying</Button>
            </Link>
          </CardFooter>
        </Card>
      </section>
    </>
  );
}
