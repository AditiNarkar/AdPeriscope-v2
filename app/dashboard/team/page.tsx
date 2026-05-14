import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const members = ["Avery - Owner", "Sam - SEO", "Mina - Content", "Jordan - Analyst"];

export default function TeamPage() {
  return (
    <DashboardShell title="Team Collaboration" eyebrow="Workspaces and roles">
      <Card className="bg-bolt">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-black">Launch Lab team</h2>
          <Button>Invite teammate</Button>
        </div>
      </Card>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {members.map((member) => (
          <Card key={member} className="bg-white">
            <p className="text-xl font-black">{member}</p>
            <p className="mt-2 font-bold text-ink/70">Can view reports, comment on strategy cards, and assign agent runs.</p>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}
