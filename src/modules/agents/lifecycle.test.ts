import { describe, expect, it } from "vitest";
import { resolveAgentLifecycle } from "./lifecycle";

describe("Agent lifecycle presentation", () => {
  it.each([
    [
      { status: "active", current_version_id: 7, creation_completed: true },
      "published",
      "已发布",
    ],
    [
      { status: "private", current_version_id: 7, creation_completed: true },
      "unpublished",
      "已下架",
    ],
    [
      { status: "draft", current_version_id: null, creation_completed: true },
      "draft",
      "草稿",
    ],
    [
      { status: "draft", current_version_id: null, creation_completed: false },
      "creating",
      "创建中",
    ],
    [
      { status: "archived", current_version_id: 7, creation_completed: true },
      "archived",
      "已归档",
    ],
  ])("maps lifecycle state without conflating draft and unpublish", (agent, state, label) => {
    expect(resolveAgentLifecycle(agent)).toMatchObject({ state, label });
  });

  it("does not treat private Agents without a published version as unpublished", () => {
    expect(
      resolveAgentLifecycle({
        status: "private",
        current_version_id: null,
        creation_completed: true,
      }).state,
    ).toBe("draft");
  });
});
