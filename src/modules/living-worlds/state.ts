import { ApiError } from "@/shared/api/http-client";
import { UNKNOWN_PREFLIGHT_REASON } from "./decoders";
import type { InvitationDetail, WorldAgentOwnerBinding, WorldInvitation, WorldLimitedChange, WorldPermissions } from "./types";

export type BackendSlice = "preparation" | "bootstrap" | "actions" | "projection" | "governance";
export const WORLD_READINESS: Record<BackendSlice, { state: "live" | "candidate_contract" | "pending_backend"; blockers: string[] }> = {
  preparation: { state: "live", blockers: [] },
  bootstrap: { state: "live", blockers: [] },
  actions: { state: "live", blockers: [] },
  projection: { state: "live", blockers: [] },
  governance: { state: "live", blockers: [] },
};

export const worldQueryKeys = {
  all: (workspaceCode: string) => ["living-worlds", workspaceCode] as const,
  list: (workspaceCode: string, status = "") => ["living-worlds", workspaceCode, "list", status] as const,
  detail: (workspaceCode: string, worldCode: string, revision?: number) => ["living-worlds", workspaceCode, "detail", worldCode, revision ?? "current"] as const,
  templates: (workspaceCode: string) => ["living-worlds", workspaceCode, "templates"] as const,
  invitation: (workspaceCode: string, invitationCode: string) => ["living-worlds", workspaceCode, "invitation", invitationCode] as const,
  eventCards: (workspaceCode: string, worldCode: string) => ["living-worlds", workspaceCode, "event-cards", worldCode] as const,
  projection: (workspaceCode: string, worldCode: string, role?: string) => role ? ["living-worlds", workspaceCode, "projection", worldCode, role] as const : ["living-worlds", workspaceCode, "projection", worldCode] as const,
  runtimeContract: (workspaceCode: string, worldCode: string) => ["living-worlds", workspaceCode, "runtime-contract", worldCode] as const,
  recaps: (workspaceCode: string, worldCode: string) => ["living-worlds", workspaceCode, "recaps", worldCode] as const,
  reviews: (workspaceCode: string, worldCode: string) => ["living-worlds", workspaceCode, "reviews", worldCode] as const,
  reports: (workspaceCode: string, worldCode: string) => ["living-worlds", workspaceCode, "reports", worldCode] as const,
  governance: (workspaceCode: string, worldCode: string) => ["living-worlds", workspaceCode, "owner-governance", worldCode] as const,
  agentOwnerBinding: (workspaceCode: string, participantCode: string) => ["living-worlds", workspaceCode, "agent-owner-binding", participantCode] as const,
  limitedChange: (workspaceCode: string, changeCode: string) => ["living-worlds", workspaceCode, "limited-change", changeCode] as const,
  runtimeFence: (workspaceCode: string, worldCode: string) => ["living-worlds", workspaceCode, "runtime-fence", worldCode] as const,
};

export class UnknownWorldMutationLockedError extends Error {
  constructor(public readonly resourceKey: string) {
    super("该资源上一项操作的结果仍待真源确认，已阻止重复提交。");
    this.name = "UnknownWorldMutationLockedError";
  }
}

export class ConfirmedWorldMutationResult extends Error {
  constructor(public readonly applied: boolean) {
    super(applied ? "真源已确认：上一项操作已经生效，不会重复提交。" : "真源已确认：上一项操作未生效，现在可以重新提交。");
    this.name = "ConfirmedWorldMutationResult";
  }
}

const unknownMutationLocks = new Set<string>();
const UNKNOWN_MUTATION_STORAGE_KEY = "linkyun_living_world_unknown_mutations";
let unknownMutationStorageInvalid = false;
function syncUnknownMutationLocks() {
  if (typeof window === "undefined") return;
  try {
    const stored = JSON.parse(window.localStorage.getItem(UNKNOWN_MUTATION_STORAGE_KEY) || "[]") as unknown;
    if (!Array.isArray(stored)) throw new TypeError("invalid persisted mutation locks");
    unknownMutationLocks.clear();
    stored.filter((item): item is string => typeof item === "string").forEach((item) => unknownMutationLocks.add(item));
  } catch { unknownMutationStorageInvalid = true; }
}
function persistUnknownMutationLocks() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(UNKNOWN_MUTATION_STORAGE_KEY, JSON.stringify([...unknownMutationLocks]));
    unknownMutationStorageInvalid = false;
  } catch { unknownMutationStorageInvalid = true; }
}
export const worldMutationKeys = {
  invite: (workspaceCode: string, worldCode: string) => `invite:${workspaceCode}:${worldCode}`,
  eventCardCreate: (workspaceCode: string, worldCode: string) => `event-card-create:${workspaceCode}:${worldCode}`,
  recall: (workspaceCode: string, participantCode: string) => `recall:${workspaceCode}:${participantCode}`,
  publish: (workspaceCode: string, worldCode: string) => `publish:${workspaceCode}:${worldCode}`,
  barrier: (workspaceCode: string, worldCode: string) => `barrier:${workspaceCode}:${worldCode}`,
};

export async function guardWorldMutation<T>(resourceKey: string, mutation: () => Promise<T>): Promise<T> {
  syncUnknownMutationLocks();
  if (unknownMutationStorageInvalid || unknownMutationLocks.has(resourceKey)) throw new UnknownWorldMutationLockedError(resourceKey);
  try {
    return await mutation();
  } catch (error) {
    if (isUnknownWorldMutationOutcome(error)) { unknownMutationLocks.add(resourceKey); persistUnknownMutationLocks(); }
    throw error;
  }
}

export const worldMutationConfirmation = {
  isLocked: (resourceKey: string) => { syncUnknownMutationLocks(); return unknownMutationStorageInvalid || unknownMutationLocks.has(resourceKey); },
  resolve: (resourceKey: string) => { syncUnknownMutationLocks(); const deleted = unknownMutationLocks.delete(resourceKey); persistUnknownMutationLocks(); return deleted; },
  resetForTests: () => { unknownMutationLocks.clear(); unknownMutationStorageInvalid = false; if (typeof window !== "undefined") window.localStorage.removeItem(UNKNOWN_MUTATION_STORAGE_KEY); },
};

export function isUnknownWorldMutationOutcome(error: unknown): boolean {
  return !(error instanceof ApiError) || error.status === 408 || error.status >= 500;
}

export function newIdempotencyKey(prefix: string): string {
  const value = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}-${value}`;
}

export function createOperationKey(prefix: string, generate = newIdempotencyKey) {
  let value = "";
  return {
    current: () => value || (value = generate(prefix)),
    reset: () => { value = ""; },
  };
}

export function resourceLoadState(input: { isError: boolean; isLoading: boolean; hasData: boolean }): "error" | "loading" | "ready" {
  if (input.isError) return "error";
  if (input.isLoading || !input.hasData) return "loading";
  return "ready";
}

export function canNarrowPermissions(proposed: WorldPermissions, next: WorldPermissions): boolean {
  return (Object.keys(proposed) as (keyof WorldPermissions)[]).every((key) => proposed[key] || !next[key]);
}

export function hasPermissionChanges(current: WorldPermissions, next: WorldPermissions): boolean {
  return (Object.keys(current) as (keyof WorldPermissions)[]).some((key) => current[key] !== next[key]);
}

export function replaceInvitationDecisionDraft(current: InvitationDetail | undefined, invitation: WorldInvitation): InvitationDetail | undefined {
  return current ? { ...current, invitation } : current;
}

export interface InvitationDecisionDraftState { publicIdentity: string; permissions: WorldPermissions; revision: number }
export function reconcileInvitationDecisionDraft(draft: InvitationDecisionDraftState, latest: WorldInvitation): InvitationDecisionDraftState {
  return { ...draft, revision: latest.revision };
}

export function limitedChangeWorldCode(change: WorldLimitedChange | undefined, binding: WorldAgentOwnerBinding | undefined): string | undefined {
  if (!change || !binding || change.subject_participant_code !== binding.participant_code) return undefined;
  return binding.world_code;
}

export type WorldErrorKind = "auth" | "not-found" | "validation" | "conflict" | "expired" | "preflight" | "rate-limit" | "server" | "offline" | "unknown";
export function classifyWorldError(error: unknown): { kind: WorldErrorKind; message: string; missing: string[] } {
  if (error instanceof ConfirmedWorldMutationResult) return { kind: "unknown", message: error.message, missing: [] };
  if (!(error instanceof ApiError)) return { kind: "offline", message: "连接中断，结果可能仍在处理中。请先刷新确认，暂时不要重复提交。", missing: [] };
  const missing = Array.isArray(error.details?.missing)
    ? [...new Set(error.details.missing.filter((item): item is string => typeof item === "string").map((item) => preflightReasonPresentation(item).label))]
    : [];
  if (error.status === 401) return { kind: "auth", message: "登录状态已失效。重新登录后会回到当前页面。", missing };
  if (error.status === 403 || error.status === 404) return { kind: "not-found", message: "这个内容不存在，或你没有查看权限。", missing };
  if (error.status === 400 || error.status === 413) return { kind: "validation", message: "提交内容不符合要求。请检查标出的字段后重试。", missing };
  if (error.status === 409) return { kind: "conflict", message: "内容已在别处更新。先查看最新版本，再重新应用你的修改。", missing };
  if (error.status === 410) return { kind: "expired", message: "这项候选或干预已经过期。请刷新当前状态，不要重复提交。", missing };
  if (error.status === 422) return { kind: "preflight", message: "开演检查仍有未完成项目。", missing };
  if (error.status === 429) {
    const rawRetryAfter = typeof error.details?.retry_after === "string" ? error.details.retry_after : typeof error.details?.retry_after === "number" ? String(error.details.retry_after) : "";
    const retryAfter = /^\d+$/.test(rawRetryAfter) ? `${rawRetryAfter} 秒后` : rawRetryAfter;
    return { kind: "rate-limit", message: `操作过于频繁，当前内容已保留。请${retryAfter ? `在 ${retryAfter}` : "稍后"}手动重试。`, missing };
  }
  if (error.status >= 500) return { kind: "server", message: "服务暂时不可用，当前内容已保留。", missing };
  return { kind: "unknown", message: "暂时无法确认结果。请刷新真源后再决定是否重试。", missing };
}

export const PREFLIGHT_LABELS: Record<string, { label: string; section: string }> = {
  world_not_published: { label: "世界还没有发布", section: "publish" }, published_version_missing: { label: "已发布版本暂时不可用", section: "publish" }, published_content_invalid: { label: "已发布内容无法读取", section: "publish" }, title_required: { label: "填写世界名称", section: "core" }, summary_required: { label: "填写一句话世界设定", section: "core" }, hard_rule_required: { label: "至少填写 1 条硬规则", section: "rules" }, soft_rule_required: { label: "至少填写 1 条软规则", section: "rules" }, content_boundaries_required: { label: "确认内容边界", section: "rules" }, locations_must_be_3_to_5: { label: "地点需要保持在 3–5 个", section: "locations" }, location_codes_must_be_unique: { label: "地点标识重复或格式不正确", section: "locations" }, initial_event_required: { label: "设置 1 个初始事件", section: "event" }, initial_event_location_invalid: { label: "初始事件地点已失效", section: "event" }, participants_must_be_3_to_4: { label: "需要 3–4 位已接受邀请的角色", section: "characters" }, external_owner_must_be_at_most_one: { label: "P0 最多只能有 1 位外部角色主理人", section: "characters" }, initial_event_requires_two_participants: { label: "初始事件至少需要 2 位角色做决定", section: "event" }, initial_event_participant_not_accepted: { label: "初始事件中的角色尚未接受邀请", section: "event" },
  [UNKNOWN_PREFLIGHT_REASON]: { label: "还有一项服务检查未通过", section: "publish" },
};

export function preflightReasonPresentation(reason: string): { label: string; section: string } {
  return PREFLIGHT_LABELS[reason] ?? PREFLIGHT_LABELS[UNKNOWN_PREFLIGHT_REASON];
}
