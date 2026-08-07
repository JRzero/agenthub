import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(join(process.cwd(), "src/modules/workbench/workbench.tsx"), "utf8");
const transitionStyles = readFileSync(join(process.cwd(), "src/modules/workbench/workbench-transition.module.css"), "utf8");

describe("workbench V1 composition", () => {
  it("uses an Agent stage, honest summary, and recent continuation backed by Agent data", () => {
    expect(source).toContain('aria-label="Agent 舞台"');
    expect(source).toContain('aria-label="当前 Agent 详情"');
    expect(source).toContain('aria-label="Agent 状态汇总"');
    expect(source).toContain("最近继续");
    expect(source).toContain("deriveWorkbenchTasks(agents)");
    expect(source).toContain("countAgentLifecycles(agents)");
    expect(source).toContain("selectWorkbenchStage(orderedAgents, transition.displayedId)");
    expect(source).toContain('data-testid={primary ? "workbench-agent-hero" : undefined}');
    expect(source).toContain("<StageFocusCard agent={stage.focus}");
    expect(source).toContain("<AgentArtwork agent={agent}");
  });

  it("supports adjacent Agent selection without adding fake visual data", () => {
    expect(source).toContain('aria-label="上一个 Agent"');
    expect(source).toContain('aria-label="下一个 Agent"');
    expect(source).toContain("<StageSideCard agent={stage.previous}");
    expect(source).toContain("<StageSideCard agent={stage.next}");
    expect(source).toContain("agentCount === 2");
    expect(source).not.toContain("DEMO_AGENTS");
    expect(source).not.toContain("fake");
  });

  it("uses a persistent two-group horizontal track without fading the stage", () => {
    expect(source).toContain("useWorkbenchAgentTransition(orderedAgentIds)");
    expect(source).toContain("data-transition-phase={transition.phase}");
    expect(source).toContain("transition.requestRelative(-1)");
    expect(source).toContain("transition.requestRelative(1)");
    expect(source).toContain('data-testid="workbench-carousel-viewport"');
    expect(source).toContain('data-testid="workbench-carousel-track"');
    expect(source).toContain('key={`${transition.displayedId}-${transition.targetId}-${transition.direction}`}');
    expect(source).toContain("transition.phase === \"sliding\"");
    expect(transitionStyles).toContain("240ms cubic-bezier(0.22, 1, 0.36, 1)");
    expect(transitionStyles).toContain("translate3d(-50%, 0, 0)");
    expect(transitionStyles).not.toContain("opacity:");
    expect(transitionStyles).not.toMatch(/animation[^;]*(width|height|top|left)/);
  });

  it("keeps stage geometry stable and makes reduced motion effectively instant", () => {
    expect(source).toContain("const stableStageHeight = tasks.length > 0 ? 522 : 460");
    expect(source.match(/minHeight: stableStageHeight/g)).toHaveLength(2);
    expect(transitionStyles).toContain("@media (prefers-reduced-motion: reduce)");
    expect(transitionStyles).toContain("animation-duration: 0.01ms");
    expect(transitionStyles).not.toContain("transform: none");
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
