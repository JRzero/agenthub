import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/shared/api/http-client";
import { worldApi } from "./api";
import { canNarrowPermissions, classifyWorldError, hasPermissionChanges, limitedChangeWorldCode, PREFLIGHT_LABELS, replaceInvitationDecisionDraft, WORLD_READINESS, worldMutationConfirmation, worldQueryKeys } from "./state";
import { createEmptyWorldContent, EMPTY_PERMISSIONS } from "./types";

const ctx = { apiKey: "et_test_world", workspaceCode: "studio" };
const ok = (data: unknown, status = 200) => new Response(JSON.stringify({ success: true, data }), { status });

describe("Living World C adapter", () => {
  beforeEach(() => { vi.restoreAllMocks(); window.localStorage.clear(); worldMutationConfirmation.resetForTests(); });

  it("scopes list reads and keeps public filters in the frozen route", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(ok({ items: [], next_cursor: "" }));
    await worldApi.list(ctx, "draft", "cursor+/=");
    expect(fetchMock).toHaveBeenCalledWith("http://localhost:8080/api/v1/worlds?status=draft&cursor=cursor%2B%2F%3D", expect.objectContaining({ headers: expect.objectContaining({ "X-API-Key": "et_test_world", "X-Workspace-Code": "studio" }) }));
  });

  it("sends complete create identity and idempotency payload", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(ok({ world_code: "monster", revision: 1 }, 201));
    const content = createEmptyWorldContent(); content.title = "妖怪公寓";
    await worldApi.create(ctx, { world_code: "monster", workspace_code: "studio", content, idempotency_key: "world-create-123456" });
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect(JSON.parse(String(init.body))).toMatchObject({ world_code: "monster", workspace_code: "studio", idempotency_key: "world-create-123456", content: { title: "妖怪公寓", opening: { timezone: "Asia/Shanghai" } } });
  });

  it("preserves expected revision for decision draft and idempotent decision", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => ok({ invitation: {} }));
    await worldApi.saveDecisionDraft(ctx, "inv-1", 7, "地下室管理员", EMPTY_PERMISSIONS);
    await worldApi.decide(ctx, "inv-1", "accepted", 8, "invitation-accept-123456");
    expect(fetchMock.mock.calls[0][0]).toContain("/world-invitations/inv-1/decision-draft");
    expect(JSON.parse(String((fetchMock.mock.calls[0][1] as RequestInit).body))).toMatchObject({ expected_revision: 7, public_identity: "地下室管理员" });
    expect(JSON.parse(String((fetchMock.mock.calls[1][1] as RequestInit).body))).toEqual({ decision: "accepted", expected_revision: 8, idempotency_key: "invitation-accept-123456" });
  });

  it("treats launch request as the C pending-bootstrap endpoint", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(ok({ request_code: "launch-1", status: "pending" }, 202));
    await worldApi.launch(ctx, "monster", { source: "manual", seed: 42, expected_revision: 9, idempotency_key: "world-launch-123456" });
    expect(fetchMock.mock.calls[0][0]).toBe("http://localhost:8080/api/v1/worlds/monster/launch-requests");
  });

  it("H-F02 sends the Creator-selected invitation permission subset", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(ok({ invitation_code: "inv-1" }, 201));
    await worldApi.invite(ctx, "monster", { agent_code: "ivan", version_no: 3, public_identity: "地下室管理员", permissions: { ...EMPTY_PERMISSIONS, ordinary_relationship: true, minor_injury: true } });
    expect(JSON.parse(String((fetchMock.mock.calls[0][1] as RequestInit).body))).toMatchObject({ agent_code: "ivan", version_no: 3, permissions: { ordinary_relationship: true, minor_injury: true, intimate_relationship: false } });
  });

  it("H-F03 sends the selected expected revision and retained schedule key", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(ok({ schedule_code: "schedule-1", revision: 1 }));
    await worldApi.saveSchedule(ctx, "monster", { expected_revision: 7, scheduled_start_at: "2026-08-02T12:00:00.000Z", seed: 42, timezone: "Asia/Shanghai", daily_window: { start: "09:00", end: "23:00" }, review_time: "08:00", idempotency_key: "world-schedule-retained" });
    expect(JSON.parse(String((fetchMock.mock.calls[0][1] as RequestInit).body))).toMatchObject({ expected_revision: 7, idempotency_key: "world-schedule-retained" });
  });

  it("H-F04 uses valid event-card payloads for full CRUD", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => ok({ event_code: "event-1", revision: 1 }));
    const card = { event_code: "event-1", title: "地下室停电", order_no: 1, enabled: true, trigger: [], location_code: "basement", observable_start: "灯光突然熄灭", participant_codes: ["ivan@3"], max_effect: "停电十分钟" };
    await worldApi.createEventCard(ctx, "monster", 7, card);
    await worldApi.updateEventCard(ctx, "monster", "event-1", 1, { ...card, title: "地下室短暂停电", revision: 9 } as typeof card);
    await worldApi.deleteEventCard(ctx, "monster", "event-1", 2);
    expect(JSON.parse(String((fetchMock.mock.calls[0][1] as RequestInit).body))).toMatchObject({ expected_revision: 7, card: { observable_start: "灯光突然熄灭", max_effect: "停电十分钟" } });
    expect(JSON.parse(String((fetchMock.mock.calls[1][1] as RequestInit).body)).card).not.toHaveProperty("revision");
    expect(fetchMock.mock.calls[1][0]).toContain("/event-cards/event-1");
    expect((fetchMock.mock.calls[2][1] as RequestInit).method).toBe("DELETE");
  });

  it("H-F07 exposes the exact participant recall command", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(ok({ participant_code: "participant-1", status: "recalled" }));
    await worldApi.recall(ctx, "participant-1");
    expect(fetchMock.mock.calls[0][0]).toBe("http://localhost:8080/api/v1/world-participants/participant-1/recall");
    expect((fetchMock.mock.calls[0][1] as RequestInit).body).toBe("{}");
  });

  it("D bootstraps the exact launch request and sends barrier CAS identity", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => ok({ instance_code: "wi-1", run_epoch: 2, fencing_token: 3, state_revision: 4 }, 201));
    await worldApi.bootstrap(ctx, "monster", "launch-1");
    await worldApi.barrier(ctx, "monster", "pause", { run_epoch: 2, fencing_token: 3, expected_revision: 4 });
    expect(fetchMock.mock.calls[0][0]).toContain("/worlds/monster/launch-requests/launch-1/bootstrap");
    expect(JSON.parse(String((fetchMock.mock.calls[1][1] as RequestInit).body))).toEqual({ action: "pause", run_epoch: 2, fencing_token: 3, expected_revision: 4 });
  });

  it("F reads actor projection, runtime contract and recap revisions", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => ok({ items: [] }));
    await worldApi.projection(ctx, "monster", "operator", "next+/=");
    await worldApi.runtimeContract(ctx, "monster");
    await worldApi.publicRecaps(ctx, "monster");
    expect(fetchMock.mock.calls.map((call) => call[0])).toEqual([
      "http://localhost:8080/api/v1/worlds/monster/projection?cursor=next%2B%2F%3D",
      "http://localhost:8080/api/v1/worlds/monster/runtime-contract",
      "http://localhost:8080/api/v1/public/worlds/monster/recaps",
    ]);
  });

  it("G4 preserves semantic kinds, empty residents and dated recap revision history", async () => {
    const responses = [
      { world_code: "monster", status: "running", revision: 9, runtime_health: "running", public_residents: [], timeline: [{ event_code: "evt-1", event_sequence: 1, event_type: "action", semantic_kind: "rumor", summary: "传闻", cause_summary: "公开原因", affected_participant_codes: [], created_at: "2026-08-01T00:00:00Z" }] },
      { items: [{ status: "ready", world_code: "monster", business_date: "2026-08-01", revision: 2, is_current: true, peaceful: false, key_decisions: [], relationship_changes: [], new_facts: [], suspense: [], source_event_codes: [] }, { status: "ready", world_code: "monster", business_date: "2026-08-01", revision: 1, is_current: false, peaceful: true, key_decisions: [], relationship_changes: [], new_facts: [], suspense: [], source_event_codes: [] }], latest_revision: 2 },
    ];
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => ok(responses.shift()));
    await expect(worldApi.projection(ctx, "monster", "operator")).resolves.toMatchObject({ audience: "operator", public_residents: [], timeline: [{ semantic_kind: "rumor" }] });
    await expect(worldApi.publicRecaps(ctx, "monster", "2026-08-01")).resolves.toMatchObject({ latest_revision: 2, items: [{ revision: 2, is_current: true }, { revision: 1, is_current: false }] });
    expect(fetchMock.mock.calls[1][0]).toBe("http://localhost:8080/api/v1/public/worlds/monster/recaps?business_date=2026-08-01");
  });

  it("normalizes nullable collection payloads before they reach workspaces", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async () => ok({ items: null, platform_disposition: "unavailable" }));
    await expect(worldApi.publicRecaps(ctx, "monster")).resolves.toMatchObject({ items: [] });
    await expect(worldApi.reviewSubmissions(ctx, "monster")).resolves.toMatchObject({ items: [], platform_disposition: "unavailable" });
    await expect(worldApi.ownerReports(ctx, "monster")).resolves.toMatchObject({ items: [], platform_disposition: "unavailable" });
  });

  it("deduplicates repeated server preflight categories for stable rendering", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(ok({ world: {}, participants: [], role: "owner", preflight: { ready: false, missing: ["initial_event_participant_invalid", "initial_event_participant_invalid", "structured_rules_required"] } }));
    await expect(worldApi.detail(ctx, "monster")).resolves.toMatchObject({ preflight: { missing: ["unknown_requirement"] } });
  });

  it("G visibility and review writes retain revision and idempotency", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => ok({ revision: 8 }));
    await worldApi.setVisibility(ctx, "monster", "unlisted", 7, "visibility-key-123");
    await worldApi.submitReview(ctx, "monster", "仅包含公开审核材料", 8, "review-key-123456");
    expect(JSON.parse(String((fetchMock.mock.calls[0][1] as RequestInit).body))).toEqual({ visibility: "unlisted", expected_revision: 7, idempotency_key: "visibility-key-123" });
    expect(JSON.parse(String((fetchMock.mock.calls[1][1] as RequestInit).body))).toEqual({ material_summary: "仅包含公开审核材料", expected_revision: 8, idempotency_key: "review-key-123456" });
  });

  it("G Agent Owner writes are binding scoped and narrow-only shaped", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => ok({ participant_code: "wp-1", revision: 8 }));
    await worldApi.narrowAgentOwnerPermissions(ctx, "wp-1", { ...EMPTY_PERMISSIONS, ordinary_relationship: true }, 7, "permission-key-123");
    await worldApi.recallAgentOwner(ctx, "wp-1", 8, "recall-key-123456");
    expect(fetchMock.mock.calls[0][0]).toContain("/world-agent-owner/participants/wp-1/permissions");
    expect(JSON.parse(String((fetchMock.mock.calls[1][1] as RequestInit).body))).toEqual({ expected_revision: 8, idempotency_key: "recall-key-123456" });
  });

  it("Agent Owner limited decisions preserve D CAS and finite candidate identity", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(ok({ decision_code: "decision-1" }));
    await worldApi.decideLimitedChange(ctx, "monster", "change-1", { decision: "choice", candidate_code: "candidate-2", run_epoch: 2, fencing_token: 3, expected_revision: 4, idempotency_key: "limited-key-1234" });
    expect(fetchMock.mock.calls[0][0]).toContain("/worlds/monster/runtime/limited-changes/change-1/decisions");
    expect(JSON.parse(String((fetchMock.mock.calls[0][1] as RequestInit).body))).toMatchObject({ decision: "choice", candidate_code: "candidate-2", run_epoch: 2, fencing_token: 3, expected_revision: 4 });
  });
});

describe("Living World state contract", () => {
  it("isolates Workspace and World identity in query keys", () => {
    expect(worldQueryKeys.detail("studio-a", "monster", 3)).toEqual(["living-worlds", "studio-a", "detail", "monster", 3]);
    expect(worldQueryKeys.detail("studio-b", "monster", 3)).not.toEqual(worldQueryKeys.detail("studio-a", "monster", 3));
  });

  it("allows permissions to narrow but never broaden", () => {
    const proposed = { ...EMPTY_PERMISSIONS, ordinary_relationship: true };
    expect(canNarrowPermissions(proposed, EMPTY_PERMISSIONS)).toBe(true);
    expect(canNarrowPermissions(proposed, { ...EMPTY_PERMISSIONS, intimate_relationship: true })).toBe(false);
    expect(hasPermissionChanges(proposed, proposed)).toBe(false);
    expect(hasPermissionChanges(proposed, EMPTY_PERMISSIONS)).toBe(true);
  });

  it("keeps a saved Agent Owner decision draft in query truth", () => {
    const invitation = { invitation_code: "inv-1", world_version_no: 1, agent_code: "resident-1", version_no: 1, version_hash: "hash-1", status: "pending" as const, public_identity: "旧身份", permissions: { ...EMPTY_PERMISSIONS, ordinary_relationship: true }, revision: 1, created_at: "2026-08-01T00:00:00Z" };
    const current = { world_code: "monster", world_title: "妖怪公寓", world_summary: "合成测试世界", world_owner: { username: "et_creator" }, invitation };
    const saved = { ...invitation, public_identity: "外部一号协调者", permissions: EMPTY_PERMISSIONS, revision: 2 };
    expect(replaceInvitationDecisionDraft(current, saved)).toEqual({ ...current, invitation: saved });
    expect(replaceInvitationDecisionDraft(undefined, saved)).toBeUndefined();
  });

  it("derives a limited-change decision route only from a matching server binding", () => {
    const change = { change_code: "change-1", instance_code: "wi-1", subject_participant_code: "wp-1", kind: "temporary_location_state", status: "pending" as const, run_epoch: 2, fencing_token: 3, state_revision: 4, candidates: [] };
    const binding = { world_code: "monster", participant_code: "wp-1", public_identity: "地下室管理员", status: "active" as const, permissions: EMPTY_PERMISSIONS, revision: 7 };
    expect(limitedChangeWorldCode(change, binding)).toBe("monster");
    expect(limitedChangeWorldCode(change, { ...binding, participant_code: "foreign" })).toBeUndefined();
  });

  it("marks the approved Creator D-G surface live without advertising moderation", () => {
    expect(WORLD_READINESS.preparation.state).toBe("live");
    expect(WORLD_READINESS.projection).toEqual({ state: "live", blockers: [] });
    expect(WORLD_READINESS.actions).toEqual({ state: "live", blockers: [] });
    expect(WORLD_READINESS.governance).toEqual({ state: "live", blockers: [] });
  });

  it("maps stable conflict, preflight, permission and offline recovery", () => {
    expect(classifyWorldError(new ApiError("invalid", 400, "WORLD_INVALID_REQUEST")).kind).toBe("validation");
    expect(classifyWorldError(new ApiError("auth", 401, "UNAUTHORIZED")).kind).toBe("auth");
    expect(classifyWorldError(new ApiError("denied", 403, "WORLD_NOT_FOUND")).kind).toBe("not-found");
    expect(classifyWorldError(new ApiError("conflict", 409, "WORLD_CONFLICT")).kind).toBe("conflict");
    expect(classifyWorldError(new ApiError("missing", 422, "WORLD_PREFLIGHT_FAILED", { missing: ["title_required"] }))).toMatchObject({ kind: "preflight", missing: ["填写世界名称"] });
    expect(classifyWorldError(new ApiError("hidden", 404, "WORLD_NOT_FOUND")).kind).toBe("not-found");
    expect(classifyWorldError(new ApiError("expired", 410, "WORLD_INTERVENTION_EXPIRED")).kind).toBe("expired");
    expect(classifyWorldError(new ApiError("large", 413, "WORLD_REQUEST_TOO_LARGE")).kind).toBe("validation");
    expect(classifyWorldError(new ApiError("quota", 429, "WORLD_INTERVENTION_QUOTA")).kind).toBe("rate-limit");
    expect(classifyWorldError(new ApiError("quota", 429, "WORLD_INTERVENTION_QUOTA", { retry_after: "7" })).message).toContain("7 秒后");
    expect(classifyWorldError(new ApiError("server", 503, "WORLD_INTERNAL_ERROR")).kind).toBe("server");
    expect(classifyWorldError(new TypeError("Failed to fetch")).kind).toBe("offline");
    expect(PREFLIGHT_LABELS.initial_event_required.section).toBe("event");
  });
});
