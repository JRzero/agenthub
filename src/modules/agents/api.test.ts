import { afterEach, describe, expect, it, vi } from "vitest";
import { deleteAgent, transferAgent } from "./api";

afterEach(() => vi.restoreAllMocks());

describe("Agent lifecycle API", () => {
  it("deletes an Agent through the existing endpoint", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ success: true, data: { message: "deleted" } }), { status: 200 }));
    await deleteAgent("token", 32);
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/api/v1/agents/32"), expect.objectContaining({ method: "DELETE" }));
  });

  it("transfers an Agent by updating workspace_id", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ success: true, data: { id: 32, name: "Agent" } }), { status: 200 }));
    await transferAgent("token", 32, 2);
    expect((fetchMock.mock.calls[0][1] as RequestInit).body).toBe(JSON.stringify({ workspace_id: 2 }));
  });
});
