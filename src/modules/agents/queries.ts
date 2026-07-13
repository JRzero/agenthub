"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DATA_MODE } from "@/config/capabilities";
import { DEMO_AGENTS } from "@/fixtures/demo-data";
import { useAuth } from "@/modules/auth/auth-provider";
import { useWorkspace } from "@/modules/workspace/workspace-provider";
import { getAgent, listAgents } from "./api";
import type { Agent } from "./types";

export function useAgents() {
  const { session } = useAuth();
  const { workspaceCode } = useWorkspace();
  const demo = DATA_MODE === "demo";

  return useQuery({
    queryKey: ["agents", workspaceCode, demo],
    queryFn: () =>
      demo
        ? Promise.resolve(DEMO_AGENTS)
        : listAgents(session?.apiKey || "", workspaceCode),
    enabled: Boolean(session?.apiKey),
  });
}

export function useAgent(agentId: number | null) {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const { workspaceCode } = useWorkspace();
  const demo = DATA_MODE === "demo";

  return useQuery({
    queryKey: ["agent", agentId, workspaceCode, demo],
    queryFn: () => {
      if (demo) {
        const cached = queryClient.getQueryData<Agent[]>(["agents", workspaceCode, demo]);
        const agent = cached?.find((item) => item.id === agentId) || DEMO_AGENTS.find((item) => item.id === agentId);
        if (!agent) throw new Error("没有找到这个 Agent Asset");
        return Promise.resolve(agent);
      }
      return getAgent(session?.apiKey || "", agentId || 0, workspaceCode);
    },
    enabled: Boolean(session?.apiKey && agentId),
  });
}

