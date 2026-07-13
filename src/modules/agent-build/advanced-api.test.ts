import { afterEach, describe, expect, it, vi } from "vitest";
import { listStageSkills, resetEdgeToken, setStageSkills } from "./advanced-api";

afterEach(() => vi.restoreAllMocks());

describe("advanced build API", () => {
  it("reads and writes stage-specific skills", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => new Response(JSON.stringify({ success: true, data: { mid_skills: [] } }), { status: 200 }));
    await expect(listStageSkills("token", 32, "mid")).resolves.toEqual([]);
    await setStageSkills("token", 32, "mid", [{ creator_skill_id: 7, config: { city: "上海" } }]);
    expect(fetchMock.mock.calls[1][0]).toContain("/agents/32/mid-skills");
    expect((fetchMock.mock.calls[1][1] as RequestInit).body).toBe(JSON.stringify({ mid_skills: [{ creator_skill_id: 7, config: { city: "上海" } }] }));
  });

  it("resets the Edge token", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ success: true, data: { edge_token: "new-token" } }), { status: 200 }));
    await expect(resetEdgeToken("token", 32)).resolves.toEqual({ edge_token: "new-token" });
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/edge-token/reset"), expect.objectContaining({ method: "POST" }));
  });
});
