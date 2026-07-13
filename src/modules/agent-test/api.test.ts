import { describe, expect, it } from "vitest";
import type { Agent } from "@/modules/agents/types";
import { buildSimulationPayload, getDemoSimulationResponse } from "./api";
import { DEFAULT_TEST_SCENARIOS } from "./types";

const agent: Agent = {
  id: 32,
  uuid: "agent-32",
  code: "lin-yue",
  name: "林月",
  description: "陪伴型 Agent",
  model: "qwen-max",
  status: "active",
  agent_type: "cloud",
  edge_status: "online",
  memory_enabled: true,
  knowledge_base_id: 8,
  version: 3,
  system_prompt: "保持温柔并明确安全边界。",
  config: {
    examples: [{ role: "user", content: "今天有点累" }],
    skills: ["realtime_weather"],
  },
};

describe("Agent test simulation", () => {
  it("builds the existing simulate payload with saved Agent context", () => {
    const payload = buildSimulationPayload(agent, "  你好  ", [
      { id: "1", role: "assistant", content: "你好" },
    ]);
    expect(payload).toEqual({
      content: "你好",
      messages: [{ role: "assistant", content: "你好" }],
      system_prompt: "保持温柔并明确安全边界。",
      examples: [{ role: "user", content: "今天有点累" }],
      skills: ["realtime_weather"],
    });
  });

  it("returns deterministic demo replies without request state", () => {
    const scenario = DEFAULT_TEST_SCENARIOS.find((item) => item.id === "boundary")!;
    const first = getDemoSimulationResponse(scenario, "可以亲密一点吗？");
    const second = getDemoSimulationResponse(scenario, "可以亲密一点吗？");
    expect(first.content).toBe(second.content);
    expect(first.content).toContain("不会");
    expect(first.model).toBe("demo-fixture");
  });
});
