import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper p-4 text-ink">
      <Card className="w-full max-w-md bg-acid">
        <h1 className="text-4xl font-black">Create your periscope.</h1>
        <p className="mt-2 font-bold text-ink/70">Set up a workspace and invite your team later.</p>
        <div className="mt-6 space-y-3">
          <Input placeholder="Workspace name" aria-label="Workspace name" />
          <Input type="email" placeholder="you@company.com" aria-label="Email" />
          <Button asChild className="w-full">
            <Link href="/onboarding">Create account</Link>
          </Button>
        </div>
      </Card>
    </main>
  );
}
