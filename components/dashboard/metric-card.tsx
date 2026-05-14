import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MetricCard({ label, value, change, tone }: { label: string; value: string; change: string; tone: string }) {
  return (
    <Card className={cn("p-4", tone)}>
      <p className="text-xs font-black uppercase">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <strong className="text-4xl font-black">{value}</strong>
        <span className="rounded-full border-2 border-ink bg-white px-2 py-1 text-xs font-black">{change}</span>
      </div>
    </Card>
  );
}
