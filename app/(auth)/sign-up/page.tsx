import Link from "next/link";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { Card } from "@/components/ui/card";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper p-4 text-ink">
      <Card className="w-full max-w-md bg-acid">
        <h1 className="text-4xl font-black">Create your periscope.</h1>
        <p className="mt-2 font-bold text-ink/70">Sign up with OAuth, then launch your first workspace.</p>
        <div className="mt-6">
          <OAuthButtons />
        </div>
        <p className="mt-5 text-sm font-bold">
          Already have an account? <Link className="underline" href="/sign-in">Sign in</Link>
        </p>
      </Card>
    </main>
  );
}
