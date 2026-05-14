import { Card } from "@/components/ui/card";

const events = [
  "SEO Agent clustered 186 keywords into 12 intent groups",
  "Audience Agent ranked 3 new pain-point themes",
  "Competitor Agent detected a viral comparison post",
  "Content Agent scheduled next week's creator calendar"
];

export function ActivityTimeline() {
  return (
    <Card>
      <h2 className="text-xl font-black">Activity Timeline</h2>
      <ol className="mt-4 space-y-3">
        {events.map((event, index) => (
          <li key={event} className="flex gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-hot text-sm font-black">
              {index + 1}
            </span>
            <p className="font-semibold">{event}</p>
          </li>
        ))}
      </ol>
    </Card>
  );
}
