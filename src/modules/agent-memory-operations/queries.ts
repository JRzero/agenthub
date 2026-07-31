"use client";

import { useQuery } from "@tanstack/react-query";
import { DATA_MODE } from "@/config/capabilities";
import { demoAgentMemoryAnalytics } from "@/fixtures/agent-memory-operations";
import { useAuth } from "@/modules/auth/auth-provider";
import { useWorkspace } from "@/modules/workspace/workspace-provider";
import { getAgentMemoryAnalytics } from "./api";
import {
  shouldRetryMemoryAnalytics,
  toAgentMemoryOperationsModel,
} from "./model";

export const MEMORY_ANALYTICS_REFRESH_POLICY = {
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
} as const;

export function memoryAnalyticsQueryKey(
  agentId: number,
  workspaceCode: string,
  mode = DATA_MODE,
) {
  return ["agent-memory-analytics", agentId, workspaceCode, mode] as const;
}

export function useAgentMemoryAnalytics(agentId: number) {
  const { session } = useAuth();
  const { workspaceCode } = useWorkspace();
  const demo = DATA_MODE === "demo";

  return useQuery({
    queryKey: memoryAnalyticsQueryKey(agentId, workspaceCode),
    queryFn: async () => {
      const data = demo
        ? demoAgentMemoryAnalytics(agentId)
        : await getAgentMemoryAnalytics(
            { apiKey: session?.apiKey || "", workspaceCode },
            agentId,
          );
      return toAgentMemoryOperationsModel(data);
    },
    enabled: agentId > 0 && (demo || Boolean(session?.apiKey)),
    ...MEMORY_ANALYTICS_REFRESH_POLICY,
    retry: shouldRetryMemoryAnalytics,
  });
}
