import { INITIAL_CREATE_AGENT_STATE, type CreateAgentState } from "./types";

const DEMO_DRAFT_KEY = "agenthub_demo_guided_create_draft";

function isCreateAgentState(value: unknown): value is CreateAgentState {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<CreateAgentState>;
  return (
    (candidate.lifecycle === "creating" || candidate.lifecycle === "complete") &&
    typeof candidate.agentId === "number" &&
    typeof candidate.input?.name === "string" &&
    Array.isArray(candidate.input?.personalityTags) &&
    typeof candidate.saveState === "string"
  );
}

export function loadDemoCreateDraft(storage: Pick<Storage, "getItem">): CreateAgentState | null {
  try {
    const raw = storage.getItem(DEMO_DRAFT_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isCreateAgentState(parsed)) return null;
    return { ...INITIAL_CREATE_AGENT_STATE, ...parsed, saveState: "saved", error: "" };
  } catch {
    return null;
  }
}

export function saveDemoCreateDraft(storage: Pick<Storage, "setItem">, state: CreateAgentState): void {
  storage.setItem(DEMO_DRAFT_KEY, JSON.stringify({ ...state, saveState: "saved", error: "" }));
}

export function clearDemoCreateDraft(storage: Pick<Storage, "removeItem">): void {
  storage.removeItem(DEMO_DRAFT_KEY);
}

export { DEMO_DRAFT_KEY };
