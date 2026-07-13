import type { Agent } from "@/modules/agents/types";
import { apiRequest } from "@/shared/api/http-client";
import type {
  CreatorSkill,
  DocumentChunksResponse,
  KnowledgeBase,
  KnowledgeDocument,
  MarketplaceSkill,
} from "./types";

export async function listMarketplaceSkills(apiKey: string, workspaceCode: string): Promise<MarketplaceSkill[]> {
  const result = await apiRequest<{ skills?: MarketplaceSkill[] } | null>("/skills/marketplace", { apiKey, workspaceCode });
  return Array.isArray(result?.skills) ? result.skills : [];
}

export function getMarketplaceSkill(apiKey: string, workspaceCode: string, id: number): Promise<MarketplaceSkill> {
  return apiRequest<MarketplaceSkill>(`/skills/marketplace/${id}`, { apiKey, workspaceCode });
}

export async function listCreatorSkills(apiKey: string, workspaceCode: string): Promise<CreatorSkill[]> {
  const result = await apiRequest<{ creator_skills?: CreatorSkill[] } | null>("/creator-skills", { apiKey, workspaceCode });
  return Array.isArray(result?.creator_skills) ? result.creator_skills : [];
}

export function getCreatorSkill(apiKey: string, workspaceCode: string, id: number): Promise<CreatorSkill> {
  return apiRequest<CreatorSkill>(`/creator-skills/${id}`, { apiKey, workspaceCode });
}

export function getSkillDefaults(skill: MarketplaceSkill): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(skill.config_schema?.properties || {})
      .filter(([, property]) => property.default !== undefined)
      .map(([key, property]) => [key, property.default]),
  );
}

export function createCreatorSkill(apiKey: string, workspaceCode: string, skill: MarketplaceSkill, name = skill.name): Promise<CreatorSkill> {
  return apiRequest<CreatorSkill>("/creator-skills", {
    method: "POST",
    apiKey,
    workspaceCode,
    body: JSON.stringify({ skill_id: skill.id, name: name.trim(), config: getSkillDefaults(skill) }),
  });
}

export function updateCreatorSkill(
  apiKey: string,
  workspaceCode: string,
  id: number,
  input: { name?: string; config?: Record<string, unknown>; status?: string },
): Promise<CreatorSkill> {
  return apiRequest<CreatorSkill>(`/creator-skills/${id}`, {
    method: "PUT",
    apiKey,
    workspaceCode,
    body: JSON.stringify(input),
  });
}

export function deleteCreatorSkill(apiKey: string, workspaceCode: string, id: number): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/creator-skills/${id}`, { method: "DELETE", apiKey, workspaceCode });
}

export function attachSkillToAgent(apiKey: string, workspaceCode: string, agent: Agent, skill: MarketplaceSkill): Promise<Agent> {
  const skills = Array.from(new Set([...(agent.config?.skills || []), skill.name]));
  return apiRequest<Agent>(`/agents/${agent.id}`, { method: "PUT", apiKey, workspaceCode, body: JSON.stringify({ skills }) });
}

export async function listKnowledgeBases(apiKey: string, workspaceCode: string): Promise<KnowledgeBase[]> {
  const result = await apiRequest<KnowledgeBase[] | null>("/knowledge-bases", { apiKey, workspaceCode });
  return Array.isArray(result) ? result : [];
}

export function createKnowledgeBase(apiKey: string, workspaceCode: string, input: { name: string; description: string }): Promise<KnowledgeBase> {
  return apiRequest<KnowledgeBase>("/knowledge-bases", { method: "POST", apiKey, workspaceCode, body: JSON.stringify(input) });
}

export function updateKnowledgeBase(apiKey: string, workspaceCode: string, id: number, input: { name?: string; description?: string }): Promise<KnowledgeBase> {
  return apiRequest<KnowledgeBase>(`/knowledge-bases/${id}`, { method: "PUT", apiKey, workspaceCode, body: JSON.stringify(input) });
}

export function deleteKnowledgeBase(apiKey: string, workspaceCode: string, id: number): Promise<void> {
  return apiRequest<void>(`/knowledge-bases/${id}`, { method: "DELETE", apiKey, workspaceCode });
}

export async function listDocuments(apiKey: string, workspaceCode: string, knowledgeBaseId: number): Promise<KnowledgeDocument[]> {
  const result = await apiRequest<KnowledgeDocument[] | null>(`/knowledge-bases/${knowledgeBaseId}/documents`, { apiKey, workspaceCode });
  return Array.isArray(result) ? result : [];
}

export function getDocument(apiKey: string, workspaceCode: string, documentId: number): Promise<KnowledgeDocument> {
  return apiRequest<KnowledgeDocument>(`/documents/${documentId}`, { apiKey, workspaceCode });
}

export function addTextDocument(apiKey: string, workspaceCode: string, knowledgeBaseId: number, input: { title: string; content: string }): Promise<KnowledgeDocument> {
  return apiRequest<KnowledgeDocument>(`/knowledge-bases/${knowledgeBaseId}/documents/text`, { method: "POST", apiKey, workspaceCode, body: JSON.stringify(input) });
}

export function addUrlDocument(apiKey: string, workspaceCode: string, knowledgeBaseId: number, input: { title: string; url: string }): Promise<KnowledgeDocument> {
  return apiRequest<KnowledgeDocument>(`/knowledge-bases/${knowledgeBaseId}/documents/url`, { method: "POST", apiKey, workspaceCode, body: JSON.stringify(input) });
}

export function deleteDocument(apiKey: string, workspaceCode: string, documentId: number): Promise<void> {
  return apiRequest<void>(`/documents/${documentId}`, { method: "DELETE", apiKey, workspaceCode });
}

export function reindexDocument(apiKey: string, workspaceCode: string, documentId: number): Promise<void> {
  return apiRequest<void>(`/documents/${documentId}/reindex`, { method: "POST", apiKey, workspaceCode });
}

export async function listDocumentChunks(apiKey: string, workspaceCode: string, documentId: number, page = 1, pageSize = 20): Promise<DocumentChunksResponse> {
  const result = await apiRequest<DocumentChunksResponse | null>(`/documents/${documentId}/chunks?page=${page}&page_size=${pageSize}`, { apiKey, workspaceCode });
  return result && Array.isArray(result.chunks)
    ? result
    : { chunks: [], total: 0, page, page_size: pageSize };
}
