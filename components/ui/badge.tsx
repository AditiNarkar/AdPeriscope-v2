import { cn } from "@/lib/utils";

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex rounded-full border-2 border-ink bg-bolt px-3 py-1 text-xs font-black uppercase", className)}>
      {children}
    </span>
  );
}
