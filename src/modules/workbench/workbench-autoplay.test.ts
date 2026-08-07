import { afterEach, describe, expect, it, vi } from "vitest";
import {
  WORKBENCH_AUTOPLAY_MS,
  scheduleWorkbenchAutoplay,
  shouldRunWorkbenchAutoplay,
  type WorkbenchAutoplayConditions,
} from "./workbench-autoplay";

const eligible: WorkbenchAutoplayConditions = {
  agentCount: 3,
  phase: "idle",
  hovered: false,
  focusWithin: false,
  documentHidden: false,
  reducedMotion: false,
};

afterEach(() => {
  vi.useRealTimers();
});

describe("workbench autoplay", () => {
  it("advances exactly once at 3000ms and not at 2999ms", () => {
    vi.useFakeTimers();
    const onAdvance = vi.fn();
    expect(WORKBENCH_AUTOPLAY_MS).toBe(3_000);
    scheduleWorkbenchAutoplay(eligible, onAdvance);

    vi.advanceTimersByTime(WORKBENCH_AUTOPLAY_MS - 1);
    expect(onAdvance).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(onAdvance).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(WORKBENCH_AUTOPLAY_MS);
    expect(onAdvance).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["single Agent", { agentCount: 1 }],
    ["active transition", { phase: "sliding" as const }],
    ["hover", { hovered: true }],
    ["focus within", { focusWithin: true }],
    ["hidden document", { documentHidden: true }],
    ["reduced motion", { reducedMotion: true }],
  ])("does not schedule for %s", (_label, override) => {
    vi.useFakeTimers();
    const onAdvance = vi.fn();
    scheduleWorkbenchAutoplay({ ...eligible, ...override }, onAdvance);
    vi.advanceTimersByTime(WORKBENCH_AUTOPLAY_MS * 2);
    expect(onAdvance).not.toHaveBeenCalled();
    expect(shouldRunWorkbenchAutoplay({ ...eligible, ...override })).toBe(false);
  });

  it("cancels on manual or transient interruption and restarts a full interval", () => {
    vi.useFakeTimers();
    const onAdvance = vi.fn();
    const cancel = scheduleWorkbenchAutoplay(eligible, onAdvance);
    vi.advanceTimersByTime(1_500);
    cancel();

    const cancelRestarted = scheduleWorkbenchAutoplay(eligible, onAdvance);
    vi.advanceTimersByTime(WORKBENCH_AUTOPLAY_MS - 1);
    expect(onAdvance).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(onAdvance).toHaveBeenCalledTimes(1);
    cancelRestarted();
  });
});
