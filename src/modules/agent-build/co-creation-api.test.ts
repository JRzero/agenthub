import { afterEach, describe, expect, it, vi } from "vitest";
import {
  autoTalkRound,
  deleteCharacterDesign,
  generateCharacterSpec,
  optimizeNarrative,
  saveCharacterDesign,
  talkToMotherland,
} from "./co-creation-api";

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

  it("sends the draft revision when saving or deleting character design", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(
      async () =>
        new Response(
          JSON.stringify({ success: true, data: { id: 32, draft_revision: 9 } }),
          { status: 200 },
        ),
    );

    await saveCharacterDesign("token", 32, "spec", "/api/file", 7);
    await deleteCharacterDesign("token", 32, 8);

    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body))).toEqual({
      spec_text: "spec",
      image_url: "/api/file",
      expected_draft_revision: 7,
    });
    expect(String(fetchMock.mock.calls[1][0])).toContain(
      "/character-design?expected_draft_revision=8",
    );
  });
});
