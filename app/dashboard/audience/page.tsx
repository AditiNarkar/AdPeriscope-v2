import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { painPoints } from "@/lib/mock-data";

export default function AudiencePage() {
  return (
    <DashboardShell title="Pain-Point Explorer" eyebrow="Audience intelligence">
      <div className="grid gap-5 lg:grid-cols-3">
        {painPoints.map((point) => (
          <Card key={point.theme} className="bg-white">
            <p className="text-xs font-black uppercase">{point.source}</p>
            <h2 className="mt-2 text-3xl font-black">{point.theme}</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-brutal border-2 border-ink bg-acid p-3">
                <p className="text-xs font-black uppercase">Frequency</p>
                <p className="text-3xl font-black">{point.frequency}</p>
              </div>
              <div className="rounded-brutal border-2 border-ink bg-hot p-3">
                <p className="text-xs font-black uppercase">Intensity</p>
                <p className="text-3xl font-black">{point.intensity}</p>
              </div>
            </div>
            <p className="mt-4 font-bold italic">&ldquo;{point.quote}&rdquo;</p>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}
