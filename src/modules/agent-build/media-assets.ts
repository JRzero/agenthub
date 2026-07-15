import { capabilitySource, type CapabilitySource } from "@/config/capabilities";
import type { Agent } from "@/modules/agents/types";
import { getApiBaseUrl } from "@/shared/api/http-client";

export type MediaAssetKind = "avatar" | "character-sheet" | "comic-draft";
export type MediaAssetStatus = "saved" | "generating" | "pending-confirmation" | "failed" | "unavailable";
export type MediaGenerationState = "idle" | "generating" | "pending-confirmation" | "confirming" | "saved" | "failed";
export type MediaGenerationEvent = "start" | "generated" | "confirm" | "confirmed" | "failed" | "reset";

export function reduceMediaGenerationState(
  state: MediaGenerationState,
  event: MediaGenerationEvent,
): MediaGenerationState {
  if (event === "reset") return "idle";
  if (event === "start") return "generating";
  if (event === "generated" && state === "generating") return "pending-confirmation";
  if (event === "confirm" && (state === "pending-confirmation" || state === "failed")) return "confirming";
  if (event === "confirmed" && state === "confirming") return "saved";
  if (event === "failed") return "failed";
  return state;
}

export type MediaCapabilitySource = Extract<CapabilitySource, "live" | "demo" | "unavailable">;

export interface MediaAsset {
  id: string;
  kind: MediaAssetKind;
  name: string;
  url: string;
  status: MediaAssetStatus;
  specText?: string;
  version?: string;
  createdAt?: string;
  demoOnly?: boolean;
}

export interface MediaCandidate {
  kind: MediaAssetKind;
  url: string;
  prompt: string;
  specText?: string;
  state: MediaGenerationState;
  demoOnly?: boolean;
}

export interface AgentMediaAssets {
  avatar: MediaAsset | null;
  characterSheets: MediaAsset[];
  comicDrafts: MediaAsset[];
}

export interface MediaCapabilityMap {
  avatarUpload: MediaCapabilitySource;
  avatarGeneration: MediaCapabilitySource;
  characterDesign: MediaCapabilitySource;
  assetLibrary: MediaCapabilitySource;
  comicDrafts: MediaCapabilitySource;
}

export function resolveMediaCapabilityMap(mode: "live" | "demo"): MediaCapabilityMap {
  return {
    avatarUpload: capabilitySource("avatarUpload", mode) as MediaCapabilitySource,
    avatarGeneration: capabilitySource("motherlandAvatarGeneration", mode) as MediaCapabilitySource,
    characterDesign: capabilitySource("characterDesign", mode) as MediaCapabilitySource,
    assetLibrary: capabilitySource("mediaAssetLibrary", mode) as MediaCapabilitySource,
    comicDrafts: capabilitySource("comicDrafts", mode) as MediaCapabilitySource,
  };
}

export function resolveCharacterSheetUrl(value?: string): string {
  if (!value) return "";
  if (/^(data:|https?:|\/)/.test(value)) return value;
  return `${getApiBaseUrl()}/api/v1/character-sheets/${encodeURIComponent(value)}`;
}

export function resolveGeneratedMediaUrl(value: string | undefined, kind: MediaAssetKind): string {
  if (!value) return "";
  if (/^(data:|blob:|https?:)/.test(value)) return value;
  if (value.startsWith("/images/")) return value;
  if (value.startsWith("/")) return `${getApiBaseUrl()}${value}`;
  if (kind === "avatar") return `${getApiBaseUrl()}/api/v1/avatars/${encodeURIComponent(value)}`;
  if (kind === "character-sheet") return `${getApiBaseUrl()}/api/v1/character-sheets/${encodeURIComponent(value)}`;
  return `${getApiBaseUrl()}/api/v1/files/${encodeURIComponent(value)}`;
}
export function mapAgentMediaAssets(agent: Agent): AgentMediaAssets {
  const avatar = agent.config?.metadata?.avatar;
  const sheet = agent.config?.metadata?.character_design_sheet;
  const sheetSpec = agent.config?.metadata?.character_design_spec?.trim();
  return {
    avatar: avatar
      ? {
          id: `avatar-current-${agent.id}`,
          kind: "avatar",
          name: `${agent.name} 当前头像`,
          url: avatar,
          status: "saved",
          version: `v${agent.version}`,
          createdAt: agent.updated_at,
        }
      : null,
    characterSheets: sheet
      ? [{
          id: `character-sheet-current-${agent.id}`,
          kind: "character-sheet",
          name: `${agent.name} 角色设定稿`,
          url: resolveCharacterSheetUrl(sheet),
          status: "saved",
          specText: sheetSpec || undefined,
          version: `v${agent.version}`,
          createdAt: agent.updated_at,
        }]
      : [],
    comicDrafts: [],
  };
}

export function latestRuntimeExchange<T extends { role: string }>(messages: T[]): T[] {
  const conversational = messages.filter((message) => message.role === "user" || message.role === "assistant");
  const lastUser = conversational.map((message) => message.role).lastIndexOf("user");
  return lastUser < 0 ? [] : conversational.slice(lastUser, lastUser + 2);
}
