import { apiRequest } from "@/shared/api/http-client";
import type {
  AgentClientExport,
  AgentClientList,
  AgentClientRuntimeVersion,
  AgentVersion,
  AgentVersionList,
  CreateDraftFromVersionInput,
  PublishAgentVersionInput,
  PublishAgentVersionResult,
} from "./types";

type Auth = { apiKey: string; workspaceCode: string };

export function listAgentVersions(auth: Auth, agentId: number, limit = 20, offset = 0) {
  return apiRequest<AgentVersionList>(
    `/agents/${agentId}/versions?limit=${limit}&offset=${offset}`,
    auth,
  );
}

export function getAgentVersion(auth: Auth, agentId: number, versionNo: number) {
  return apiRequest<AgentVersion>(`/agents/${agentId}/versions/${versionNo}`, auth);
}

export function publishAgentVersion(
  auth: Auth,
  agentId: number,
  input: PublishAgentVersionInput,
) {
  return apiRequest<PublishAgentVersionResult>(`/agents/${agentId}/publish`, {
    ...auth,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function createDraftFromVersion(
  auth: Auth,
  agentId: number,
  versionNo: number,
  input: CreateDraftFromVersionInput,
) {
  return apiRequest<{ agent: import("@/modules/agents/types").Agent }>(
    `/agents/${agentId}/versions/${versionNo}/create-draft`,
    { ...auth, method: "POST", body: JSON.stringify(input) },
  ).then((result) => result.agent);
}

export function listAgentClients(auth: Auth, agentId: number) {
  return apiRequest<AgentClientList>(`/agents/${agentId}/clients`, auth);
}

export async function getAgentClientRuntimeVersion(auth: Auth, clientId: number): Promise<AgentClientRuntimeVersion> {
  const result = await apiRequest<{
    version: AgentVersion;
    client_config: Record<string, unknown> | null;
  }>(`/agent-clients/${clientId}/runtime-version`, auth);
  return {
    ...result,
    current_version_id: result.version.id,
    current_version_no: result.version.version_no,
    current_version_hash: result.version.version_hash,
  } satisfies AgentClientRuntimeVersion;
}

export function createAgentClientExport(auth: Auth, clientId: number) {
  return apiRequest<AgentClientExport>(`/agent-clients/${clientId}/exports`, {
    ...auth,
    method: "POST",
  });
}
