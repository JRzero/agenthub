import { describe, expect, it } from "vitest";
import { mapAgentToAssetOverview } from "./model";
import type { Agent } from "@/modules/agents/types";

const agent: Agent = {
  id: 1,
  uuid: "agent-1",
  code: "guide",
  name: "知识向导",
  description: "有完整知识配置",
  model: "model-a",
  status: "active",
  agent_type: "cloud",
  edge_status: "online",
  memory_enabled: true,
  knowledge_base_id: 3,
  version: 2,
  system_prompt: "回答问题",
  config: {
    examples: [{ role: "user", content: "你好" }],
    skills: ["search"],
    metadata: { avatar: "avatar.png" },
  },
};

describe("Agent Asset overview mapping", () => {
  it("derives asset composition from live Agent fields", () => {
    const overview = mapAgentToAssetOverview(agent);
    expect(overview.versionLabel).toBe("v2.0");
    expect(overview.completenessSource).toBe("derived");
    expect(overview.sections.find((section) => section.id === "knowledge")?.score).toBe(100);
    expect(overview.sections.find((section) => section.id === "memory")?.score).toBe(80);
    expect(overview.sections.find((section) => section.id === "safety")?.state).toBe("unavailable");
  });

  it("does not present missing backend configuration as complete", () => {
    const overview = mapAgentToAssetOverview({
      ...agent,
      knowledge_base_id: null,
      memory_enabled: false,
      config: {},
    });
    expect(overview.sections.find((section) => section.id === "knowledge")?.score).toBe(0);
    expect(overview.sections.find((section) => section.id === "skills")?.score).toBe(0);
    expect(overview.completeness).toBeLessThan(100);
  });
});
