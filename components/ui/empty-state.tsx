import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: string;
}) {
  return (
    <div className="rounded-brutal border-4 border-dashed border-ink bg-white p-8 text-center">
      <Search className="mx-auto size-10" aria-hidden />
      <h3 className="mt-3 text-xl font-black">{title}</h3>
      <p className="mx-auto mt-2 max-w-md font-semibold text-ink/70">{description}</p>
      {action ? <Button className="mt-5">{action}</Button> : null}
    </div>
  );
}
