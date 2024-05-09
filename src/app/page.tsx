import { SuggestionsList } from "@/components/suggestion-scroll-list";
import { suggestions } from "@/utils/exam-suggestions";
import { SignUpButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <>
      <section className="mx-auto text-center">
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
    </>
  );
}
