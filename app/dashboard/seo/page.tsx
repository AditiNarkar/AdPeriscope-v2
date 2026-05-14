import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";

const groups = [
  ["Commercial", "ai marketing automation", "competitor analysis software", "content calendar generator"],
  ["Informational", "how to find audience pain points", "reddit keyword research", "seo content gap examples"],
  ["Long-tail", "best ai tool for startup content strategy", "youtube comment mining for product ideas"]
];

export default function SeoPage() {
  return (
    <DashboardShell title="SEO Insights" eyebrow="Keyword intelligence">
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="bg-hot">
          <p className="text-sm font-black uppercase">SEO Score</p>
          <h2 className="mt-3 text-7xl font-black">82</h2>
          <p className="mt-3 font-bold">Recommended: publish two BOFU comparison pages and refresh stale intent clusters.</p>
        </Card>
        <Card>
          <h2 className="text-2xl font-black">Search intent clusters</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {groups.map(([intent, ...keywords]) => (
              <div key={intent} className="rounded-brutal border-2 border-ink bg-paper p-3">
                <h3 className="font-black">{intent}</h3>
                <ul className="mt-2 space-y-2 text-sm font-bold">
                  {keywords.map((keyword) => <li key={keyword}>{keyword}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
