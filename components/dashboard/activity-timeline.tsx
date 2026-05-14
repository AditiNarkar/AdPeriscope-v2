import { Card } from "@/components/ui/card";

export function ActivityTimeline({ items = [] }: { items?: string[] }) {
  return (
    <Card>
      <h2 className="text-xl font-black">Activity Timeline</h2>
      <ol className="mt-4 space-y-3">
        {items.length ? items.map((event, index) => (
          <li key={event} className="flex gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-hot text-sm font-black">
              {index + 1}
            </span>
            <p className="font-semibold">{event}</p>
          </li>
        )) : (
          <li className="rounded-brutal border-2 border-ink bg-white p-3 font-bold">
            No activity yet.
          </li>
        )}
      </ol>
    </Card>
  );
}
