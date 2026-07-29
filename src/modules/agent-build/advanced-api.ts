import { ApiError, apiRequest, getApiBaseUrl } from "@/shared/api/http-client";
import type { Agent } from "@/modules/agents/types";
import type {
  CreatorSkill,
  UpdateCreatorSkillRequest,
} from "@/modules/resources/types";

export interface LLMProvider {
  name: string;
  display_name: string;
  description: string;
  model: string;
  models?: string[];
  skip_temperature: boolean;
  capabilities: string[];
}

export interface LLMProviderFamily {
  key: string;
  label: string;
  providers: LLMProvider[];
}

const PROVIDER_FAMILY_DEFINITIONS = [
  { key: "openai", label: "OpenAI", keywords: ["openai", "gpt"] },
  { key: "anthropic", label: "Anthropic", keywords: ["anthropic", "claude"] },
  { key: "gemini", label: "Google Gemini", keywords: ["gemini"] },
  { key: "zhipu", label: "智谱 AI", keywords: ["zhipu", "chatglm", "glm", "智谱"] },
  { key: "minimax", label: "MiniMax", keywords: ["minimax"] },
  { key: "qwen", label: "通义千问", keywords: ["qwen", "通义千问"] },
  { key: "doubao", label: "豆包", keywords: ["doubao", "豆包"] },
] as const;

function getProviderModels(provider: LLMProvider): string[] {
  return Array.from(new Set([...(provider.models || []), provider.model].map((model) => model.trim()).filter(Boolean)));
}

function getProviderFamilyIdentity(provider: LLMProvider): { key: string; label: string } {
  const searchable = [provider.name, provider.display_name, provider.model, ...(provider.models || [])].join(" ").toLowerCase();
  const definition = PROVIDER_FAMILY_DEFINITIONS.find(({ keywords }) => keywords.some((keyword) => searchable.includes(keyword.toLowerCase())));
  return definition || { key: "provider:" + provider.name, label: provider.display_name || provider.name };
}

export function getLLMProviderFamilies(providers: LLMProvider[]): LLMProviderFamily[] {
  const grouped = new Map<string, LLMProviderFamily>();
  for (const provider of providers) {
    const identity = getProviderFamilyIdentity(provider);
    const family = grouped.get(identity.key);
    if (family) family.providers.push(provider);
    else grouped.set(identity.key, { ...identity, providers: [provider] });
  }

  const known = PROVIDER_FAMILY_DEFINITIONS
    .map(({ key }) => grouped.get(key))
    .filter((family): family is LLMProviderFamily => Boolean(family));
  const custom = Array.from(grouped.values()).filter((family) => !PROVIDER_FAMILY_DEFINITIONS.some(({ key }) => key === family.key));
  return [...known, ...custom];
}

export function getLLMProviderFamily(providers: LLMProvider[], providerName: string): LLMProviderFamily | undefined {
  const provider = providers.find((item) => item.name === providerName);
  if (!provider) return undefined;
  const identity = getProviderFamilyIdentity(provider);
  return getLLMProviderFamilies(providers).find((family) => family.key === identity.key);
}

export function getLLMProviderModelOptions(providers: LLMProvider[], providerName: string, currentModel = ""): string[] {
  const family = getLLMProviderFamily(providers, providerName);
  return Array.from(new Set([
    ...(family?.providers.flatMap(getProviderModels) || []),
    currentModel,
  ].map((model) => model.trim()).filter(Boolean)));
}

export const RUNTIME_PROVIDER_PROTOCOLS = [
  { value: "openai", label: "OpenAI 兼容" },
  { value: "anthropic", label: "Anthropic 兼容" },
  { value: "gemini", label: "Google Gemini 兼容" },
] as const;

export function getRuntimeProviderSelection(providerName: string, providerType: string, providers: LLMProvider[] = []): string {
  if (providerName) {
    const family = getLLMProviderFamily(providers, providerName);
    return family ? "catalogue:" + family.key : "provider:" + providerName;
  }
  if (providerType) return "protocol:" + providerType;
  return "";
}

export function getRuntimeProviderPatch(selection: string, providers: LLMProvider[]) {
  if (selection.startsWith("catalogue:")) {
    const familyKey = selection.slice("catalogue:".length);
    const provider = getLLMProviderFamilies(providers).find((family) => family.key === familyKey)?.providers[0];
    return {
      llmProvider: provider?.name || "",
      llmProviderType: "",
      llmModelName: "",
      llmBaseUrl: "",
      ...(provider?.skip_temperature ? { llmTemperature: null } : {}),
    };
  }

  if (selection.startsWith("provider:")) {
    const llmProvider = selection.slice("provider:".length);
    const provider = providers.find((item) => item.name === llmProvider);
    return {
      llmProvider,
      llmProviderType: "",
      llmModelName: "",
      llmBaseUrl: "",
      ...(provider?.skip_temperature ? { llmTemperature: null } : {}),
    };
  }

  if (selection.startsWith("protocol:")) {
    return {
      llmProvider: "",
      llmProviderType: selection.slice("protocol:".length),
      llmModelName: "",
    };
  }

  return {
    llmProvider: "",
    llmProviderType: "",
    llmModelName: "",
    llmBaseUrl: "",
  };
}

export function getRuntimeModelPatch(model: string, providerSelection: string, providers: LLMProvider[]) {
  if (!providerSelection.startsWith("catalogue:")) return { llmModelName: model };

  const familyKey = providerSelection.slice("catalogue:".length);
  const family = getLLMProviderFamilies(providers).find((item) => item.key === familyKey);
  const provider = model
    ? family?.providers.find((item) => getProviderModels(item).includes(model))
    : family?.providers[0];

  return {
    llmProvider: provider?.name || "",
    llmModelName: model,
    ...(provider?.skip_temperature ? { llmTemperature: null } : {}),
  };
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

export async function uploadAgentAvatar(
  apiKey: string,
  agentId: number,
  blob: Blob,
  expectedDraftRevision: number,
): Promise<Agent> {
  const form = new FormData();
  form.append("avatar", blob, "avatar.jpg");
  form.append("expected_draft_revision", String(expectedDraftRevision));
  const response = await fetch(`${getApiBaseUrl()}/api/v1/agents/${agentId}/avatar`, { method: "POST", headers: { "X-API-Key": apiKey }, body: form });
  const envelope = await response.json().catch(() => null) as {
    success?: boolean;
    data?: Agent | { code?: string; error?: string; message?: string };
    error?: { code?: string; message?: string };
  } | null;
  const businessError =
    envelope?.data && typeof envelope.data === "object" && "code" in envelope.data
      ? (envelope.data as {
          code?: string;
          error?: string;
          message?: string;
        })
      : undefined;
  if (!response.ok || envelope?.success === false || !envelope?.data) {
    throw new ApiError(
      envelope?.error?.message ||
        businessError?.error ||
        businessError?.message ||
        `头像上传失败（${response.status}）`,
      response.status,
      envelope?.error?.code || businessError?.code,
    );
  }
  return envelope.data as Agent;
}

export function deleteAgentAvatar(
  apiKey: string,
  agentId: number,
  expectedDraftRevision: number,
): Promise<Agent> {
  return apiRequest<Agent>(
    `/agents/${agentId}/avatar?expected_draft_revision=${expectedDraftRevision}`,
    { method: "DELETE", apiKey },
  );
}

export async function listStageSkills(apiKey: string, agentId: number, stage: SkillStage): Promise<AgentStageSkill[]> {
  const result = await apiRequest<Record<string, AgentStageSkill[]>>(`/agents/${agentId}/${stage}-skills`, { apiKey });
  return result[`${stage}_skills`] || [];
}

export interface StageSkillsUpdateResult {
  message: string;
  draft_revision: number;
}

export function setStageSkills(
  apiKey: string,
  agentId: number,
  stage: SkillStage,
  expectedDraftRevision: number,
  skills: Array<{ creator_skill_id: number; config?: Record<string, unknown> }>,
): Promise<StageSkillsUpdateResult> {
  return apiRequest<StageSkillsUpdateResult>(`/agents/${agentId}/${stage}-skills`, {
    method: "PUT",
    apiKey,
    body: JSON.stringify({
      expected_draft_revision: expectedDraftRevision,
      [`${stage}_skills`]: skills,
    }),
  });
}

export function listBuildCreatorSkills(apiKey: string): Promise<{ creator_skills: CreatorSkill[] }> {
  return apiRequest<{ creator_skills: CreatorSkill[] }>("/creator-skills", { apiKey });
}

export function updateBuildCreatorSkill(apiKey: string, skillId: number, data: UpdateCreatorSkillRequest): Promise<CreatorSkill> {
  return apiRequest<CreatorSkill>(`/creator-skills/${skillId}`, { method: "PUT", apiKey, body: JSON.stringify(data) });
}

export function addBuiltinUpload(
  apiKey: string,
  agentId: number,
  kind: "image" | "document",
  expectedDraftRevision: number,
): Promise<StageSkillsUpdateResult & { creator_skill_id?: number }> {
  return apiRequest<StageSkillsUpdateResult & { creator_skill_id?: number }>(
    `/agents/${agentId}/pre-skills/add-builtin-${kind}-upload?expected_draft_revision=${expectedDraftRevision}`,
    { method: "POST", apiKey },
  );
}
