import { ApiError, apiRequest } from "@/shared/api/http-client";
import type { SessionMessage, SharedSessionRow, UserAgentPrompt } from "./types";

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
  return apiRequest("/user/push-messages", { method: "POST", apiKey, workspaceCode, body: JSON.stringify({ user_id: row.human.id, session_id: row.session.id, sender_agent_id: row.agent.id, sender_name: row.agent.name, content: `[创作者评论] ${content.trim()}`, content_type: "text" }) });
}
