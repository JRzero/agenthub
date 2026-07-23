import { describe, expect, it } from "vitest";
import { INITIAL_CREATE_AGENT_STATE } from "./types";
import { DEMO_DRAFT_KEY, loadDemoCreateDraft, saveDemoCreateDraft } from "./storage";

function memoryStorage(initial?: string) {
  let value = initial ?? null;
  return {
    getItem: () => value,
    setItem: (_key: string, next: string) => { value = next; },
    read: () => value,
  };
}

describe("demo creation draft storage", () => {
  it("stores only the isolated demo creation record and restores it as saved", () => {
    const storage = memoryStorage();
    const state = {
      ...INITIAL_CREATE_AGENT_STATE,
      lifecycle: "creating" as const,
      agentId: 28,
      draftRevision: 3,
      input: { ...INITIAL_CREATE_AGENT_STATE.input, name: "暖屿" },
      saveState: "dirty" as const,
    };
    saveDemoCreateDraft(storage, state);
    const raw = storage.read();
    expect(raw).toContain("暖屿");
    expect(loadDemoCreateDraft(storage)).toMatchObject({
      agentId: 28,
      draftRevision: 3,
      saveState: "saved",
    });
  });

  it("ignores invalid or pre-draft content", () => {
    expect(loadDemoCreateDraft(memoryStorage("not-json"))).toBeNull();
    expect(loadDemoCreateDraft(memoryStorage(JSON.stringify(INITIAL_CREATE_AGENT_STATE)))).toBeNull();
  });

  it("uses a dedicated session key", () => {
    expect(DEMO_DRAFT_KEY).toBe("agenthub_demo_guided_create_draft");
  });
});
