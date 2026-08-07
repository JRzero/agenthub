import { describe, expect, it } from "vitest";
import {
  WORKBENCH_SLIDE_MS,
  createWorkbenchTransitionState,
  relativeAgentId,
  workbenchSlideDelay,
  workbenchTransitionReducer,
} from "./workbench-transition";

describe("workbench Agent transition", () => {
  it("uses one buffered 380-440ms horizontal slide", () => {
    expect(WORKBENCH_SLIDE_MS).toBe(420);
    expect(workbenchSlideDelay(false)).toBe(420);
    expect(workbenchSlideDelay(true)).toBe(0);
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

  it("keeps only one last-target queue instead of accumulating catch-up slides", () => {
    let state = createWorkbenchTransitionState(1);
    state = workbenchTransitionReducer(state, { type: "request", id: 2, direction: 1 });
    state = workbenchTransitionReducer(state, { type: "request", id: 3, direction: 1 });
    state = workbenchTransitionReducer(state, { type: "request", id: 4, direction: 1 });
    expect(state).toMatchObject({ displayedId: 1, targetId: 2, queuedId: 4 });
    state = workbenchTransitionReducer(state, { type: "complete" });
    expect(state).toMatchObject({ displayedId: 2, targetId: 4, queuedId: null, phase: "sliding" });
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
