"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DEMO_WORKSPACES } from "@/fixtures/demo-data";
import { useAuth } from "@/modules/auth/auth-provider";
import { listWorkspaces, switchActiveWorkspace } from "./api";
import type { Workspace } from "./types";

export const WORKSPACE_STORAGE_KEY = "linkyun_current_workspace_code";

interface WorkspaceContextValue {
  workspaces: Workspace[];
  workspaceCode: string;
  workspaceName: string;
  loading: boolean;
  switching: boolean;
  workspaceError: string;
  setWorkspaceCode: (code: string) => void;
  clearWorkspaceError: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { session, demo } = useAuth();
  const queryClient = useQueryClient();
  const [workspaceCode, setWorkspaceCodeState] = useState("default");
  const [storageReady, setStorageReady] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [workspaceError, setWorkspaceError] = useState("");

  useEffect(() => {
    if (demo) {
      setWorkspaceCodeState(DEMO_WORKSPACES[0].code);
      setStorageReady(true);
      return;
    }
    const stored = window.localStorage.getItem(WORKSPACE_STORAGE_KEY);
    if (stored) setWorkspaceCodeState(stored);
    setStorageReady(true);
  }, [demo]);

  const query = useQuery({
    queryKey: ["workspaces", session?.apiKey, demo],
    queryFn: () => demo ? Promise.resolve(DEMO_WORKSPACES) : listWorkspaces(session?.apiKey || ""),
    enabled: Boolean(session?.apiKey),
  });

  useEffect(() => {
    if (!query.data?.length) return;
    const exists = query.data.some((workspace) => workspace.code === workspaceCode);
    if (!exists) setWorkspaceCodeState(query.data[0].code);
  }, [query.data, workspaceCode]);

  const setWorkspaceCode = useCallback((code: string) => {
    if (!code || code === workspaceCode || switching) return;
    const previous = workspaceCode;
    setWorkspaceCodeState(code);
    setWorkspaceError("");
    const apply = async () => {
      setSwitching(true);
      try {
        if (!demo) await switchActiveWorkspace(session?.apiKey || "", code);
        if (!demo) window.localStorage.setItem(WORKSPACE_STORAGE_KEY, code);
        await queryClient.invalidateQueries({ queryKey: ["agents"] });
      } catch (error) {
        setWorkspaceCodeState(previous);
        setWorkspaceError(error instanceof Error ? error.message : "切换工作空间失败");
      } finally {
        setSwitching(false);
      }
    };
    void apply();
  }, [demo, queryClient, session?.apiKey, switching, workspaceCode]);

  const workspaces = useMemo(() => query.data || [], [query.data]);
  const selected = workspaces.find((workspace) => workspace.code === workspaceCode);
  const value = useMemo(() => ({
    workspaces,
    workspaceCode,
    workspaceName: selected?.name || "当前工作空间",
    loading: !storageReady || query.isLoading,
    switching,
    workspaceError,
    setWorkspaceCode,
    clearWorkspaceError: () => setWorkspaceError(""),
  }), [query.isLoading, selected?.name, setWorkspaceCode, storageReady, switching, workspaceCode, workspaceError, workspaces]);

  return (
    <WorkspaceContext.Provider value={value}>
      {storageReady ? children : null}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error("useWorkspace must be used inside WorkspaceProvider");
  return context;
}
