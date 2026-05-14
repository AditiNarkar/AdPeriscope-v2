"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/sidebar";

export function DashboardShell({ children, title, eyebrow }: { children: React.ReactNode; title: string; eyebrow: string }) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="flex">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b-4 border-ink bg-paper/95 p-4 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase">{eyebrow}</p>
                <h1 className="text-3xl font-black md:text-5xl">{title}</h1>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" aria-label="Mobile menu" className="lg:hidden">
                  <Menu className="size-5" />
                </Button>
                <Button>Export PDF</Button>
              </div>
            </div>
          </header>
          <div className="p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
