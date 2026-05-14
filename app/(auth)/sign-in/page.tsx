import Link from "next/link";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper p-4 text-ink">
      <Card className="w-full max-w-md bg-bolt">
        <h1 className="text-4xl font-black">Welcome back.</h1>
        <p className="mt-2 font-bold text-ink/70">Sign in to keep your agents scanning.</p>
        <div className="mt-6 space-y-3">
          <Input type="email" placeholder="you@company.com" aria-label="Email" />
          <Button className="w-full">Send magic link</Button>
          <Button variant="secondary" className="w-full">
            <Github className="size-5" /> Continue with OAuth
          </Button>
        </div>
        <p className="mt-5 text-sm font-bold">
          New here? <Link className="underline" href="/sign-up">Create an account</Link>
        </p>
      </Card>
    </main>
  );
}
