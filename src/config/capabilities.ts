export type CapabilitySource = "live" | "derived" | "demo" | "unavailable";

export type CapabilityId =
  | "auth"
  | "workspaces"
  | "agentAssets"
  | "assetCompleteness"
  | "clientAdapters"
  | "versionHistory"
  | "packageExport"
  | "governance"
  | "analytics"
  | "revenue";

export const DATA_MODE =
  process.env.NEXT_PUBLIC_AGENTHUB_DATA_MODE === "demo" ? "demo" : "live";

const liveCapabilities: Record<CapabilityId, CapabilitySource> = {
  auth: "live",
  workspaces: "live",
  agentAssets: "live",
  assetCompleteness: "derived",
  clientAdapters: "unavailable",
  versionHistory: "unavailable",
  packageExport: "unavailable",
  governance: "unavailable",
  analytics: "unavailable",
  revenue: "unavailable",
};

const demoCapabilities: Record<CapabilityId, CapabilitySource> = {
  ...liveCapabilities,
  clientAdapters: "demo",
  versionHistory: "demo",
  governance: "demo",
  analytics: "demo",
  revenue: "demo",
};

export const CAPABILITIES =
  DATA_MODE === "demo" ? demoCapabilities : liveCapabilities;

export function capabilitySource(id: CapabilityId): CapabilitySource {
  return CAPABILITIES[id];
}

export function isDemoCapability(id: CapabilityId): boolean {
  return capabilitySource(id) === "demo";
}
