import { describe, expect, it } from "vitest";
import { isSkillAttached } from "./use-skills-library";

describe("skill attachment guard", () => {
  it("prevents submitting a skill that is already attached", () => {
    expect(isSkillAttached(["知识检索", "联网搜索"], "知识检索")).toBe(true);
    expect(isSkillAttached(["知识检索"], "图片生成")).toBe(false);
  });
});
