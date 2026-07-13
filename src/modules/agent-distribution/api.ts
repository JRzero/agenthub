import { ApiError, apiRequest } from "@/shared/api/http-client";
import type { ShareLink } from "./types";

export async function getShareLink(apiKey: string, agentId: number, workspaceCode: string): Promise<ShareLink | null> {
  try {
    return await apiRequest<ShareLink>(`/agents/${agentId}/share-link`, { apiKey, workspaceCode });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export function createShareLink(apiKey: string, agentId: number, workspaceCode: string): Promise<ShareLink> {
  return apiRequest<ShareLink>(`/agents/${agentId}/share-link`, { method: "POST", apiKey, workspaceCode });
}

export function setShareLinkEnabled(apiKey: string, agentId: number, workspaceCode: string, enabled: boolean): Promise<ShareLink> {
  return apiRequest<ShareLink>(`/agents/${agentId}/share-link`, { method: "PATCH", apiKey, workspaceCode, body: JSON.stringify({ enabled }) });
}

export function deleteShareLink(apiKey: string, agentId: number, workspaceCode: string): Promise<{ deleted: boolean }> {
  return apiRequest<{ deleted: boolean }>(`/agents/${agentId}/share-link`, { method: "DELETE", apiKey, workspaceCode });
}
