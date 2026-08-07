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
    expect(source).toContain('data-testid={`workbench-carousel-card-${agent.id}`}');
    expect(source).toContain("<LayeredStageCard");
    expect(source).toContain("<AgentArtwork agent={agent}");
  });

  it("supports adjacent Agent selection without adding fake visual data", () => {
    expect(source).toContain('aria-label="上一个 Agent"');
    expect(source).toContain('aria-label="下一个 Agent"');
    expect(source).toContain("agents.map((agent)");
    expect(source).toContain("circularAgentSlot(agentIds, visualFocusId, agent.id)");
    expect(source).toContain("Math.abs(committedSlot) <= 2 || Math.abs(visualSlot) <= 2");
    expect(source).not.toContain("DEMO_AGENTS");
    expect(source).not.toContain("fake");
  });

  it("uses persistent per-Agent layered nodes without fading or keyed group replacement", () => {
    expect(source).toContain("useWorkbenchAgentTransition(orderedAgentIds)");
    expect(source).toContain("data-transition-phase={transition.phase}");
    expect(source).toContain("requestManualRelative(-1)");
    expect(source).toContain("requestManualRelative(1)");
    expect(source).toContain('data-testid="workbench-carousel-viewport"');
    expect(source).toContain('data-testid="workbench-carousel-layer"');
    expect(source).toContain("key={agent.id}");
    expect(source).not.toContain('key={`${transition.displayedId}-${transition.targetId}-${transition.direction}`}');
    expect(source).toContain("transition.phase === \"sliding\"");
    expect(transitionStyles).toContain("720ms cubic-bezier(0.42, 0, 0.58, 1)");
    expect(transitionStyles).toContain("z-index 720ms linear");
    expect(transitionStyles).toContain("translate3d(calc(-50% + var(--slot-x)), 0, 0) scale(var(--slot-scale))");
    expect(transitionStyles).toContain("width: min(326px, calc(100% - 72px))");
    expect(transitionStyles).toContain('--slot-x: -210px');
    expect(transitionStyles).toContain('--slot-x: 210px');
    expect(transitionStyles).toContain('--slot-x: -324px');
    expect(transitionStyles).toContain('--slot-x: 324px');
    expect(transitionStyles).not.toContain("opacity:");
    expect(transitionStyles).not.toMatch(/transition[^;]*(width|height|top|left)/);
  });

  it("meets the desktop near and far exposure bands", () => {
    const centerWidth = 326;
    const nearWidth = centerWidth * 0.86;
    const farWidth = centerWidth * 0.68;
    const centerRight = centerWidth / 2;
    const nearRight = 210 + nearWidth / 2;
    const farRight = 324 + farWidth / 2;
    const nearExposure = (nearRight - centerRight) / nearWidth;
    const farExposure = (farRight - nearRight) / farWidth;

    expect(nearExposure).toBeGreaterThanOrEqual(0.58);
    expect(nearExposure).toBeLessThanOrEqual(0.68);
    expect(farExposure).toBeGreaterThanOrEqual(0.28);
    expect(farExposure).toBeLessThanOrEqual(0.4);
  });

  it("provides silent autoplay without changing carousel identity", () => {
    expect(source).toContain("useWorkbenchAutoplay({");
    expect(source).toContain("onMouseEnter={() => setStageHovered(true)}");
    expect(source).toContain("onFocusCapture={() => setStageFocusWithin(true)}");
    expect(source).toContain("requestManualRelative(-1)");
    expect(source).toContain("requestManualRelative(1)");
    expect(source).toContain("key={agent.id}");
    expect(source).not.toContain("workbench-autoplay-toggle");
    expect(source).not.toContain("暂停自动轮播");
    expect(source).not.toContain("继续自动轮播");
    expect(source).not.toContain("autoplayPaused");
  });

  it("keeps stage geometry stable and makes reduced motion effectively instant", () => {
    expect(source).toContain("const stableStageHeight = tasks.length > 0 ? 522 : 460");
    expect(source.match(/minHeight: stableStageHeight/g)).toHaveLength(2);
    expect(transitionStyles).toContain("@media (prefers-reduced-motion: reduce)");
    expect(transitionStyles).toContain("transition-duration: 0.01ms");
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
