import {
  ApiError,
  apiRequest,
  getApiBaseUrl,
} from "@/shared/api/http-client";
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

export interface AgentExportDownload {
  blob: Blob;
  filename: string;
  packageHash: string | null;
}

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

export function createAgentExport(auth: Auth, agentId: number) {
  return apiRequest<AgentClientExport>(`/agents/${agentId}/exports`, {
    ...auth,
    method: "POST",
  });
}

export async function downloadAgentExport(
  auth: Auth & { username?: string },
  exportId: number,
): Promise<AgentExportDownload> {
  const headers: Record<string, string> = { "X-API-Key": auth.apiKey };
  if (auth.username) headers["X-Username"] = auth.username;
  if (auth.workspaceCode && auth.workspaceCode !== "default") {
    headers["X-Workspace-Code"] = auth.workspaceCode;
  }

  const response = await fetch(
    `${getApiBaseUrl()}/api/v1/agent-exports/${exportId}/download`,
    { headers },
  );
  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("agenthub:unauthorized"));
    }
    const envelope = (await response.json().catch(() => null)) as {
      error?: { code?: string; message?: string };
      data?: { code?: string; error?: string; message?: string };
    } | null;
    throw new ApiError(
      envelope?.error?.message ||
        envelope?.data?.error ||
        envelope?.data?.message ||
        `下载导出包失败（${response.status}）`,
      response.status,
      envelope?.error?.code || envelope?.data?.code,
    );
  }

  const contentType = response.headers.get("Content-Type") || "";
  if (!contentType.toLowerCase().includes("application/zip")) {
    throw new ApiError(
      "服务未返回有效的 ZIP 导出包",
      response.status,
      "EXPORT_RESPONSE_INVALID",
    );
  }

  const disposition = response.headers.get("Content-Disposition") || "";
  const filename =
    disposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1] ||
    disposition.match(/filename="?([^";]+)"?/i)?.[1] ||
    `agent-export-${exportId}.zip`;
  return {
    blob: await response.blob(),
    filename: decodeURIComponent(filename),
    packageHash: response.headers.get("X-Package-SHA256"),
  };
}
