import { beforeEach, describe, expect, it, vi } from "vitest";
import { DEMO_SHARED_SESSIONS } from "./fixtures";
import { listSharedSessions, pushCreatorComment, updateSessionPrompt, verifySession } from "./api";

describe("operations APIs", () => {
  beforeEach(() => { window.localStorage.clear(); vi.restoreAllMocks(); });

  it("scopes shared session reads to the workspace", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ success: true, data: { sessions: [] } }), { status: 200 }));
    await listSharedSessions("key", "studio");
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/sessions/shared"), expect.objectContaining({ headers: expect.objectContaining({ "X-Workspace-Code": "studio" }) }));
  });

  it("uses compatible verify and prompt patch payloads", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: true, data: {} }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: true, data: {} }), { status: 200 }));
    await verifySession("key", "studio", 1842, true);
    await updateSessionPrompt("key", "studio", 1842, "保持简洁");
    expect(JSON.parse(String((fetchMock.mock.calls[0][1] as RequestInit).body))).toEqual({ verified: true });
    expect(JSON.parse(String((fetchMock.mock.calls[1][1] as RequestInit).body))).toEqual({ prompt_patch: "保持简洁", reason: "" });
  });

  it("prefixes creator comments without changing the target session", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ success: true, data: { message_id: "1", session_id: 1842 } }), { status: 200 }));
    await pushCreatorComment("key", "studio", DEMO_SHARED_SESSIONS[0], "请补充信息");
    const body = JSON.parse(String((fetchMock.mock.calls[0][1] as RequestInit).body));
    expect(body.content).toBe("[创作者评论] 请补充信息");
    expect(body.session_id).toBe(1842);
  });
});
