export type VersionAvailability = "available" | "revoked";

export interface AgentVersion {
  id: number;
  agent_id: number;
  version_no: number;
  version_hash: string;
  hash_schema_version: number;
  config_snapshot: Record<string, unknown>;
  resource_manifest: Record<string, unknown>;
  required_capabilities: string[] | null;
  change_summary: Record<string, unknown> | null;
  release_note: string;
  availability: VersionAvailability;
  created_by: number;
  created_by_name?: string | null;
  created_by_username?: string | null;
  created_at: string;
}

export interface AgentVersionList {
  versions: AgentVersion[];
}

export interface PublishAgentVersionInput {
  expected_draft_revision: number;
  expected_current_version_id: number | null;
  release_note: string;
  request_key: string;
}

export interface PublishAgentVersionResult {
  agent: import("@/modules/agents/types").Agent;
  version: AgentVersion;
}

export interface CreateDraftFromVersionInput {
  expected_draft_revision: number;
  confirm_replace: boolean;
}

export interface AgentClient {
  id: number;
  uuid: string;
  agent_id: number;
  client_key: string;
  client_type: string;
  name: string;
  status: "enabled" | "disabled";
  config: Record<string, unknown> | null;
  capability_manifest:
    ({ capabilities?: string[] } & Record<string, unknown>) | null;
  capability_hash: string;
  last_ack_version_id?: number | null;
  last_seen_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AgentClientList {
  clients: AgentClient[];
}

export interface CreateAgentClientInput {
  client_key: string;
  client_type: string;
  name: string;
  config?: Record<string, unknown> | null;
  capability_manifest?: AgentClient["capability_manifest"];
}

export interface UpdateAgentClientInput {
  expected_capability_hash: string;
  name?: string;
  status?: AgentClient["status"];
  config?: Record<string, unknown> | null;
  capability_manifest?: AgentClient["capability_manifest"];
}

export interface AgentClientRuntimeVersion {
  version: AgentVersion;
  client_config: Record<string, unknown> | null;
  current_version_id: number;
  current_version_no: number;
  current_version_hash: string;
}

export interface AgentClientExport {
  id: number;
  uuid: string;
  agent_id: number;
  agent_version_id: number;
  agent_client_id?: number | null;
  package_hash: string;
  storage_path: string;
  file_size: number;
  exported_by: number;
  exported_at: string;
}

export type VersionStatus = "current" | "published" | "archived" | "draft";
export interface VersionSnapshot {
  id: string;
  version: number;
  label: string;
  status: VersionStatus;
  createdAt: string;
  createdBy: string;
  summary: string;
  snapshot: {
    description: string;
    model: string;
    prompt: string;
    temperature: number;
    memoryEnabled: boolean;
    knowledgeBaseId: number | null;
    skills: string[];
  };
}
export interface VersionDifference {
  field: string;
  label: string;
  before: string;
  after: string;
  changed: boolean;
}
