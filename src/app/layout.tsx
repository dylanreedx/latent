import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/ui/theme-mode-toggle";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { fileRouter } from "./api/uploadthing/core";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Latent | Study with AI and science",
  description:
    "Test ur knowledge with science-based protocols to help recall and maintain information for ur upcoming exam.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <link rel="icon" href="/favicon.svg" sizes="any" />
        <NextSSRPlugin routerConfig={extractRouterConfig(fileRouter)} />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable,
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <nav className="flex items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-2">
                <Link href="/">
                  <Image
                    src="/logot.svg"
                    width={100}
                    height={100}
                    alt="Latent Logo"
                  />{" "}
                </Link>
                <Button
                  variant="outline"
                  className="rounded-full text-xs md:px-6"
                >
                  Beta
                </Button>
              </div>
              <div className="flex gap-2">
                <SignedIn>
                  <Link href="/study">
                    <Button variant="ghost" className="text-xs md:text-base">
                      Study
                    </Button>
                  </Link>
                  <Link href="/study/quizzes">
                    <Button variant="ghost" className="text-xs md:text-base">
                      Quizzes
                    </Button>
                  </Link>
                </SignedIn>

                <ModeToggle />

                <SignedOut>
                  <SignInButton
                    mode="modal"
                    afterSignInUrl="/study"
                    afterSignUpUrl="/study"
                  />
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </nav>

            <main className="mx-auto flex min-h-screen flex-col gap-12 px-6 md:max-w-xl">
              {children}
            </main>

            <footer className="mt-8 bg-foreground text-background">
              <div className="flex justify-center gap-4 p-4">
                <Link href="#">
                  <Button variant="ghost" className="text-xs md:text-base">
                    Terms
                  </Button>
                </Link>
                <Link href="#">
                  <Button variant="ghost" className="text-xs md:text-base">
                    Privacy
                  </Button>
                </Link>
                <Link href="#">
                  <Button variant="ghost" className="text-xs md:text-base">
                    Contact
                  </Button>
                </Link>
              </div>
              <div className="flex justify-center gap-4 p-4">
                <p className="text-xs md:text-base">
                  built by{" "}
                  <span className="underline">
                    <Link href="https://x.com/dylanreedx" target="_blank">
                      dylan
                    </Link>
                  </span>
                </p>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
