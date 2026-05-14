import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-brutal border-4 border-ink bg-bone", className)} />;
}
