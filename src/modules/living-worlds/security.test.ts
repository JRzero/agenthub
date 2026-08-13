import { QueryClient } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/shared/api/http-client";
import { loadWorldOwnerResources, worldApi } from "./api";
import { serializeWorldContentForClipboard, UNKNOWN_PREFLIGHT_REASON } from "./decoders";
import { classifyWorldError, preflightReasonPresentation, UnknownWorldMutationLockedError, worldMutationConfirmation, worldQueryKeys } from "./state";
import { createEmptyWorldContent, EMPTY_PERMISSIONS } from "./types";

const ctx = { apiKey: "et_test_security", workspaceCode: "studio" };
const ok = (data: unknown) => new Response(JSON.stringify({ success: true, data }), { status: 200 });

describe("Living World security boundaries", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
    worldMutationConfirmation.resetForTests();
  });

  it("strips top-level and nested response canaries from cache, DOM text, clipboard and later save payloads", async () => {
    const rawContent = createEmptyWorldContent() as unknown as Record<string, unknown>;
    rawContent.secret_canary = "TOP_SECRET_CANARY";
    rawContent.core_idea = { ...(rawContent.core_idea as object), private_canary: "NESTED_SECRET_CANARY" };
    rawContent.locations = [{
      code: "hall", name: "大厅", description: "", entry_rule: "", entry_conditions: [], common_events: [], connects_to: [], private_memory: "NESTED_SECRET_CANARY",
    }];
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async (_url, init) => {
      if (init?.method === "PUT") return ok({ world_code: "monster", status: "draft", revision: 2, content: rawContent, secret_canary: "TOP_SECRET_CANARY" });
      return ok({
        world: { world_code: "monster", status: "draft", revision: 1, content: rawContent, secret_canary: "TOP_SECRET_CANARY" },
        role: "owner", participants: [], preflight: { ready: false, missing: ["private_preflight_canary"] }, secret_canary: "TOP_SECRET_CANARY",
      });
    });
    const client = new QueryClient();
    const detail = await client.fetchQuery({ queryKey: worldQueryKeys.detail(ctx.workspaceCode, "monster"), queryFn: () => worldApi.detail(ctx, "monster") });
    const cached = client.getQueryData(worldQueryKeys.detail(ctx.workspaceCode, "monster"));
    expect(JSON.stringify(cached)).not.toContain("SECRET_CANARY");
    expect(JSON.stringify(cached)).not.toContain("secret_canary");
    expect(JSON.stringify(cached)).not.toContain("private_memory");
    expect(JSON.stringify(detail)).not.toContain("private_preflight_canary");
    expect(detail.preflight.missing).toEqual([UNKNOWN_PREFLIGHT_REASON]);

    const dom = document.createElement("p");
    dom.textContent = preflightReasonPresentation(detail.preflight.missing[0]).label;
    expect(dom.textContent).toBe("还有一项服务检查未通过");
    expect(dom.textContent).not.toContain("private_preflight_canary");
    expect(classifyWorldError(new ApiError("preflight", 422, "WORLD_PREFLIGHT_FAILED", { missing: ["private_preflight_canary"] })).missing).toEqual(["还有一项服务检查未通过"]);

    const clipboard = serializeWorldContentForClipboard(detail.world.content);
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    await navigator.clipboard.writeText(clipboard);
    expect(clipboard).not.toContain("SECRET_CANARY");
    expect(writeText).toHaveBeenCalledWith(expect.not.stringContaining("SECRET_CANARY"));
    await worldApi.update(ctx, "monster", detail.world.revision, { ...detail.world.content, secret_canary: "REINSERTED_SECRET_CANARY" } as never);
    const requestBody = String((fetchMock.mock.calls.at(-1)?.[1] as RequestInit).body);
    expect(requestBody).not.toContain("SECRET_CANARY");
    expect(requestBody).not.toContain("secret_canary");
    expect(JSON.stringify(await worldApi.detail(ctx, "monster"))).not.toContain("SECRET_CANARY");
  });

  it.each([
    ["invite", () => worldApi.invite(ctx, "monster", { agent_code: "agent-1", version_no: 1, public_identity: "守门人", permissions: EMPTY_PERMISSIONS })],
    ["event card create", () => worldApi.createEventCard(ctx, "monster", 1, { event_code: "event-1", title: "敲门", order_no: 1, enabled: true, trigger: [], location_code: "hall", observable_start: "门响了", participant_codes: ["p-1"], max_effect: "有人开门" })],
    ["recall", () => worldApi.recall(ctx, "participant-1")],
    ["publish", () => worldApi.publish(ctx, "monster", 1)],
    ["barrier", () => worldApi.barrier(ctx, "monster", "pause", { run_epoch: 1, fencing_token: 2, expected_revision: 3 })],
  ])("fail-closes %s after an unknown result and sends no second mutation", async (_name, mutate) => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("simulated offline timeout"));
    await expect(mutate()).rejects.toThrow("simulated offline timeout");
    await expect(mutate()).rejects.toBeInstanceOf(UnknownWorldMutationLockedError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(window.localStorage.getItem("linkyun_living_world_unknown_mutations")).toContain(ctx.workspaceCode);
  });

  it("keeps a barrier fail-closed across a module refresh and a second click without another request", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("simulated barrier timeout"));
    const fence = { run_epoch: 1, fencing_token: 2, expected_revision: 3 };
    await expect(worldApi.barrier(ctx, "monster", "pause", fence)).rejects.toThrow("simulated barrier timeout");
    vi.resetModules();
    const { worldApi: refreshedWorldApi } = await import("./api");
    await expect(refreshedWorldApi.barrier(ctx, "monster", "pause", fence)).rejects.toThrow("上一项操作的结果仍待真源确认");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("uses the confirmed Agent-owner audience to strip Creator-only projection fields", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(ok({
      world_code: "monster", status: "running", revision: 3, runtime_health: "running", timeline: [],
      creator_audit_summary: "CREATOR_AUDIT_SECRET_CANARY",
      public_residents: [{ participant_code: "other", agent_code: "other-agent", public_identity: "其他角色", status: "active" }],
      owned_participant: { participant_code: "mine", agent_code: "my-agent", public_identity: "我的角色", status: "active" },
    }));
    const result = await worldApi.projection(ctx, "monster", "agent_owner");
    expect(result).toMatchObject({ audience: "agent-owner", owned_participant: { participant_code: "mine" } });
    expect(result).not.toHaveProperty("creator_audit_summary");
    expect(result).not.toHaveProperty("public_residents");
    expect(JSON.stringify(result)).not.toContain("CREATOR_AUDIT_SECRET_CANARY");
  });

  it("makes zero owner-review/report requests after a non-owner role is confirmed", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(ok({ items: [] }));
    const result = await loadWorldOwnerResources(ctx, "monster", "editor");
    expect(result.reviews).toBeUndefined();
    expect(result.reports).toBeUndefined();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
