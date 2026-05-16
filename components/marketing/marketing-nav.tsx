import Link from "next/link";
import { Telescope } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MarketingNav({ signedIn = false }: { signedIn?: boolean }) {
  return (
    <header className="border-b-4 border-ink bg-paper px-4 py-3">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-black">
          <Telescope className="size-7" />
          AdPeriscope
        </Link>
        <div className="hidden items-center gap-4 font-black md:flex">
          <Link href="/pricing">Pricing</Link>
          {signedIn ? (
            <>
              <Link href="/workspaces">Workspaces</Link>
              <Link href="/dashboard">Dashboard</Link>
            </>
          ) : (
            <Link href="/sign-in">Sign in</Link>
          )}
        </div>
        <Button asChild>
          <Link href={signedIn ? "/workspaces" : "/sign-in"}>
            {signedIn ? "Launch workspace" : "Get started"}
          </Link>
        </Button>
      </nav>
    </header>
  );
}
