import { describe, expect, it } from "vitest";
import {
  WORKBENCH_ENTER_MS,
  WORKBENCH_EXIT_MS,
  createWorkbenchTransitionState,
  relativeAgentId,
  workbenchTransitionReducer,
} from "./workbench-transition";

describe("workbench Agent transition", () => {
  it("uses a short exit and a 180-300ms total transform/opacity transition", () => {
    expect(WORKBENCH_EXIT_MS).toBe(70);
    expect(WORKBENCH_ENTER_MS).toBe(210);
    expect(WORKBENCH_EXIT_MS + WORKBENCH_ENTER_MS).toBe(280);
  });

  it("commits the latest valid request during rapid input", () => {
    let state = createWorkbenchTransitionState(1);
    state = workbenchTransitionReducer(state, { type: "request", id: 2, direction: 1 });
    state = workbenchTransitionReducer(state, { type: "request", id: 3, direction: 1 });
    expect(state).toMatchObject({ displayedId: 1, targetId: 3, phase: "exit" });
    state = workbenchTransitionReducer(state, { type: "commit" });
    expect(state).toMatchObject({ displayedId: 3, targetId: 3, phase: "enter" });
    state = workbenchTransitionReducer(state, { type: "complete" });
    expect(state.phase).toBe("idle");
  });

  it("keeps one Agent stable and cycles two or three Agents predictably", () => {
    expect(relativeAgentId([1], 1, 1)).toBe(1);
    expect(relativeAgentId([1, 2], 1, -1)).toBe(2);
    expect(relativeAgentId([1, 2, 3], 3, 1)).toBe(1);
    expect(relativeAgentId([1, 2, 3], 1, -1)).toBe(3);
    expect(relativeAgentId([], null, 1)).toBeNull();
  });

  it("cancels an in-flight transition when the latest target is the displayed Agent", () => {
    let state = createWorkbenchTransitionState(1);
    state = workbenchTransitionReducer(state, { type: "request", id: 2, direction: 1 });
    state = workbenchTransitionReducer(state, { type: "request", id: 1, direction: -1 });
    expect(state).toMatchObject({ displayedId: 1, targetId: 1, phase: "idle" });
  });
});
