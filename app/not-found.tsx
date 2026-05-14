import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper p-6 text-ink">
      <section className="max-w-xl rounded-brutal border-4 border-ink bg-white p-8 shadow-brutal">
        <p className="text-sm font-black uppercase">404</p>
        <h1 className="mt-2 text-4xl font-black">Signal lost.</h1>
        <p className="mt-3 text-lg font-semibold">
          This insight route is not on the map yet.
        </p>
        <Button asChild className="mt-6">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </section>
    </main>
  );
}
