import { afterEach, describe, expect, it, vi } from "vitest";
import { addMomentComment, createMoment, deleteMoment, generateMomentSchedule } from "./moments-api";

afterEach(() => vi.restoreAllMocks());

describe("Moments API", () => {
  it("publishes and deletes an Agent moment", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => new Response(JSON.stringify({ success: true, data: { id: 1, message: "ok" } }), { status: 200 }));
    await createMoment("token", 32, { content: "新动态", auto_image: true });
    await deleteMoment("token", 32, 1);
    expect(fetchMock.mock.calls[0][0]).toContain("/agents/32/moments");
    expect((fetchMock.mock.calls[1][1] as RequestInit).method).toBe("DELETE");
  });

  it("adds Creator comments and generates schedules", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => new Response(JSON.stringify({ success: true, data: { id: 2, schedules: [], config: null } }), { status: 200 }));
    await addMomentComment("token", 1, "[创作者评论] 很好");
    await generateMomentSchedule("token", 32);
    expect(fetchMock.mock.calls[0][0]).toContain("/moments/1/comments");
    expect((fetchMock.mock.calls[1][1] as RequestInit).method).toBe("POST");
  });
});
