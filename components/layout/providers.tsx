"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/use-app-store";

export function Providers({ children }: { children: React.ReactNode }) {
  const darkMode = useAppStore((state) => state.darkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return <>{children}</>;
}
