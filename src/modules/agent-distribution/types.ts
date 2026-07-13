export interface ShareLink {
  uuid: string;
  share_token: string;
  agent_id: number;
  agent_name?: string;
  enabled: boolean;
  expires_at?: string;
  share_url?: string;
  created_at: string;
}

export type DistributionChannelId =
  | "oyiioyii"
  | "web-chat"
  | "brand-private"
  | "api-runtime";

export type DistributionStatus = "running" | "unpublished" | "paused";
export type CompatibilityStatus = "compatible" | "upgrade" | "configure";

export interface DistributionChannel {
  id: DistributionChannelId;
  name: string;
  version: string;
  versionHint: string;
  compatibility: CompatibilityStatus;
  compatibilityLabel: string;
  compatibilityHint: string;
  status: DistributionStatus;
  statusLabel: string;
  publishedAt?: string;
  publishedBy?: string;
  actionLabel?: string;
  shareUrl?: string;
}

export interface PublicAgentCard {
  schema_version: "agenthub.public-card.v1";
  agent: {
    id: number;
    code: string;
    name: string;
    description: string;
    version: string;
    avatar?: string;
  };
  distribution: {
    share_url?: string;
    generated_at: string;
  };
}

export type DistributionDialogKind =
  | "agent-card"
  | "export"
  | "license"
  | "export-policy"
  | "memory"
  | "safety"
  | "audit"
  | "unsupported"
  | null;
