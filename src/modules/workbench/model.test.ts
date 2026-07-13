import { describe, expect, it } from "vitest";
import { DEMO_AGENTS } from "@/fixtures/demo-data";
import { deriveWorkbenchTasks, readiness, suggestAgentCode } from "./model";

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
});
