import { afterEach, describe, expect, it, vi } from "vitest";
import { getWorkspaceInviteCode, refreshWorkspaceInviteCode, switchActiveWorkspace } from "./api";

afterEach(() => vi.restoreAllMocks());

describe("workspace API", () => {
  it("switches the active backend workspace", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ success: true, data: { workspace: { id: 2, code: "brand-lab" }, message: "ok" } }), { status: 200 }));
    await switchActiveWorkspace("token", "brand-lab");
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/api/v1/user/workspace/switch"), expect.objectContaining({ method: "POST", body: JSON.stringify({ workspace_code: "brand-lab" }) }));
  });

  it("reads and refreshes invite codes with the workspace header", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => new Response(JSON.stringify({ success: true, data: { invite_code: "INVITE" } }), { status: 200 }));
    await getWorkspaceInviteCode("token", "brand-lab");
    await refreshWorkspaceInviteCode("token", "brand-lab");
    expect((fetchMock.mock.calls[0][1] as RequestInit).headers).toMatchObject({ "X-Workspace-Code": "brand-lab" });
    expect(fetchMock.mock.calls[1][0]).toContain("/invite-code/refresh");
  });
});
