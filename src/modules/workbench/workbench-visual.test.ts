import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(join(process.cwd(), "src/modules/workbench/workbench.tsx"), "utf8");

describe("workbench V1 composition", () => {
  it("uses creation-first sections backed by Agent data", () => {
    expect(source).toContain("继续创作");
    expect(source).toContain("最近 Agent");
    expect(source).toContain("待处理事项");
    expect(source).toContain("deriveWorkbenchTasks(agents)");
  });

  it("does not fabricate analytics or revenue metrics", () => {
    expect(source).not.toContain("demoMetrics");
    expect(source).not.toContain("活跃用户");
    expect(source).not.toContain("积分收入");
    expect(source).not.toContain("今日表现");
  });
});
