"use server";

import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";
import { log } from "@/lib/logger";

type OAuthProvider = "google" | "github";

function isOAuthProvider(value: FormDataEntryValue | null): value is OAuthProvider {
  return value === "google" || value === "github";
}

function providerIsConfigured(provider: OAuthProvider) {
  if (provider === "google") {
    return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  }

  return Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);
}

export async function continueWithOAuth(formData: FormData) {
  const provider = formData.get("provider");
  const redirectTo = "/onboarding";

  if (!isOAuthProvider(provider)) {
    redirect("/sign-in?error=invalid-provider");
  }

  if (!providerIsConfigured(provider)) {
    log("warn", "OAuth provider credentials missing; cannot start OAuth flow", {
      provider
    });
    redirect(`/sign-in?error=${provider}-not-configured`);
  }

  log("info", "Starting OAuth sign-in/signup flow", {
    provider,
    redirectTo
  });

  await signIn(provider, { redirectTo });
}
