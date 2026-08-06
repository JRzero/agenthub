import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(join(process.cwd(), "src/modules/workbench/workbench.tsx"), "utf8");

describe("workbench V1 composition", () => {
  it("uses an Agent stage, honest summary, and recent continuation backed by Agent data", () => {
    expect(source).toContain('aria-label="Agent 舞台"');
    expect(source).toContain('aria-label="当前 Agent 详情"');
    expect(source).toContain('aria-label="Agent 状态汇总"');
    expect(source).toContain("最近继续");
    expect(source).toContain("deriveWorkbenchTasks(agents)");
    expect(source).toContain("countAgentLifecycles(agents)");
    expect(source).toContain("selectWorkbenchStage(orderedAgents, selectedId)");
    expect(source).toContain('data-testid="workbench-agent-hero"');
    expect(source).toContain("<StageFocusCard agent={focusAgent}");
    expect(source).toContain("<AgentArtwork agent={agent}");
  });

  it("supports adjacent Agent selection without adding fake visual data", () => {
    expect(source).toContain('aria-label="上一个 Agent"');
    expect(source).toContain('aria-label="下一个 Agent"');
    expect(source).toContain("<StageSideCard agent={stage.previous}");
    expect(source).toContain("<StageSideCard agent={stage.next}");
    expect(source).toContain("orderedAgents.length === 2");
    expect(source).not.toContain("DEMO_AGENTS");
    expect(source).not.toContain("fake");
  });

  it("does not fabricate analytics or revenue metrics", () => {
    expect(source).not.toContain("demoMetrics");
    expect(source).not.toContain("活跃用户");
    expect(source).not.toContain("积分收入");
    expect(source).not.toContain("今日表现");
  });

  it("keeps empty, loading, and error states honest", () => {
    expect(source).toContain('<LoadingState label="正在加载工作台…" />');
    expect(source).toContain('<ErrorState message={query.error.message}');
    expect(source).toContain("从第一个 Agent 开始");
    expect(source).toContain("query.refetch()");
  });
});
