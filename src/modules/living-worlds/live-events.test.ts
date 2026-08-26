import { describe, expect, it } from "vitest";
import { ApiError } from "@/shared/api/http-client";
import { buildLiveEventRequest, DEFAULT_LIVE_EVENT_DRAFT, findReconciledLiveEvent, LIVE_EVENT_STATUS_LABELS, liveEventDraftErrors, liveEventEligibility, liveEventErrorMessage } from "./live-events";
import type { WorldLiveEvent, WorldLiveEventDraft, WorldProjectionResident, WorldRuntimeFence } from "./types";

const fence: WorldRuntimeFence = { instance_code: "wi-1", run_epoch: 2, fencing_token: 3, state_revision: 4 };
const residents: WorldProjectionResident[] = [
  { participant_code: "resident-a", agent_code: "agent-a", public_identity: "阿甲", status: "active" },
  { participant_code: "resident-b", agent_code: "agent-b", public_identity: "阿乙", status: "active" },
];
const draft: WorldLiveEventDraft = { ...DEFAULT_LIVE_EVENT_DRAFT, title: "大厅停电", location_code: "lobby", observable_start: "大厅灯光突然熄灭。", participant_codes: ["resident-b", "resident-a"], max_effect: "temporary_local", ttl_seconds: 600 };

function event(overrides: Partial<WorldLiveEvent> = {}): WorldLiveEvent {
  return { event_code: "wlive_00000000-0000-0000-0000-000000000001", candidate_code: "wecand_00000000-0000-0000-0000-000000000001", world_code: "monster", instance_code: "wi-1", run_epoch: 2, fencing_token: 3, expected_revision: 4, title: "大厅停电", location_code: "lobby", participant_codes: ["resident-a", "resident-b"], observable_start: "大厅灯光突然熄灭。", max_effect: "temporary_local", occurrence: "once", status: "pending", revision: 1, ttl_seconds: 600, expires_at: "2026-08-26T10:10:00.000Z", created_at: "2026-08-26T10:00:01.000Z", ...overrides };
}

describe("Creator live-event state contract", () => {
  it("allows only owner/operator running or content-idle sessions with an exact fence", () => {
    expect(liveEventEligibility({ worldStatus: "running", role: "owner", runtimeHealth: "running", fence }).allowed).toBe(true);
    expect(liveEventEligibility({ worldStatus: "running", role: "operator", runtimeHealth: "content_idle", fence }).allowed).toBe(true);
    expect(liveEventEligibility({ worldStatus: "running", role: "viewer", runtimeHealth: "running", fence }).reason).toContain("无权");
    expect(liveEventEligibility({ worldStatus: "paused", role: "owner", runtimeHealth: "paused", fence }).reason).toContain("暂停");
    expect(liveEventEligibility({ worldStatus: "running", role: "owner", runtimeHealth: "running" }).reason).toContain("投放已禁用");
  });

  it("validates secret text, selectors, bounded participants and TTL without code input", () => {
    expect(liveEventDraftErrors(draft, ["lobby"], residents)).toEqual([]);
    expect(liveEventDraftErrors({ ...draft, observable_start: "QA_SECRET_CANARY hidden_truth" }, ["lobby"], residents).join(" ")).toContain("秘密");
    expect(liveEventDraftErrors({ ...draft, participant_codes: ["foreign"] }, ["lobby"], residents).join(" ")).toContain("不再活跃");
    expect(liveEventDraftErrors({ ...draft, ttl_seconds: 59 }, ["lobby"], residents).join(" ")).toContain("60–86400");
  });

  it("builds the exact sorted fence-bound request and stable idempotency field", () => {
    expect(buildLiveEventRequest(draft, fence, "world-live-event-fixed-key")).toEqual({ run_epoch: 2, fencing_token: 3, expected_revision: 4, title: "大厅停电", location_code: "lobby", observable_start: "大厅灯光突然熄灭。", participant_codes: ["resident-a", "resident-b"], max_effect: "temporary_local", ttl_seconds: 600, idempotency_key: "world-live-event-fixed-key" });
  });

  it("reconciles an unknown result only when one exact recent GET match exists", () => {
    const request = buildLiveEventRequest(draft, fence, "world-live-event-fixed-key");
    const submittedAt = Date.parse("2026-08-26T10:00:00.000Z");
    expect(findReconciledLiveEvent([event()], request, submittedAt)?.event_code).toContain("wlive_");
    expect(findReconciledLiveEvent([event(), event({ event_code: "wlive_00000000-0000-0000-0000-000000000002" })], request, submittedAt)).toBeUndefined();
    expect(findReconciledLiveEvent([event({ created_at: "2026-08-26T09:00:00.000Z" })], request, submittedAt)).toBeUndefined();
  });

  it("maps every candidate status and precise backend recovery category", () => {
    expect(Object.keys(LIVE_EVENT_STATUS_LABELS)).toEqual(["pending", "selected", "committed", "rejected", "expired"]);
    expect(liveEventErrorMessage(new ApiError("conflict", 409, "WORLD_CONFLICT")).message).toContain("fence/revision");
    expect(liveEventErrorMessage(new ApiError("state", 409, "WORLD_INVALID_STATE")).message).toContain("预算");
    expect(liveEventErrorMessage(new ApiError("missing", 404, "WORLD_NOT_FOUND")).message).toContain("owner/operator");
    expect(liveEventErrorMessage(new TypeError("Failed to fetch")).unknown).toBe(true);
  });
});
