import { SuggestionsList } from "@/components/suggestion-scroll-list";
import { suggestions } from "@/utils/exam-suggestions";
import { SignUpButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <>
      <section className="mx-auto text-center">
        <h1 className="mx-auto max-w-lg text-4xl font-semibold">
          Get your grades easier with science and AI.
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
    </>
  );
}
