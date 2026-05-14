import Link from "next/link";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { Card } from "@/components/ui/card";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper p-4 text-ink">
      <Card className="w-full max-w-md bg-bolt">
        <h1 className="text-4xl font-black">Welcome back.</h1>
        <p className="mt-2 font-bold text-ink/70">Sign in with OAuth to launch your workspace.</p>
        <div className="mt-6">
          <OAuthButtons />
        </div>
        <p className="mt-5 text-sm font-bold">
          New here? <Link className="underline" href="/sign-up">Create an account</Link>
        </p>
      </Card>
    </main>
  );
}
