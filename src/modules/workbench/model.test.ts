import { describe, expect, it } from "vitest";
import { DEMO_AGENTS } from "@/fixtures/demo-data";
import { countAgentLifecycles, deriveWorkbenchTasks, orderWorkbenchAgents, readiness, selectWorkbenchStage, suggestAgentCode } from "./model";

describe("workbench model", () => {
  it("suggests a stable code without punctuation", () => {
    expect(suggestAgentCode("  Brand Guide 2.0  ")).toBe("brand-guide-2-0");
    expect(suggestAgentCode("品牌向导")).toMatch(/^agent-[a-z0-9]+$/);
  });

  it("derives actionable tasks from real Agent fields", () => {
    const tasks = deriveWorkbenchTasks(DEMO_AGENTS);
    expect(tasks.some((task) => task.agentName === "知识向导")).toBe(true);
    expect(tasks.every((task) => task.href.startsWith("/assets/"))).toBe(true);
  });

  it("calculates bounded readiness", () => {
    expect(readiness(DEMO_AGENTS[0])).toBeGreaterThan(50);
    expect(readiness(DEMO_AGENTS[0])).toBeLessThanOrEqual(100);
  });

  it("keeps stage neighbors honest for zero, one, two, and three Agents", () => {
    expect(selectWorkbenchStage([], null)).toEqual({ index: 0 });
    expect(selectWorkbenchStage([DEMO_AGENTS[0]], DEMO_AGENTS[0].id)).toMatchObject({ focus: DEMO_AGENTS[0], index: 0 });
    const pair = selectWorkbenchStage(DEMO_AGENTS, DEMO_AGENTS[0].id);
    expect(pair.focus?.id).toBe(DEMO_AGENTS[0].id);
    expect(pair.previous?.id).toBe(DEMO_AGENTS[1].id);
    expect(pair.next).toBeUndefined();
    const third = { ...DEMO_AGENTS[1], id: 77, name: "长名称".repeat(30), config: undefined };
    const trio = selectWorkbenchStage([...DEMO_AGENTS, third], DEMO_AGENTS[0].id);
    expect(new Set([trio.previous?.id, trio.focus?.id, trio.next?.id])).toEqual(new Set([19, 32, 77]));
  });

  it("orders existing artwork first without mutation and counts real lifecycle states", () => {
    const original = [...DEMO_AGENTS];
    expect(orderWorkbenchAgents(DEMO_AGENTS)[0].id).toBe(32);
    expect(DEMO_AGENTS).toEqual(original);
    expect(countAgentLifecycles(DEMO_AGENTS)).toMatchObject({ published: 1, draft: 1, creating: 0 });
  });
});
