import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";

export default function PersonasPage() {
  return (
    <DashboardShell title="Brand Persona Generator" eyebrow="Positioning lab">
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="bg-acid">
          <h2 className="text-2xl font-black">Generate archetypes</h2>
          <Textarea className="mt-4" placeholder="Describe your offer, audience, price point, and tone." />
          <Button className="mt-4">Generate personas</Button>
        </Card>
        <Card>
          <h2 className="text-2xl font-black">Generated persona</h2>
          <div className="mt-4 rounded-brutal border-2 border-ink bg-bolt p-4">
            <h3 className="text-3xl font-black">Scrappy Growth Lead</h3>
            <p className="mt-2 font-bold">Wants strategy-grade marketing without hiring a full agency. Values speed, clarity, and proof.</p>
            <p className="mt-3 font-black">Voice: direct, practical, slightly provocative.</p>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
