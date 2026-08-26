import { ApiError } from "@/shared/api/http-client";
import type { WorldLiveEvent, WorldLiveEventCreateRequest, WorldLiveEventDraft, WorldLiveEventMaxEffect, WorldLiveEventStatus, WorldProjectionResident, WorldRuntimeFence, WorldStatus } from "./types";

export const LIVE_EVENT_STATUS_LABELS: Record<WorldLiveEventStatus, string> = {
  pending: "等待候选选择",
  selected: "已被本轮选中",
  committed: "已提交为世界事件",
  rejected: "候选已拒绝",
  expired: "候选已过期",
};

export const LIVE_EVENT_EFFECT_LABELS: Record<WorldLiveEventMaxEffect, string> = {
  ambient_only: "仅环境氛围",
  temporary_local: "临时局部影响",
  reversible_local: "可逆局部影响",
};

export const DEFAULT_LIVE_EVENT_DRAFT: WorldLiveEventDraft = {
  title: "",
  location_code: "",
  observable_start: "",
  participant_codes: [],
  max_effect: "ambient_only",
  ttl_seconds: 600,
};

const SECRET_TEXT_PATTERN = /qa_secret_canary|hidden[_ -]?truth|private[_ -]?memory|system[_ -]?prompt|api[_ -]?key|credential|隐藏真相|私有记忆|系统提示词|凭据|密钥/i;

export function liveEventEligibility(input: { worldStatus: WorldStatus; role: string; runtimeHealth?: string; fence?: WorldRuntimeFence }): { allowed: boolean; reason: string } {
  if (!["owner", "world_owner", "operator"].includes(input.role)) return { allowed: false, reason: "当前角色不是 World owner/operator，无权投放现场事件。" };
  if (input.worldStatus !== "running") {
    const label: Partial<Record<WorldStatus, string>> = { draft: "草稿世界尚未开演", published: "世界尚未建立运行实例", paused: "世界已暂停", blocked: "世界运行受阻", archived: "世界已归档", takedown: "世界已下架" };
    return { allowed: false, reason: `${label[input.worldStatus] || "世界当前不在运行中"}，不能投放现场事件。` };
  }
  if (!input.runtimeHealth) return { allowed: false, reason: "正在读取运行状态，确认前不会发送现场事件。" };
  if (!["running", "content_idle"].includes(input.runtimeHealth)) {
    const label: Record<string, string> = { paused: "世界已暂停", archived: "世界已归档", takedown: "世界已下架", blocked: "运行已阻断", model_unavailable: "运行模型暂不可用", projection_lag: "运行投影尚未追平" };
    return { allowed: false, reason: `${label[input.runtimeHealth] || `运行状态为 ${input.runtimeHealth}`}，当前不能投放。` };
  }
  if (!input.fence) return { allowed: false, reason: "当前会话没有服务端 runtime fence/revision。为避免猜测过期命令，投放已禁用；请在本会话完成 bootstrap，或等待后端提供只读恢复接口。" };
  return { allowed: true, reason: "可以投放；事件只进入候选链，不保证居民响应。" };
}

export function liveEventDraftErrors(draft: WorldLiveEventDraft, locationCodes: string[], residents: WorldProjectionResident[]): string[] {
  const errors: string[] = [];
  const title = draft.title.trim();
  const observable = draft.observable_start.trim();
  if (!title) errors.push("请填写标题。");
  else if ([...title].length > 120) errors.push("标题最多 120 个字符。");
  if (!locationCodes.includes(draft.location_code)) errors.push("请选择当前开演契约中的地点。");
  if (!observable) errors.push("请填写公开可观察的开端。");
  else if ([...observable].length > 1000) errors.push("可观察开端最多 1000 个字符。");
  if (SECRET_TEXT_PATTERN.test(`${title}\n${observable}`)) errors.push("标题或可观察开端包含秘密、私有记忆、系统提示词或凭据标记；现场事件只能提交公开可观察文本。");
  if (draft.participant_codes.length > 4 || new Set(draft.participant_codes).size !== draft.participant_codes.length) errors.push("参与者必须是 0–4 位不重复的当前活跃居民。");
  const activeCodes = new Set(residents.filter((resident) => resident.status === "active").map((resident) => resident.participant_code));
  if (draft.participant_codes.some((code) => !activeCodes.has(code))) errors.push("参与者已离开、不是当前世界居民或不再活跃，请重新选择。");
  if (!Object.hasOwn(LIVE_EVENT_EFFECT_LABELS, draft.max_effect)) errors.push("请选择允许的最大影响范围。");
  if (!Number.isInteger(draft.ttl_seconds) || draft.ttl_seconds < 60 || draft.ttl_seconds > 86400) errors.push("有效期必须是 60–86400 秒的整数。");
  return errors;
}

export function buildLiveEventRequest(draft: WorldLiveEventDraft, fence: WorldRuntimeFence, idempotencyKey: string): WorldLiveEventCreateRequest {
  return {
    run_epoch: fence.run_epoch,
    fencing_token: fence.fencing_token,
    expected_revision: fence.state_revision,
    title: draft.title.trim(),
    location_code: draft.location_code,
    observable_start: draft.observable_start.trim(),
    participant_codes: [...draft.participant_codes].sort(),
    max_effect: draft.max_effect,
    ttl_seconds: draft.ttl_seconds,
    idempotency_key: idempotencyKey,
  };
}

function sameCodes(left: string[], right: string[]): boolean {
  return [...left].sort().join("\u0000") === [...right].sort().join("\u0000");
}

export function findReconciledLiveEvent(items: WorldLiveEvent[], request: WorldLiveEventCreateRequest, submittedAt: number): WorldLiveEvent | undefined {
  const matches = items.filter((item) => item.run_epoch === request.run_epoch && item.fencing_token === request.fencing_token && item.expected_revision === request.expected_revision && item.title === request.title && item.location_code === request.location_code && item.observable_start === request.observable_start && item.max_effect === request.max_effect && item.ttl_seconds === request.ttl_seconds && sameCodes(item.participant_codes, request.participant_codes) && Date.parse(item.created_at) >= submittedAt - 5000);
  return matches.length === 1 ? matches[0] : undefined;
}

export function liveEventErrorMessage(error: unknown, draft?: WorldLiveEventDraft): { message: string; unknown: boolean } {
  if (!(error instanceof ApiError)) return { message: "提交结果未知。正在通过 GET 对账；对账完成前不会再次 POST。", unknown: true };
  if (error.status === 401) return { message: "登录状态已失效，现场事件未确认提交；重新登录后先 GET 对账。", unknown: false };
  if (error.status === 403 || error.status === 404) return { message: "世界不可用，或当前账号已失去 owner/operator 权限；下架资源也会按不可枚举规则返回不可用。", unknown: false };
  if (error.status === 400 || error.status === 413) {
    const secret = draft && liveEventDraftErrors(draft, [draft.location_code], []).some((message) => message.includes("秘密"));
    return { message: secret ? "公开文本包含秘密、私有记忆、系统提示词或凭据标记，请删除后再预览。" : "现场事件字段不符合固定契约；请检查标题、地点、公开开端、活跃居民、最大影响和 TTL。", unknown: false };
  }
  if (error.status === 409 && error.code === "WORLD_INVALID_STATE") return { message: "运行状态、当日预算或保护熔断器阻止了投放；也可能有地点或参与者已失效。请刷新运行真源后重新选择，不会自动重提。", unknown: false };
  if (error.status === 409) return { message: "runtime fence/revision 已过期，或同一幂等键绑定了不同内容。请刷新真源；不会自动重提。", unknown: false };
  if (error.status >= 500) return { message: "后端未能确认现场事件。表单与幂等键已保留，请先 GET 对账；不会显示为字段错误或自动重提。", unknown: true };
  return { message: "暂时无法确认现场事件结果，请先 GET 对账；不会自动重提。", unknown: true };
}
