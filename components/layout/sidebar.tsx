"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  CalendarDays,
  Compass,
  Eye,
  FileText,
  FolderKanban,
  Gauge,
  Search,
  Settings,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";

const nav = [
  { href: "/workspaces", label: "Workspaces", icon: FolderKanban },
  { href: "/dashboard", label: "Command", icon: Gauge },
  { href: "/dashboard/competitors", label: "Competitors", icon: Eye },
  { href: "/dashboard/seo", label: "SEO", icon: Search },
  { href: "/dashboard/audience", label: "Audience", icon: Compass },
  { href: "/dashboard/personas", label: "Personas", icon: Users },
  { href: "/dashboard/planner", label: "Planner", icon: CalendarDays },
  { href: "/dashboard/assistant", label: "Assistant", icon: Bot },
  { href: "/dashboard/settings", label: "Settings", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();
  const workspace = useAppStore((state) => state.workspace);

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r-4 border-ink bg-paper p-4 lg:block">
      <Link href="/" className="flex items-center gap-3 rounded-brutal border-4 border-ink bg-hot p-3 shadow-brutal-sm">
        <FileText className="size-8" />
        <div>
          <p className="text-xl font-black">AdPeriscope</p>
          <p className="text-xs font-black uppercase">AI growth OS</p>
        </div>
      </Link>
      <div className="mt-5 rounded-brutal border-4 border-ink bg-white p-3">
        <p className="text-xs font-black uppercase text-ink/60">Workspace</p>
        <p className="text-lg font-black">{workspace}</p>
      </div>
      <nav className="mt-5 space-y-2">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-brutal border-4 border-ink px-3 py-2 font-black transition hover:-translate-y-0.5 hover:bg-acid hover:shadow-brutal-sm",
                active ? "bg-acid shadow-brutal-sm" : "bg-white"
              )}
            >
              <Icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
