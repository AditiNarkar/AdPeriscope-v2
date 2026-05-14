import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { continueWithOAuth } from "@/app/(auth)/actions";

export function OAuthButtons() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <form action={continueWithOAuth}>
        <input type="hidden" name="provider" value="google" />
        <Button type="submit" variant="secondary" className="w-full normal-case">
          G Continue with Google
        </Button>
      </form>
      <form action={continueWithOAuth}>
        <input type="hidden" name="provider" value="github" />
        <Button type="submit" variant="secondary" className="w-full normal-case">
          <Github className="size-5" /> GitHub
        </Button>
      </form>
    </div>
  );
}
