"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/use-app-store";

export default function SettingsPage() {
  const { workspace, setWorkspace } = useAppStore();

  return (
    <DashboardShell title="Settings" eyebrow="Account controls">
      <Card className="max-w-2xl bg-white">
        <h2 className="text-2xl font-black">Workspace</h2>
        <Input className="mt-4" value={workspace} onChange={(event) => setWorkspace(event.target.value)} />
        <Button className="mt-4">Save settings</Button>
      </Card>
    </DashboardShell>
  );
}
