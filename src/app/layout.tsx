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
            <nav className="flex justify-end gap-4 p-4">
              <SignedIn>
                <Link href="/">
                  <Button variant="ghost">Home</Button>
                </Link>
                <Link href="/study">
                  <Button variant="ghost">Study</Button>
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
            </nav>

            <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-12">
              {children}
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
