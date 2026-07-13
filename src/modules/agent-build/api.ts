import { apiRequest } from "@/shared/api/http-client";
import type { Agent } from "@/modules/agents/types";
import type { AgentBuildUpdateInput } from "./types";

export function updateAgentBuild(
  apiKey: string,
  agentId: number,
  workspaceCode: string,
  input: AgentBuildUpdateInput,
): Promise<Agent> {
  return apiRequest<Agent>(`/agents/${agentId}`, {
    method: "PUT",
    apiKey,
    workspaceCode,
    body: JSON.stringify(input),
  });
}

export interface KnowledgeBaseOption {
  id: number;
  name: string;
  description?: string;
}

export function listKnowledgeBaseOptions(
  apiKey: string,
  workspaceCode: string,
): Promise<KnowledgeBaseOption[]> {
  return apiRequest<KnowledgeBaseOption[]>("/knowledge-bases", {
    apiKey,
    workspaceCode,
  });
}
