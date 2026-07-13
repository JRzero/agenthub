import { apiRequest } from "@/shared/api/http-client";
import type { Workspace } from "./types";

export async function listWorkspaces(apiKey: string): Promise<Workspace[]> {
  const result = await apiRequest<{ workspaces: Workspace[] }>("/user/workspaces", { apiKey });
  return result.workspaces || [];
}

export function switchActiveWorkspace(apiKey: string, workspaceCode: string): Promise<{ workspace: Workspace; message: string }> {
  return apiRequest<{ workspace: Workspace; message: string }>("/user/workspace/switch", {
    method: "POST",
    apiKey,
    body: JSON.stringify({ workspace_code: workspaceCode }),
  });
}

export function getWorkspaceInviteCode(apiKey: string, workspaceCode: string): Promise<{ invite_code: string }> {
  return apiRequest<{ invite_code: string }>("/user/workspace/invite-code", { apiKey, workspaceCode });
}

export function refreshWorkspaceInviteCode(apiKey: string, workspaceCode: string): Promise<{ invite_code: string }> {
  return apiRequest<{ invite_code: string }>("/user/workspace/invite-code/refresh", { method: "POST", apiKey, workspaceCode });
}
