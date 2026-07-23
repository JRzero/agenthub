import { describe, expect, it } from "vitest";
import { canOpenStep, createAgentReducer, firstIncompleteStep, shouldProtectExit, validateBasicRole } from "./reducer";
import { INITIAL_CREATE_AGENT_STATE, type BasicRoleContent, type CreateAgentState, type ImageCandidate } from "./types";

const input = {
  name: "暖屿",
  identity: "温柔清醒的心理陪伴员",
  relationship: "愿意倾听和陪伴的朋友",
  primaryInteraction: "梳理情绪、温和提问",
  personalityTags: ["温和", "有同理心"],
};

const basic: BasicRoleContent = {
  description: "温和清醒的陪伴角色",
  systemPrompt: "你是暖屿。",
  opening: "今天想聊些什么？",
  examples: [],
};

const avatar: ImageCandidate = { id: "avatar-1", url: "/avatar.png", alt: "头像候选" };
const sheet: ImageCandidate = { id: "sheet-1", url: "/sheet.png", alt: "设定稿候选" };

describe("agent creation reducer", () => {
  it("validates only the fields required by the product flow", () => {
    expect(validateBasicRole(INITIAL_CREATE_AGENT_STATE.input)).toEqual({
      name: "请输入 Agent 名称",
      identity: "请描述角色是谁",
      relationship: "请描述角色与用户的关系",
    });
    expect(validateBasicRole(input)).toEqual({});
    expect(validateBasicRole({ ...input, personalityTags: ["温柔坚定", "轻松自然"] })).toEqual({});
  });

  it("keeps custom personality and expression tags in the creation input", () => {
    const state = createAgentReducer(INITIAL_CREATE_AGENT_STATE, {
      type: "patch-input",
      patch: { personalityTags: ["温柔坚定", "轻松自然"] },
    });
    expect(state.input.personalityTags).toEqual(["温柔坚定", "轻松自然"]);
  });

  it("creates the in-progress draft only after base generation succeeds", () => {
    const filled = createAgentReducer(INITIAL_CREATE_AGENT_STATE, { type: "patch-input", patch: input });
    expect(filled.lifecycle).toBe("before-draft");
    const generated = createAgentReducer(filled, {
      type: "basic-generation-succeeded",
      candidate: basic,
      agentId: 28,
      draftRevision: 1,
    });
    expect(generated.lifecycle).toBe("creating");
    expect(generated.agentId).toBe(28);
    expect(generated.confirmedBasic).toBeNull();
    expect(generated.saveState).toBe("dirty");
  });

  it("does not let a generated candidate overwrite confirmed content", () => {
    const generated = createAgentReducer(
      { ...INITIAL_CREATE_AGENT_STATE, input },
      { type: "basic-generation-succeeded", candidate: basic, agentId: 28, draftRevision: 1 },
    );
    const confirmed = createAgentReducer(generated, { type: "confirm-basic" });
    const replacement = { ...basic, description: "重新生成的候选" };
    const regenerated = createAgentReducer(confirmed, {
      type: "basic-generation-succeeded",
      candidate: replacement,
      agentId: 28,
      draftRevision: 2,
    });
    expect(regenerated.basicCandidate).toEqual(replacement);
    expect(regenerated.confirmedBasic).toEqual(basic);
  });

  it("locks later steps until mandatory confirmations are complete", () => {
    let state = { ...INITIAL_CREATE_AGENT_STATE, input };
    expect(canOpenStep(state, "avatar")).toBe(false);
    state = createAgentReducer(state, { type: "basic-generation-succeeded", candidate: basic, agentId: 28, draftRevision: 1 });
    state = createAgentReducer(state, { type: "confirm-basic" });
    expect(canOpenStep(state, "avatar")).toBe(true);
    expect(canOpenStep(state, "character-sheet")).toBe(false);
    state = createAgentReducer(state, { type: "avatar-generation-succeeded", candidates: [avatar] });
    state = createAgentReducer(state, { type: "confirm-avatar" });
    expect(canOpenStep(state, "character-sheet")).toBe(true);
    state = createAgentReducer(state, { type: "sheet-generation-succeeded", candidate: sheet });
    state = createAgentReducer(state, { type: "confirm-sheet" });
    expect(canOpenStep(state, "skills")).toBe(true);
    expect(firstIncompleteStep(state)).toBe("skills");
  });

  it("marks dependent visual assets stale after identity changes", () => {
    const completeVisuals = {
      ...INITIAL_CREATE_AGENT_STATE,
      lifecycle: "creating" as const,
      input,
      confirmedBasic: basic,
      confirmedAvatar: avatar,
      confirmedSheet: sheet,
    };
    const changed = createAgentReducer(completeVisuals, { type: "patch-input", patch: { identity: "新的角色定位" } });
    expect(changed.avatarFreshness).toBe("stale");
    expect(changed.sheetFreshness).toBe("stale");
  });

  it("keeps confirmed visual assets when new candidates are generated", () => {
    const confirmed = {
      ...INITIAL_CREATE_AGENT_STATE,
      lifecycle: "creating" as const,
      input,
      confirmedBasic: basic,
      confirmedAvatar: avatar,
      confirmedSheet: sheet,
    };
    const nextAvatar = { ...avatar, id: "avatar-2" };
    const withAvatarCandidate = createAgentReducer(confirmed, { type: "avatar-generation-succeeded", candidates: [nextAvatar] });
    expect(withAvatarCandidate.confirmedAvatar).toEqual(avatar);
    const nextSheet = { ...sheet, id: "sheet-2" };
    const withSheetCandidate = createAgentReducer(withAvatarCandidate, { type: "sheet-generation-succeeded", candidate: nextSheet });
    expect(withSheetCandidate.confirmedSheet).toEqual(sheet);
  });

  it("marks generated candidates and candidate selection for autosave", () => {
    let state: CreateAgentState = {
      ...INITIAL_CREATE_AGENT_STATE,
      lifecycle: "creating" as const,
      input,
      confirmedBasic: basic,
      step: "avatar" as const,
      saveState: "saved" as const,
    };
    state = createAgentReducer(state, { type: "avatar-generation-succeeded", candidates: [avatar] });
    expect(state.saveState).toBe("dirty");
    state = createAgentReducer({ ...state, saveState: "saved" }, { type: "select-avatar", candidateId: avatar.id });
    expect(state.saveState).toBe("dirty");
    state = createAgentReducer({ ...state, saveState: "saved" }, { type: "sheet-generation-succeeded", candidate: sheet });
    expect(state.saveState).toBe("dirty");
  });

  it("protects unsaved input and draft changes without blocking saved drafts", () => {
    expect(shouldProtectExit(INITIAL_CREATE_AGENT_STATE)).toBe(false);
    expect(shouldProtectExit({ ...INITIAL_CREATE_AGENT_STATE, input })).toBe(true);
    expect(shouldProtectExit({ ...INITIAL_CREATE_AGENT_STATE, lifecycle: "creating", saveState: "dirty" })).toBe(true);
    expect(shouldProtectExit({ ...INITIAL_CREATE_AGENT_STATE, lifecycle: "creating", saveState: "saved" })).toBe(false);
  });
});
