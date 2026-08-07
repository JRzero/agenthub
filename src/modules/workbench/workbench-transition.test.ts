import { describe, expect, it } from "vitest";
import {
  WORKBENCH_SLIDE_MS,
  createWorkbenchTransitionState,
  relativeAgentId,
  workbenchTransitionReducer,
} from "./workbench-transition";

describe("workbench Agent transition", () => {
  it("uses one 180-300ms horizontal slide", () => {
    expect(WORKBENCH_SLIDE_MS).toBe(240);
  });

  it("commits the latest valid request during rapid input", () => {
    let state = createWorkbenchTransitionState(1);
    state = workbenchTransitionReducer(state, { type: "request", id: 2, direction: 1 });
    state = workbenchTransitionReducer(state, { type: "request", id: 3, direction: 1 });
    expect(state).toMatchObject({ displayedId: 1, targetId: 2, queuedId: 3, phase: "sliding" });
    state = workbenchTransitionReducer(state, { type: "complete" });
    expect(state).toMatchObject({ displayedId: 2, targetId: 3, queuedId: null, phase: "sliding" });
    state = workbenchTransitionReducer(state, { type: "complete" });
    expect(state).toMatchObject({ displayedId: 3, targetId: 3, phase: "idle" });
  });

  it("keeps one Agent stable and cycles two or three Agents predictably", () => {
    expect(relativeAgentId([1], 1, 1)).toBe(1);
    expect(relativeAgentId([1, 2], 1, -1)).toBe(2);
    expect(relativeAgentId([1, 2, 3], 3, 1)).toBe(1);
    expect(relativeAgentId([1, 2, 3], 1, -1)).toBe(3);
    expect(relativeAgentId([], null, 1)).toBeNull();
  });

  it("queues a return to the displayed Agent without clearing the active stage", () => {
    let state = createWorkbenchTransitionState(1);
    state = workbenchTransitionReducer(state, { type: "request", id: 2, direction: 1 });
    state = workbenchTransitionReducer(state, { type: "request", id: 1, direction: -1 });
    expect(state).toMatchObject({ displayedId: 1, targetId: 2, queuedId: 1, phase: "sliding" });
    state = workbenchTransitionReducer(state, { type: "complete" });
    expect(state).toMatchObject({ displayedId: 2, targetId: 1, phase: "sliding" });
    state = workbenchTransitionReducer(state, { type: "complete" });
    expect(state).toMatchObject({ displayedId: 1, phase: "idle" });
  });
});
