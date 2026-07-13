import { apiRequest } from "@/shared/api/http-client";
import type { RuntimeMessage, RuntimeMessageOptions, RuntimeMessageResponse, RuntimeSession, RuntimeWidgetSpec } from "./types";

export async function listRuntimeSessions(apiKey: string, workspaceCode: string): Promise<RuntimeSession[]> {
  const result = await apiRequest<{ sessions: RuntimeSession[]; total: number }>("/sessions", { apiKey, workspaceCode });
  return result.sessions || [];
}

export function createRuntimeSession(apiKey: string, workspaceCode: string, agentId: number, userId = 1): Promise<RuntimeSession> {
  return apiRequest<RuntimeSession>("/sessions", { method: "POST", apiKey, workspaceCode, body: JSON.stringify({ agent_id: agentId, user_id: userId }) });
}

export function getRuntimeSession(apiKey: string, workspaceCode: string, sessionId: number): Promise<RuntimeSession> {
  return apiRequest<RuntimeSession>(`/sessions/${sessionId}`, { apiKey, workspaceCode });
}

export async function getRuntimeMessages(apiKey: string, workspaceCode: string, sessionId: number): Promise<RuntimeMessage[]> {
  const result = await apiRequest<{ messages: RuntimeMessage[]; total: number }>(`/sessions/${sessionId}/messages`, { apiKey, workspaceCode });
  return result.messages || [];
}

export async function getRuntimeWidgets(apiKey: string, workspaceCode: string, agentId: number): Promise<RuntimeWidgetSpec[]> {
  const result = await apiRequest<{ widgets: RuntimeWidgetSpec[] }>(`/agents/${agentId}/skills/widgets`, { apiKey, workspaceCode });
  return result.widgets || [];
}

export function sendRuntimeMessage(apiKey: string, workspaceCode: string, sessionId: number, content: string, options?: RuntimeMessageOptions): Promise<RuntimeMessageResponse> {
  const body: Record<string, unknown> = { content };
  if (options?.attachments?.length) body.attachments = options.attachments;
  if (options?.metadata?.custom_fields && Object.keys(options.metadata.custom_fields).length) body.metadata = options.metadata;
  return apiRequest<RuntimeMessageResponse>(`/sessions/${sessionId}/messages`, { method: "POST", apiKey, workspaceCode, body: JSON.stringify(body) });
}

export async function getTestUserId(apiKey: string, workspaceCode: string, agentId: number): Promise<number | null> {
  const result = await apiRequest<{ test_user_id: number }>(`/agents/${agentId}/test-user`, { apiKey, workspaceCode });
  return result.test_user_id || null;
}

export function clearTestUserMemories(apiKey: string, workspaceCode: string, userId: number, agentId: number): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/users/${userId}/agents/${agentId}/memories`, { method: "DELETE", apiKey, workspaceCode });
}
