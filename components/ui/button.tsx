import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "hot" | "ghost";
};

export function Button({ className, asChild, variant = "primary", ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-brutal border-4 border-ink px-5 py-2 text-sm font-black uppercase tracking-normal shadow-brutal-sm transition hover:-translate-y-0.5 hover:shadow-brutal focus:outline-none focus:ring-4 focus:ring-bolt disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-acid text-ink",
        variant === "secondary" && "bg-white text-ink",
        variant === "hot" && "bg-hot text-ink",
        variant === "ghost" && "bg-transparent shadow-none hover:bg-white",
        className
      )}
      {...props}
    />
  );
}
