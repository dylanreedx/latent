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
        <div className="my-12 space-y-2">
          <Button
            variant="outline"
            className="rounded-full text-xs md:px-6 md:text-base"
          >
            Beta
          </Button>
          <Image
            src="/logot.svg"
            width={150}
            height={150}
            alt="Latent Logo"
            className="mx-auto"
          />
        </div>
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
        <h2 className="text-2xl font-semibold">Save time for studying</h2>
        <p className="text-foreground/85">
          Focus on studying, not creating quizzes and flashcards. Let Latent do
          the work for you.
        </p>
      </section>
      <section className="space-y-2 text-center">
        <h3 className="text-2xl font-semibold">You can be more productive</h3>
        <p className="text-foreground/85">
          While creating flashcards and quizzes feel like studying, it&apos;s
          not. Be more productive by studying instead of creating study
          materials.
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
