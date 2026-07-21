import type { AgentVersion } from "@/modules/agent-versions/types";

export interface CurrentVersionConfigExport {
  format: "agenthub-current-version-config";
  format_version: 1;
  exported_at: string;
  export_note: string | null;
  agent: {
    id: number;
    name: string;
  };
  version: {
    id: number;
    version_no: number;
    version_hash: string;
    hash_schema_version: number;
    release_note: string;
    created_at: string;
  };
  config_snapshot: Record<string, unknown>;
  resource_manifest: Record<string, unknown>;
  required_capabilities: string[];
}

export function buildCurrentVersionConfigExport({
  agentId,
  agentName,
  version,
  note,
  exportedAt = new Date().toISOString(),
}: {
  agentId: number;
  agentName: string;
  version: AgentVersion;
  note?: string;
  exportedAt?: string;
}): CurrentVersionConfigExport {
  return {
    format: "agenthub-current-version-config",
    format_version: 1,
    exported_at: exportedAt,
    export_note: note?.trim() || null,
    agent: { id: agentId, name: agentName },
    version: {
      id: version.id,
      version_no: version.version_no,
      version_hash: version.version_hash,
      hash_schema_version: version.hash_schema_version,
      release_note: version.release_note,
      created_at: version.created_at,
    },
    config_snapshot: version.config_snapshot,
    resource_manifest: version.resource_manifest,
    required_capabilities: version.required_capabilities || [],
  };
}

export function downloadCurrentVersionConfig(
  payload: CurrentVersionConfigExport,
) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `agent-${payload.agent.id}-v${payload.version.version_no}-${payload.version.version_hash.slice(0, 12)}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
