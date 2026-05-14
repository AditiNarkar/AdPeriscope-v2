import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { insights } from "@/lib/mock-data";

export function AiSuggestionsPanel() {
  return (
    <Card className="bg-acid">
      <div className="flex items-center gap-2">
        <Sparkles className="size-5" />
        <h2 className="text-xl font-black">AI Suggestions</h2>
      </div>
      <div className="mt-4 space-y-3">
        {insights.map((insight) => (
          <article key={insight.title} className="rounded-brutal border-2 border-ink bg-white p-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-black">{insight.title}</h3>
              <span className="text-xs font-black uppercase">{insight.metric}</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-ink/75">{insight.summary}</p>
          </article>
        ))}
      </div>
    </Card>
  );
}
