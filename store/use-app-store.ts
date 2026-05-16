"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type WorkspaceItem = {
  id: string;
  name: string;
  prompt: string;
  createdAt: string;
};

type WorkerRun = {
  id?: string;
  agent: "seo" | "competitor" | "audience" | "persona";
  status: "queued" | "running" | "completed" | "failed";
  output?: string;
  updatedAt: string;
};

type AppState = {
  workspace: string;
  activeWorkspaceId: string;
  workspaces: WorkspaceItem[];
  workerRuns: Record<string, WorkerRun[]>;
  setWorkspace: (workspace: string, workspaceId?: string) => void;
  setWorkspaces: (workspaces: WorkspaceItem[]) => void;
  addWorkspace: (workspace: WorkspaceItem) => void;
  updateWorkspace: (workspaceId: string, patch: Partial<WorkspaceItem>) => void;
  removeWorkspace: (workspaceId: string) => void;
  setWorkerRuns: (workspaceId: string, runs: WorkerRun[]) => void;
  updateWorkerRun: (workspaceId: string, run: WorkerRun) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      workspace: "",
      activeWorkspaceId: "",
      workspaces: [],
      workerRuns: {},
      setWorkspace: (workspace, workspaceId) => set({ workspace, activeWorkspaceId: workspaceId ?? "" }),
      setWorkspaces: (workspaces) =>
        set((state) => ({
          workspaces,
          workspace: state.workspace || workspaces[0]?.name || "",
          activeWorkspaceId: state.activeWorkspaceId || workspaces[0]?.id || ""
        })),
      addWorkspace: (workspace) =>
        set((state) => ({
          workspaces: [
            workspace,
            ...state.workspaces.filter((item) => item.id !== workspace.id)
          ],
          workspace: workspace.name,
          activeWorkspaceId: workspace.id
        })),
      updateWorkspace: (workspaceId, patch) =>
        set((state) => ({
          workspaces: state.workspaces.map((item) =>
            item.id === workspaceId ? { ...item, ...patch } : item
          ),
          workspace:
            state.activeWorkspaceId === workspaceId && patch.name
              ? patch.name
              : state.workspace
        })),
      removeWorkspace: (workspaceId) =>
        set((state) => {
          const remaining = state.workspaces.filter((item) => item.id !== workspaceId);
          const nextActive = state.activeWorkspaceId === workspaceId ? remaining[0] : undefined;
          const { [workspaceId]: _removedRuns, ...workerRuns } = state.workerRuns;

          return {
            workspaces: remaining,
            workerRuns,
            workspace: nextActive ? nextActive.name : state.activeWorkspaceId === workspaceId ? "" : state.workspace,
            activeWorkspaceId: nextActive ? nextActive.id : state.activeWorkspaceId === workspaceId ? "" : state.activeWorkspaceId
          };
        }),
      setWorkerRuns: (workspaceId, runs) =>
        set((state) => ({
          workerRuns: { ...state.workerRuns, [workspaceId]: runs }
        })),
      updateWorkerRun: (workspaceId, run) =>
        set((state) => {
          const current = state.workerRuns[workspaceId] ?? [];
          return {
            workerRuns: {
              ...state.workerRuns,
              [workspaceId]: [
                run,
                ...current.filter((item) => item.agent !== run.agent)
              ]
            }
          };
        })
    }),
    {
      name: "adperiscope-user-workspaces",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
