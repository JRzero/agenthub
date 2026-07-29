import { apiRequest, getApiBaseUrl } from "@/shared/api/http-client";
import type { Agent } from "@/modules/agents/types";

export interface MotherlandStatus { configured: boolean; agent_id?: number }
export interface MotherlandMessage { role: "user" | "assistant"; content: string }

export async function getMotherlandStatus(): Promise<MotherlandStatus> {
  const response = await fetch(`${getApiBaseUrl()}/api/v1/system/motherland-status`);
  if (!response.ok) throw new Error(`Motherland 状态读取失败（${response.status}）`);
  return response.json() as Promise<MotherlandStatus>;
}

export function getMotherlandHistory(apiKey: string, agentId: number): Promise<{ messages: MotherlandMessage[] }> {
  return apiRequest<{ messages: MotherlandMessage[] }>("/system/motherland-chat-history", { method: "POST", apiKey, body: JSON.stringify({ agent_id: agentId }) });
}

export function talkToMotherland(apiKey: string, agentId: number, content: string): Promise<{ content: string }> {
  return apiRequest<{ content: string }>("/system/talk-to-motherland", { method: "POST", apiKey, body: JSON.stringify({ content, agent_id: agentId }) });
}

export function autoTalkRound(apiKey: string, agentId: number, topic: string): Promise<{ agent_message: string; motherland_reply: string }> {
  return apiRequest<{ agent_message: string; motherland_reply: string }>("/system/auto-talk-round", { method: "POST", apiKey, body: JSON.stringify({ agent_id: agentId, topic }) });
}

export function generateMotherlandTopic(apiKey: string, agentId: number): Promise<{ topic: string }> {
  return apiRequest<{ topic: string }>("/system/generate-topic", { method: "POST", apiKey, body: JSON.stringify({ agent_id: agentId }) });
}

export function resetMotherlandHistory(apiKey: string, agentId: number): Promise<{ status: string }> {
  return apiRequest<{ status: string }>("/system/motherland-chat-reset", { method: "POST", apiKey, body: JSON.stringify({ agent_id: agentId }) });
}

export function optimizeNarrative(apiKey: string, agentId: number, baselinePrompt: string, instruction: string): Promise<{ optimized_prompt: string }> {
  return apiRequest<{ optimized_prompt: string }>(`/agents/${agentId}/optimize-narrative`, { method: "POST", apiKey, body: JSON.stringify({ baseline_prompt: baselinePrompt, instruction }) });
}

export function generateAvatarPreview(apiKey: string, agentId: number, prompt: string): Promise<{ image_url: string }> {
  return apiRequest<{ image_url: string }>(`/agents/${agentId}/avatar/generate-preview`, { method: "POST", apiKey, body: JSON.stringify({ prompt }) });
}

export function generateCharacterSpec(apiKey: string, agentId: number, systemPrompt: string): Promise<{ spec_text: string }> {
  return apiRequest<{ spec_text: string }>(`/agents/${agentId}/character-design/generate-spec`, { method: "POST", apiKey, body: JSON.stringify({ system_prompt: systemPrompt }) });
}

export function generateCharacterSheet(apiKey: string, agentId: number, specText: string): Promise<{ image_url: string }> {
  return apiRequest<{ image_url: string }>(`/agents/${agentId}/character-design/generate-sheet`, { method: "POST", apiKey, body: JSON.stringify({ spec_text: specText }) });
}

export function saveCharacterDesign(
  apiKey: string,
  agentId: number,
  specText: string,
  imageUrl: string,
  expectedDraftRevision: number,
): Promise<Agent> {
  return apiRequest<Agent>(`/agents/${agentId}/character-design/save`, {
    method: "POST",
    apiKey,
    body: JSON.stringify({
      spec_text: specText,
      image_url: imageUrl,
      expected_draft_revision: expectedDraftRevision,
    }),
  });
}

export function deleteCharacterDesign(
  apiKey: string,
  agentId: number,
  expectedDraftRevision: number,
): Promise<Agent> {
  return apiRequest<Agent>(
    `/agents/${agentId}/character-design?expected_draft_revision=${expectedDraftRevision}`,
    { method: "DELETE", apiKey },
  );
}
