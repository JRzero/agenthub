import { apiRequest } from "@/shared/api/http-client";
import type { AgentMemoryAnalytics } from "./types";

export interface MemoryAnalyticsAuth {
  apiKey: string;
  workspaceCode: string;
}

export function getAgentMemoryAnalytics(
  auth: MemoryAnalyticsAuth,
  agentId: number,
): Promise<AgentMemoryAnalytics> {
  return apiRequest<AgentMemoryAnalytics>(
    `/agents/${agentId}/memory-analytics`,
    auth,
  );
}
