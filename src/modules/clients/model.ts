import type { AgentClient } from "@/modules/agent-versions/types";
import type { Agent } from "@/modules/agents/types";

export type ClientSyncStatus =
  | "synced"
  | "pending"
  | "unconfirmed"
  | "disabled";

export interface WorkspaceAgentClient {
  client: AgentClient;
  agent: Agent;
  syncStatus: ClientSyncStatus;
}

export interface ClientFilters {
  query: string;
  agentId: number | "all";
  clientType: string;
  status: AgentClient["status"] | "all";
  syncStatus: ClientSyncStatus | "all";
}

export function resolveClientSyncStatus(
  client: AgentClient,
  currentVersionId?: number | null,
): ClientSyncStatus {
  if (client.status === "disabled") return "disabled";
  if (!client.last_ack_version_id) return "unconfirmed";
  return client.last_ack_version_id === currentVersionId
    ? "synced"
    : "pending";
}

export function createWorkspaceAgentClient(
  agent: Agent,
  client: AgentClient,
): WorkspaceAgentClient {
  return {
    agent,
    client,
    syncStatus: resolveClientSyncStatus(client, agent.current_version_id),
  };
}

export function filterWorkspaceAgentClients(
  rows: WorkspaceAgentClient[],
  filters: ClientFilters,
) {
  const query = filters.query.trim().toLocaleLowerCase();
  return rows.filter((row) => {
    if (
      query &&
      ![
        row.client.name,
        row.client.client_type,
        row.client.client_key,
        row.agent.name,
      ].some((value) => value.toLocaleLowerCase().includes(query))
    ) {
      return false;
    }
    if (filters.agentId !== "all" && row.agent.id !== filters.agentId) {
      return false;
    }
    if (
      filters.clientType !== "all" &&
      row.client.client_type !== filters.clientType
    ) {
      return false;
    }
    if (filters.status !== "all" && row.client.status !== filters.status) {
      return false;
    }
    return (
      filters.syncStatus === "all" ||
      row.syncStatus === filters.syncStatus
    );
  });
}

export function clientTypeLabel(type: string) {
  const labels: Record<string, string> = {
    web_chat: "Web Chat",
    h5_remote: "H5 远程端",
    local_desktop: "本地桌面端",
    mobile_app: "移动应用",
    api: "API / SDK",
  };
  return labels[type] || type.replaceAll("_", " ");
}

export function clientSyncLabel(status: ClientSyncStatus) {
  return {
    synced: "已同步",
    pending: "等待同步",
    unconfirmed: "尚未确认",
    disabled: "已停用",
  }[status];
}

export function maskClientKey(value: string) {
  const key = value.trim();
  if (!key) return "未提供";
  if (key.includes("***")) return key;

  const visibleStart = Math.min(4, Math.max(2, Math.floor(key.length / 3)));
  const visibleEnd = Math.min(4, Math.max(2, Math.floor(key.length / 4)));
  if (key.length <= visibleStart + visibleEnd) {
    return `${key.slice(0, 2)}***`;
  }
  return `${key.slice(0, visibleStart)}***${key.slice(-visibleEnd)}`;
}

export function clientEnvironmentLabel(client: AgentClient) {
  const configured = client.config?.environment || client.config?.env;
  if (typeof configured === "string" && configured.trim()) {
    return configured.trim();
  }
  if (client.client_type.includes("local") || client.client_type.includes("desktop")) {
    return "本地运行";
  }
  if (client.client_type.includes("web") || client.client_type.includes("h5")) {
    return "Web";
  }
  if (client.client_type.includes("mobile")) return "移动端";
  if (client.client_type === "api") return "API";
  return clientTypeLabel(client.client_type);
}

export function formatClientDate(value?: string | null) {
  if (!value) return "尚未连接";
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
