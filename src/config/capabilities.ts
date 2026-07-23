export type CapabilitySource = "live" | "derived" | "demo" | "unavailable";

export type CapabilityId =
  | "auth"
  | "workspaces"
  | "agentAssets"
  | "guidedAgentCreation"
  | "assetCompleteness"
  | "clientAdapters"
  | "versionHistory"
  | "packageExport"
  | "avatarUpload"
  | "motherlandAvatarGeneration"
  | "characterDesign"
  | "mediaAssetLibrary"
  | "comicDrafts"
  | "governance"
  | "analytics"
  | "revenue";

export const DATA_MODE =
  process.env.NEXT_PUBLIC_AGENTHUB_DATA_MODE === "demo" ? "demo" : "live";

export const PACKAGE_EXPORT_DOWNLOAD_ENABLED =
  process.env.NEXT_PUBLIC_AGENT_EXPORT_ZIP_DOWNLOAD_ENABLED !== "false";

const liveCapabilities: Record<CapabilityId, CapabilitySource> = {
  auth: "live",
  workspaces: "live",
  agentAssets: "live",
  guidedAgentCreation: "live",
  assetCompleteness: "derived",
  clientAdapters: "live",
  versionHistory: "live",
  packageExport: PACKAGE_EXPORT_DOWNLOAD_ENABLED ? "live" : "unavailable",
  avatarUpload: "live",
  motherlandAvatarGeneration: "live",
  characterDesign: "live",
  mediaAssetLibrary: "unavailable",
  comicDrafts: "unavailable",
  governance: "unavailable",
  analytics: "unavailable",
  revenue: "unavailable",
};

const demoCapabilities: Record<CapabilityId, CapabilitySource> = {
  ...liveCapabilities,
  guidedAgentCreation: "demo",
  clientAdapters: "demo",
  versionHistory: "demo",
  avatarUpload: "demo",
  motherlandAvatarGeneration: "demo",
  characterDesign: "demo",
  mediaAssetLibrary: "demo",
  comicDrafts: "demo",
  governance: "demo",
  analytics: "demo",
  revenue: "demo",
};

export const CAPABILITIES =
  DATA_MODE === "demo" ? demoCapabilities : liveCapabilities;

export function capabilitySource(
  id: CapabilityId,
  mode: "live" | "demo" = DATA_MODE,
): CapabilitySource {
  return (mode === "demo" ? demoCapabilities : liveCapabilities)[id];
}

export function isDemoCapability(id: CapabilityId): boolean {
  return capabilitySource(id) === "demo";
}
