import { beforeEach, describe, expect, it, vi } from "vitest";
import { createShareLink, deleteShareLink, getShareLink, setShareLinkEnabled } from "./api";

describe("distribution share-link API", () => {
  beforeEach(() => { window.localStorage.clear(); vi.restoreAllMocks(); });

  it("keeps share-link requests scoped to the current workspace", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ success: true, data: { share_token: "share-1" } }), { status: 200 }));
    await createShareLink("test-key", 32, "studio");
    expect(fetchMock).toHaveBeenCalledWith("http://localhost:8080/api/v1/agents/32/share-link", expect.objectContaining({ method: "POST", headers: expect.objectContaining({ "X-Workspace-Code": "studio" }) }));
  });

  it("treats a missing share link as an unpublished channel", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ success: false, error: { message: "not found" } }), { status: 404 }));
    await expect(getShareLink("test-key", 32, "studio")).resolves.toBeNull();
  });

  it("uses the existing PATCH contract to pause a public link", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ success: true, data: { enabled: false } }), { status: 200 }));
    await setShareLinkEnabled("test-key", 32, "studio", false);
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect(init.method).toBe("PATCH");
    expect(init.body).toBe(JSON.stringify({ enabled: false }));
  });

  it("deletes a public share link", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ success: true, data: { deleted: true } }), { status: 200 }));
    await expect(deleteShareLink("test-key", 32, "studio")).resolves.toEqual({ deleted: true });
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/agents/32/share-link"), expect.objectContaining({ method: "DELETE" }));
  });
});
