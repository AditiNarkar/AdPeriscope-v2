import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn("w-full rounded-brutal border-4 border-ink bg-white px-4 py-3 font-bold shadow-brutal-sm outline-none focus:ring-4 focus:ring-bolt", className)}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn("min-h-28 w-full rounded-brutal border-4 border-ink bg-white px-4 py-3 font-bold shadow-brutal-sm outline-none focus:ring-4 focus:ring-bolt", className)}
      {...props}
    />
  );
}
