import { describe, expect, it } from "vitest";
import type { Agent } from "@/modules/agents/types";
import type { EvaluationResult } from "./types";
import {
  createPublishTestSummary,
  publishTestSummaryKey,
  readPublishTestSummary,
  savePublishTestSummary,
} from "./publish-test-summary";

const agent = {
  id: 18,
  draft_revision: 7,
} as Agent;

const result = {
  passed: 4,
  generatedAt: "2026-07-28T08:00:00.000Z",
  metrics: [
    { id: "safety", status: "passed" },
    { id: "character", status: "passed" },
    { id: "knowledge", status: "partial" },
    { id: "fluency", status: "passed" },
    { id: "emotion", status: "passed" },
  ],
} as EvaluationResult;

describe("publish test summary", () => {
  it("stores only revision-aware evaluation summary data", () => {
    const storage = window.sessionStorage;
    storage.clear();
    const summary = createPublishTestSummary(agent, result, "boundary");
    savePublishTestSummary(storage, "live", summary);

    expect(readPublishTestSummary(storage, "live", 18, 7)).toEqual(summary);
    expect(readPublishTestSummary(storage, "live", 18, 8)).toBeNull();
    expect(storage.getItem(publishTestSummaryKey("demo", 18))).toBeNull();
    expect(storage.getItem(publishTestSummaryKey("live", 18))).not.toContain(
      "conversation",
    );
  });

  it("rejects malformed storage values", () => {
    window.sessionStorage.setItem(
      publishTestSummaryKey("live", 18),
      "{invalid",
    );
    expect(
      readPublishTestSummary(window.sessionStorage, "live", 18, 7),
    ).toBeNull();
  });
});
