import { describe, expect, it } from "vitest";
import { getDefaultAutoPublishAgentId } from "./auto-publish-dialog";

describe("automatic Moment publication Agent selection", () => {
  const agents = [
    { id: 1, current_version_id: null },
    { id: 2, current_version_id: 20 },
    { id: 3, current_version_id: 30 },
  ];

  it("keeps an available initial Agent", () => {
    expect(getDefaultAutoPublishAgentId(agents, 3)).toBe(3);
  });

  it("falls back to the first published Agent", () => {
    expect(getDefaultAutoPublishAgentId(agents, 1)).toBe(2);
  });

  it("does not select an unpublished Agent when none are available", () => {
    expect(
      getDefaultAutoPublishAgentId(
        [
          { id: 1, current_version_id: null },
          { id: 2, current_version_id: null },
        ],
        1,
      ),
    ).toBeNull();
  });
});
