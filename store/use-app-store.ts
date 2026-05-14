"use client";

import { create } from "zustand";

type AppState = {
  workspace: string;
  darkMode: boolean;
  setWorkspace: (workspace: string) => void;
  toggleDarkMode: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  workspace: "Launch Lab",
  darkMode: false,
  setWorkspace: (workspace) => set({ workspace }),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode }))
}));
