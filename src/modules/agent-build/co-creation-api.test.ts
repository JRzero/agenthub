import { afterEach, describe, expect, it, vi } from "vitest";
import { autoTalkRound, generateCharacterSpec, optimizeNarrative, talkToMotherland } from "./co-creation-api";

afterEach(() => vi.restoreAllMocks());

describe("Motherland and character design API", () => {
  it("keeps manual and automatic talk contracts distinct", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => new Response(JSON.stringify({ success: true, data: { content: "ok", agent_message: "a", motherland_reply: "m" } }), { status: 200 }));
    await talkToMotherland("token", 32, "你好");
    await autoTalkRound("token", 32, "角色边界");
    expect(fetchMock.mock.calls[0][0]).toContain("/system/talk-to-motherland");
    expect(fetchMock.mock.calls[1][0]).toContain("/system/auto-talk-round");
  });

  it("sends the current draft to narrative and design generation", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => new Response(JSON.stringify({ success: true, data: { optimized_prompt: "prompt", spec_text: "spec" } }), { status: 200 }));
    await optimizeNarrative("token", 32, "baseline", "更温柔");
    await generateCharacterSpec("token", 32, "baseline");
    expect(String((fetchMock.mock.calls[0][1] as RequestInit).body)).toContain("baseline_prompt");
    expect(String((fetchMock.mock.calls[1][1] as RequestInit).body)).toContain("system_prompt");
  });
});
