import type { BasicRoleInput, CreateAgentAction, CreateAgentState, CreateStep } from "./types";

export function validateBasicRole(input: BasicRoleInput): Record<string, string> {
  const errors: Record<string, string> = {};
  const name = input.name.trim();
  const identity = input.identity.trim();
  const relationship = input.relationship.trim();
  if (!name) errors.name = "请输入 Agent 名称";
  else if (name.length > 50) errors.name = "Agent 名称不能超过 50 个字符";
  if (!identity) errors.identity = "请描述角色是谁";
  else if (identity.length > 80) errors.identity = "角色描述不能超过 80 个字符";
  if (!relationship) errors.relationship = "请描述角色与用户的关系";
  else if (relationship.length > 50) errors.relationship = "用户关系不能超过 50 个字符";
  if (input.primaryInteraction.length > 100) errors.primaryInteraction = "主要互动不能超过 100 个字符";
  if (input.personalityTags.length > 4) errors.personalityTags = "最多选择 4 个标签";
  return errors;
}

export function firstIncompleteStep(state: CreateAgentState): CreateStep {
  if (!state.confirmedBasic) return "basic";
  if (!state.confirmedAvatar || state.avatarFreshness === "stale") return "avatar";
  if (!state.confirmedSheet || state.sheetFreshness === "stale") return "character-sheet";
  return state.lifecycle === "complete" ? "complete" : "skills";
}

export function canOpenStep(state: CreateAgentState, step: Exclude<CreateStep, "complete">): boolean {
  if (step === "basic") return true;
  if (step === "avatar") return Boolean(state.confirmedBasic);
  if (step === "character-sheet") return Boolean(state.confirmedAvatar && state.avatarFreshness === "current");
  return Boolean(state.confirmedSheet && state.sheetFreshness === "current");
}

export function shouldProtectExit(state: CreateAgentState): boolean {
  if (state.lifecycle === "before-draft") {
    return Object.values(state.input).some((value) => Array.isArray(value) ? value.length > 0 : Boolean(value));
  }
  return state.saveState === "dirty" || state.saveState === "saving" || state.saveState === "error" || state.saveState === "conflict";
}

function inputChangeFreshness(state: CreateAgentState, patch: Partial<BasicRoleInput>): Pick<CreateAgentState, "avatarFreshness" | "sheetFreshness"> {
  const identityChanged = patch.identity !== undefined && patch.identity !== state.input.identity;
  const tagsChanged = patch.personalityTags !== undefined && patch.personalityTags.join("\u0000") !== state.input.personalityTags.join("\u0000");
  if ((identityChanged || tagsChanged) && state.confirmedBasic) {
    return {
      avatarFreshness: state.confirmedAvatar ? "stale" : state.avatarFreshness,
      sheetFreshness: state.confirmedSheet ? "stale" : state.sheetFreshness,
    };
  }
  return { avatarFreshness: state.avatarFreshness, sheetFreshness: state.sheetFreshness };
}

export function createAgentReducer(state: CreateAgentState, action: CreateAgentAction): CreateAgentState {
  switch (action.type) {
    case "restore": return action.state;
    case "patch-input": {
      const freshness = inputChangeFreshness(state, action.patch);
      return {
        ...state,
        ...freshness,
        input: { ...state.input, ...action.patch },
        saveState: state.lifecycle === "before-draft" ? state.saveState : "dirty",
        error: "",
      };
    }
    case "basic-generation-started": return { ...state, saveState: "saving", error: "" };
    case "basic-generation-succeeded": return { ...state, lifecycle: "creating", agentId: action.agentId, draftRevision: action.draftRevision, basicCandidate: action.candidate, saveState: "dirty", error: "" };
    case "basic-generation-failed": return { ...state, saveState: "error", error: action.message };
    case "edit-basic-candidate": return state.basicCandidate ? { ...state, basicCandidate: { ...state.basicCandidate, ...action.patch }, saveState: "dirty" } : state;
    case "confirm-basic": return state.basicCandidate ? { ...state, confirmedBasic: state.basicCandidate, step: "avatar", saveState: "dirty", error: "" } : state;
    case "avatar-generation-started": return { ...state, saveState: "saving", error: "" };
    case "avatar-generation-succeeded": return { ...state, avatarCandidates: action.candidates, selectedAvatarId: action.candidates[0]?.id || null, saveState: "dirty", error: "" };
    case "avatar-generation-failed": return { ...state, saveState: "error", error: action.message };
    case "select-avatar": return { ...state, selectedAvatarId: action.candidateId, saveState: "dirty", error: "" };
    case "set-upload-candidate": return { ...state, avatarCandidates: [action.candidate], selectedAvatarId: action.candidate.id, saveState: "dirty", error: "" };
    case "confirm-avatar": {
      const candidate = state.avatarCandidates.find((item) => item.id === state.selectedAvatarId);
      return candidate ? { ...state, confirmedAvatar: candidate, avatarFreshness: "current", sheetFreshness: state.confirmedSheet ? "stale" : "current", step: "character-sheet", saveState: "dirty", error: "" } : state;
    }
    case "sheet-generation-started": return { ...state, saveState: "saving", error: "" };
    case "sheet-generation-succeeded": return { ...state, sheetCandidate: action.candidate, saveState: "dirty", error: "" };
    case "sheet-generation-failed": return { ...state, saveState: "error", error: action.message };
    case "confirm-sheet": return state.sheetCandidate ? { ...state, confirmedSheet: state.sheetCandidate, sheetFreshness: "current", step: "skills", saveState: "dirty", error: "" } : state;
    case "toggle-skill": return { ...state, selectedSkillIds: state.selectedSkillIds.includes(action.skillId) ? state.selectedSkillIds.filter((id) => id !== action.skillId) : [...state.selectedSkillIds, action.skillId], saveState: "dirty" };
    case "complete": return { ...state, lifecycle: "complete", step: "complete", saveState: "dirty", error: "" };
    case "go-to-step": return canOpenStep(state, action.step) ? { ...state, step: action.step, error: "" } : state;
    case "save-started": return { ...state, saveState: "saving", error: "" };
    case "save-succeeded": return { ...state, draftRevision: action.draftRevision ?? state.draftRevision, saveState: "saved", error: "" };
    case "save-failed": return { ...state, saveState: action.conflict ? "conflict" : "error", error: action.message };
    case "clear-error": return { ...state, error: "" };
    default: return state;
  }
}
