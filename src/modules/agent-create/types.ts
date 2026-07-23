export type CreateStep = "basic" | "avatar" | "character-sheet" | "skills" | "complete";
export type CreateLifecycle = "before-draft" | "creating" | "complete";
export type SaveState = "idle" | "dirty" | "saving" | "saved" | "error" | "conflict";
export type Freshness = "current" | "stale";

export interface BasicRoleInput {
  name: string;
  identity: string;
  relationship: string;
  primaryInteraction: string;
  personalityTags: string[];
}

export interface ExampleConversation {
  user: string;
  assistant: string;
}

export interface BasicRoleContent {
  description: string;
  systemPrompt: string;
  opening: string;
  examples: ExampleConversation[];
}

export interface ImageCandidate {
  id: string;
  url: string;
  sourceUrl?: string;
  alt: string;
  specText?: string;
}

export interface CreateAgentState {
  lifecycle: CreateLifecycle;
  step: CreateStep;
  agentId: number | null;
  draftRevision: number | null;
  input: BasicRoleInput;
  basicCandidate: BasicRoleContent | null;
  confirmedBasic: BasicRoleContent | null;
  avatarCandidates: ImageCandidate[];
  selectedAvatarId: string | null;
  confirmedAvatar: ImageCandidate | null;
  avatarFreshness: Freshness;
  sheetCandidate: ImageCandidate | null;
  confirmedSheet: ImageCandidate | null;
  sheetFreshness: Freshness;
  selectedSkillIds: number[];
  saveState: SaveState;
  error: string;
}

export const EMPTY_ROLE_INPUT: BasicRoleInput = {
  name: "",
  identity: "",
  relationship: "",
  primaryInteraction: "",
  personalityTags: [],
};

export const INITIAL_CREATE_AGENT_STATE: CreateAgentState = {
  lifecycle: "before-draft",
  step: "basic",
  agentId: null,
  draftRevision: null,
  input: EMPTY_ROLE_INPUT,
  basicCandidate: null,
  confirmedBasic: null,
  avatarCandidates: [],
  selectedAvatarId: null,
  confirmedAvatar: null,
  avatarFreshness: "current",
  sheetCandidate: null,
  confirmedSheet: null,
  sheetFreshness: "current",
  selectedSkillIds: [],
  saveState: "idle",
  error: "",
};

export type CreateAgentAction =
  | { type: "restore"; state: CreateAgentState }
  | { type: "patch-input"; patch: Partial<BasicRoleInput> }
  | { type: "basic-generation-started" }
  | { type: "basic-generation-succeeded"; candidate: BasicRoleContent; agentId: number; draftRevision: number }
  | { type: "basic-generation-failed"; message: string }
  | { type: "edit-basic-candidate"; patch: Partial<BasicRoleContent> }
  | { type: "confirm-basic" }
  | { type: "avatar-generation-started" }
  | { type: "avatar-generation-succeeded"; candidates: ImageCandidate[] }
  | { type: "avatar-generation-failed"; message: string }
  | { type: "select-avatar"; candidateId: string }
  | { type: "confirm-avatar" }
  | { type: "set-upload-candidate"; candidate: ImageCandidate }
  | { type: "sheet-generation-started" }
  | { type: "sheet-generation-succeeded"; candidate: ImageCandidate }
  | { type: "sheet-generation-failed"; message: string }
  | { type: "confirm-sheet" }
  | { type: "toggle-skill"; skillId: number }
  | { type: "complete" }
  | { type: "go-to-step"; step: Exclude<CreateStep, "complete"> }
  | { type: "save-started" }
  | { type: "save-succeeded"; draftRevision?: number }
  | { type: "save-failed"; message: string; conflict?: boolean }
  | { type: "clear-error" };
