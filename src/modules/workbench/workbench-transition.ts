import { useCallback, useEffect, useReducer, useRef } from "react";

export const WORKBENCH_SLIDE_MS = 720;

export type WorkbenchTransitionDirection = -1 | 1;
export type WorkbenchTransitionPhase = "idle" | "sliding";

export type WorkbenchTransitionState = {
  displayedId: number | null;
  targetId: number | null;
  direction: WorkbenchTransitionDirection;
  phase: WorkbenchTransitionPhase;
  queuedId: number | null;
  queuedDirection: WorkbenchTransitionDirection;
};

export type WorkbenchTransitionAction =
  | { type: "sync"; id: number | null }
  | { type: "request"; id: number; direction: WorkbenchTransitionDirection }
  | { type: "complete" };

export function createWorkbenchTransitionState(id: number | null): WorkbenchTransitionState {
  return {
    displayedId: id,
    targetId: id,
    direction: 1,
    phase: "idle",
    queuedId: null,
    queuedDirection: 1,
  };
}

export function workbenchTransitionReducer(
  state: WorkbenchTransitionState,
  action: WorkbenchTransitionAction,
): WorkbenchTransitionState {
  if (action.type === "sync") return createWorkbenchTransitionState(action.id);

  if (action.type === "request") {
    if (state.phase === "sliding") {
      if (action.id === state.targetId) {
        return { ...state, queuedId: null, queuedDirection: action.direction };
      }
      return { ...state, queuedId: action.id, queuedDirection: action.direction };
    }

    if (action.id === state.displayedId) {
      return { ...state, targetId: action.id, direction: action.direction };
    }

    return {
      ...state,
      targetId: action.id,
      direction: action.direction,
      phase: "sliding",
      queuedId: null,
    };
  }

  const landedId = state.targetId;
  if (state.queuedId !== null && state.queuedId !== landedId) {
    return {
      ...state,
      displayedId: landedId,
      targetId: state.queuedId,
      direction: state.queuedDirection,
      queuedId: null,
      phase: "sliding",
    };
  }

  return {
    ...state,
    displayedId: landedId,
    targetId: landedId,
    queuedId: null,
    phase: "idle",
  };
}

export function relativeAgentId(ids: number[], fromId: number | null, offset: number): number | null {
  if (!ids.length) return null;
  const currentIndex = Math.max(0, ids.indexOf(fromId ?? ids[0]));
  return ids[(currentIndex + offset + ids.length) % ids.length];
}

export function circularAgentSlot(
  ids: number[],
  focusId: number | null,
  agentId: number,
): number | null {
  if (!ids.length || focusId === null) return null;
  const focusIndex = ids.indexOf(focusId);
  const agentIndex = ids.indexOf(agentId);
  if (focusIndex < 0 || agentIndex < 0) return null;

  let offset = agentIndex - focusIndex;
  const half = ids.length / 2;
  if (offset > half) offset -= ids.length;
  if (offset < -half) offset += ids.length;
  return offset;
}

export function boundedCarouselSlot(offset: number | null): -3 | -2 | -1 | 0 | 1 | 2 | 3 {
  if (offset === null) return 3;
  if (offset < -2) return -3;
  if (offset > 2) return 3;
  return offset as -2 | -1 | 0 | 1 | 2;
}

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined"
    && typeof window.matchMedia === "function"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function workbenchSlideDelay(reducedMotion: boolean): number {
  return reducedMotion ? 0 : WORKBENCH_SLIDE_MS;
}

export function useWorkbenchAgentTransition(agentIds: number[]) {
  const [state, dispatch] = useReducer(
    workbenchTransitionReducer,
    agentIds[0] ?? null,
    createWorkbenchTransitionState,
  );
  const requestedIdRef = useRef<number | null>(state.targetId);

  useEffect(() => {
    const fallbackId = agentIds[0] ?? null;
    const queuedIsValid = state.queuedId === null || agentIds.includes(state.queuedId);
    if (
      !agentIds.includes(state.displayedId ?? -1)
      || !agentIds.includes(state.targetId ?? -1)
      || !queuedIsValid
    ) {
      requestedIdRef.current = fallbackId;
      dispatch({ type: "sync", id: fallbackId });
    }
  }, [agentIds, state.displayedId, state.queuedId, state.targetId]);

  useEffect(() => {
    if (state.phase !== "sliding") return;
    const delay = workbenchSlideDelay(prefersReducedMotion());
    const timer = window.setTimeout(() => dispatch({ type: "complete" }), delay);
    return () => window.clearTimeout(timer);
  }, [state.phase, state.targetId]);

  const request = useCallback((id: number, direction: WorkbenchTransitionDirection) => {
    requestedIdRef.current = id;
    dispatch({ type: "request", id, direction });
  }, []);

  const requestRelative = useCallback((offset: number) => {
    const id = relativeAgentId(agentIds, requestedIdRef.current, offset);
    if (id === null) return;
    request(id, offset < 0 ? -1 : 1);
  }, [agentIds, request]);

  return { ...state, request, requestRelative };
}
