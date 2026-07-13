import { apiRequest, getApiBaseUrl } from "@/shared/api/http-client";
import type { Agent } from "@/modules/agents/types";
import type { CreatorSkill } from "@/modules/resources/types";

export interface LLMProvider {
  name: string;
  display_name: string;
  description: string;
  model: string;
  skip_temperature: boolean;
  capabilities: string[];
}

export interface AgentStageSkill {
  id: number;
  uuid?: string;
  skill_id: number;
  skill_name: string;
  name: string;
  config?: Record<string, unknown>;
  agent_config?: Record<string, unknown>;
}

export type SkillStage = "pre" | "mid" | "post";

export function listLLMProviders(apiKey: string): Promise<LLMProvider[]> {
  return apiRequest<LLMProvider[]>("/llm-providers", { apiKey });
}

export function resetEdgeToken(apiKey: string, agentId: number): Promise<{ edge_token: string }> {
  return apiRequest<{ edge_token: string }>(`/agents/${agentId}/edge-token/reset`, { method: "POST", apiKey });
}

export async function uploadAgentAvatar(apiKey: string, agentId: number, blob: Blob): Promise<Agent> {
  const form = new FormData();
  form.append("avatar", blob, "avatar.jpg");
  const response = await fetch(`${getApiBaseUrl()}/api/v1/agents/${agentId}/avatar`, { method: "POST", headers: { "X-API-Key": apiKey }, body: form });
  const envelope = await response.json() as { success?: boolean; data?: Agent; error?: { message?: string } };
  if (!response.ok || envelope.success === false || !envelope.data) throw new Error(envelope.error?.message || `头像上传失败（${response.status}）`);
  return envelope.data;
}

export function deleteAgentAvatar(apiKey: string, agentId: number): Promise<Agent> {
  return apiRequest<Agent>(`/agents/${agentId}/avatar`, { method: "DELETE", apiKey });
}

export async function listStageSkills(apiKey: string, agentId: number, stage: SkillStage): Promise<AgentStageSkill[]> {
  const result = await apiRequest<Record<string, AgentStageSkill[]>>(`/agents/${agentId}/${stage}-skills`, { apiKey });
  return result[`${stage}_skills`] || [];
}

export function setStageSkills(apiKey: string, agentId: number, stage: SkillStage, skills: Array<{ creator_skill_id: number; config?: Record<string, unknown> }>): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/agents/${agentId}/${stage}-skills`, { method: "PUT", apiKey, body: JSON.stringify({ [`${stage}_skills`]: skills }) });
}

export function listBuildCreatorSkills(apiKey: string): Promise<{ creator_skills: CreatorSkill[] }> {
  return apiRequest<{ creator_skills: CreatorSkill[] }>("/creator-skills", { apiKey });
}

export function updateBuildCreatorSkill(apiKey: string, skillId: number, data: { name?: string; config?: Record<string, unknown> }): Promise<CreatorSkill> {
  return apiRequest<CreatorSkill>(`/creator-skills/${skillId}`, { method: "PUT", apiKey, body: JSON.stringify(data) });
}

export function addBuiltinUpload(apiKey: string, agentId: number, kind: "image" | "document"): Promise<{ message: string; creator_skill_id?: number }> {
  return apiRequest<{ message: string; creator_skill_id?: number }>(`/agents/${agentId}/pre-skills/add-builtin-${kind}-upload`, { method: "POST", apiKey });
}
