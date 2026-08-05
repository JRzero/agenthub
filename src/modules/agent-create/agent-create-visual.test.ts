import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(join(process.cwd(), "src/modules/agent-create/agent-create-workspace.tsx"), "utf8");

describe("guided Agent creation V1 skin", () => {
  it("preserves the four existing steps and field order", () => {
    expect(source).toContain('["basic", "avatar", "character-sheet", "skills"]');
    const labels = ["Agent 名称", "角色是谁", "与用户的关系", "主要互动", "性格与表达"];
    labels.reduce((position, label) => {
      const next = source.indexOf(label, position + 1);
      expect(next).toBeGreaterThan(position);
      return next;
    }, -1);
  });

  it("keeps creation on the page and preserves save actions", () => {
    expect(source).not.toContain("CreateAgentDialog");
    expect(source).toContain("保存并退出");
    expect(source).toContain("确认并创建头像");
    expect(source).toContain("完成创建");
  });
});
