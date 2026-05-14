import { cn } from "@/lib/utils";

export function Card({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("rounded-brutal border-4 border-ink bg-white p-5 shadow-brutal", className)}>
      {children}
    </section>
  );
}
