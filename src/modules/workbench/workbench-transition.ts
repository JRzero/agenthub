import { useCallback, useEffect, useReducer, useRef } from "react";

export const WORKBENCH_EXIT_MS = 70;
export const WORKBENCH_ENTER_MS = 210;

export type WorkbenchTransitionDirection = -1 | 1;
export type WorkbenchTransitionPhase = "idle" | "exit" | "enter";

export type WorkbenchTransitionState = {
  displayedId: number | null;
  targetId: number | null;
  direction: WorkbenchTransitionDirection;
  phase: WorkbenchTransitionPhase;
};

export type WorkbenchTransitionAction =
  | { type: "sync"; id: number | null }
  | { type: "request"; id: number; direction: WorkbenchTransitionDirection }
  | { type: "commit" }
  | { type: "complete" };

export function createWorkbenchTransitionState(id: number | null): WorkbenchTransitionState {
  return { displayedId: id, targetId: id, direction: 1, phase: "idle" };
}

export function workbenchTransitionReducer(
  state: WorkbenchTransitionState,
  action: WorkbenchTransitionAction,
): WorkbenchTransitionState {
  if (action.type === "sync") return createWorkbenchTransitionState(action.id);
  if (action.type === "request") {
    if (action.id === state.displayedId) {
      return { ...state, targetId: action.id, direction: action.direction, phase: "idle" };
    }
    return { ...state, targetId: action.id, direction: action.direction, phase: "exit" };
  }
  if (action.type === "commit") {
    if (state.targetId === state.displayedId) return { ...state, phase: "idle" };
    return { ...state, displayedId: state.targetId, phase: "enter" };
  }
  return { ...state, phase: "idle" };
}

export function relativeAgentId(ids: number[], fromId: number | null, offset: number): number | null {
  if (!ids.length) return null;
  const currentIndex = Math.max(0, ids.indexOf(fromId ?? ids[0]));
  return ids[(currentIndex + offset + ids.length) % ids.length];
}

export function useWorkbenchAgentTransition(agentIds: number[]) {
  const [state, dispatch] = useReducer(
    workbenchTransitionReducer,
    agentIds[0] ?? null,
    createWorkbenchTransitionState,
  );
  const targetIdRef = useRef<number | null>(state.targetId);

  useEffect(() => {
    const fallbackId = agentIds[0] ?? null;
    if (!agentIds.includes(state.displayedId ?? -1) || !agentIds.includes(state.targetId ?? -1)) {
      targetIdRef.current = fallbackId;
      dispatch({ type: "sync", id: fallbackId });
    }
  }, [agentIds, state.displayedId, state.targetId]);

  useEffect(() => {
    if (state.phase === "idle") return;
    const delay = state.phase === "exit" ? WORKBENCH_EXIT_MS : WORKBENCH_ENTER_MS;
    const timer = window.setTimeout(
      () => dispatch({ type: state.phase === "exit" ? "commit" : "complete" }),
      delay,
    );
    return () => window.clearTimeout(timer);
  }, [state.phase, state.targetId]);

  const request = useCallback((id: number, direction: WorkbenchTransitionDirection) => {
    targetIdRef.current = id;
    dispatch({ type: "request", id, direction });
  }, []);

  const requestRelative = useCallback((offset: number) => {
    const id = relativeAgentId(agentIds, targetIdRef.current, offset);
    if (id === null) return;
    request(id, offset < 0 ? -1 : 1);
  }, [agentIds, request]);

  return { ...state, request, requestRelative };
}
