import { apiRequest, getApiBaseUrl } from "@/shared/api/http-client";
import type { Agent } from "./types";

export async function listAgents(apiKey: string, workspaceCode: string): Promise<Agent[]> {
  const result = await apiRequest<{ agents: Agent[] }>("/agents", { apiKey, workspaceCode });
  return result.agents || [];
}

export function getAgent(apiKey: string, agentId: number, workspaceCode?: string): Promise<Agent> {
  return apiRequest<Agent>(`/agents/${agentId}`, { apiKey, workspaceCode });
}

export function deleteAgent(apiKey: string, agentId: number): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/agents/${agentId}`, { method: "DELETE", apiKey });
}

export function transferAgent(apiKey: string, agentId: number, workspaceId: number): Promise<Agent> {
  return apiRequest<Agent>(`/agents/${agentId}`, { method: "PUT", apiKey, body: JSON.stringify({ workspace_id: workspaceId }) });
}

export function getAgentAvatarUrl(agent: Agent): string | null {
  const avatar = agent.config?.metadata?.avatar;
  if (!avatar) return null;
  if (avatar.startsWith("data:")) return avatar;
  const bust = agent.updated_at ? new Date(agent.updated_at).getTime() : Math.floor(Date.now() / 1000);
  return `${getApiBaseUrl()}/api/v1/avatars/${encodeURIComponent(avatar)}?t=${bust}`;
}
