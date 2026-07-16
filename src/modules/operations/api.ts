import type { Agent } from "@/modules/agents/types";
import { ApiError, apiRequest } from "@/shared/api/http-client";
import type { SessionMessage, SharedSessionInfo, SharedSessionRow, SharedUser, UserAgentPrompt } from "./types";

function normalizeAgent(agent: Agent): SharedSessionRow["agent"] {
  return {
    id: agent.id,
    uuid: agent.uuid,
    name: agent.name,
    code: agent.code,
    avatar: agent.config?.metadata?.avatar || "",
    agent_type: agent.agent_type,
    online: agent.edge_status === "online",
  };
}

function normalizeHuman(user: SharedUser): SharedSessionRow["human"] {
  return {
    id: user.user_id,
    uuid: user.uuid || `user-${user.user_id}`,
    username: user.username,
    display_name: user.display_name || user.username,
    avatar: user.avatar || "",
  };
}

export async function listOperationAgents(apiKey: string, workspaceCode: string): Promise<Agent[]> {
  const result = await apiRequest<{ agents: Agent[] }>("/agents", { apiKey, workspaceCode });
  return result.agents || [];
}

export async function listSharedUsers(apiKey: string, workspaceCode: string, agentId: number): Promise<SharedUser[]> {
  const result = await apiRequest<{ users: SharedUser[] }>(`/agents/${agentId}/shared-users`, { apiKey, workspaceCode });
  return result.users || [];
}

export async function listAgentUserSharedSessions(apiKey: string, workspaceCode: string, agent: Agent, user: SharedUser): Promise<SharedSessionRow[]> {
  const result = await apiRequest<{ sessions: SharedSessionInfo[] }>(`/agents/${agent.id}/users/${user.user_id}/shared-sessions`, { apiKey, workspaceCode });
  const rowAgent = normalizeAgent(agent);
  const human = normalizeHuman(user);
  return (result.sessions || []).map((session) => ({ session, agent: rowAgent, human }));
}

export async function listSharedSessions(apiKey: string, workspaceCode: string): Promise<SharedSessionRow[]> {
  const result = await apiRequest<{ sessions: SharedSessionRow[] }>("/sessions/shared", { apiKey, workspaceCode });
  return result.sessions || [];
}

export async function getSessionMessages(apiKey: string, workspaceCode: string, sessionId: number): Promise<SessionMessage[]> {
  const result = await apiRequest<{ messages: SessionMessage[] }>(`/sessions/${sessionId}/messages`, { apiKey, workspaceCode });
  return result.messages || [];
}

export function verifySession(apiKey: string, workspaceCode: string, sessionId: number, verified: boolean): Promise<{ id: number; verified: boolean }> {
  return apiRequest(`/sessions/${sessionId}/verify`, { method: "PATCH", apiKey, workspaceCode, body: JSON.stringify({ verified }) });
}

export function updateSessionPrompt(apiKey: string, workspaceCode: string, sessionId: number, promptPatch: string): Promise<{ prompt_patch: string }> {
  return apiRequest(`/sessions/${sessionId}/prompt`, { method: "PATCH", apiKey, workspaceCode, body: JSON.stringify({ prompt_patch: promptPatch, reason: "" }) });
}

export async function getUserAgentPrompt(apiKey: string, workspaceCode: string, agentId: number, userId: number): Promise<UserAgentPrompt | null> {
  try {
    return await apiRequest(`/agents/${agentId}/users/${userId}/prompt`, { apiKey, workspaceCode });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export function setUserAgentPrompt(apiKey: string, workspaceCode: string, agentId: number, userId: number, prompt: string): Promise<UserAgentPrompt> {
  return apiRequest(`/agents/${agentId}/users/${userId}/prompt`, { method: "PUT", apiKey, workspaceCode, body: JSON.stringify({ prompt }) });
}

export function pushCreatorComment(apiKey: string, workspaceCode: string, row: SharedSessionRow, content: string): Promise<{ message_id: string; session_id: number }> {
  const body: Record<string, unknown> = {
    user_id: row.human.id,
    sender_agent_id: row.agent.id,
    sender_name: row.agent.name,
    content: `[创作者评论] ${content.trim()}`,
    content_type: "text",
  };
  if (row.session.is_group && row.session.group_id) body.group_id = row.session.group_id;
  else body.session_id = row.session.id;
  return apiRequest("/user/push-messages", { method: "POST", apiKey, workspaceCode, body: JSON.stringify(body) });
}
