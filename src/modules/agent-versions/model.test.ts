import { describe, expect, it } from "vitest";
import type { Agent } from "@/modules/agents/types";
import { buildCurrentVersion, buildDemoVersionHistory, compareVersions, createDemoDraft } from "./model";

const agent: Agent = {
  id: 32,
  uuid: "demo",
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
  system_prompt: "温柔而有边界",
  temperature: 0.7,
  config: { skills: ["weather", "image"] },
};

describe("Agent version model", () => {
  it("maps the live Agent into a current snapshot", () => {
    const current = buildCurrentVersion(agent);
    expect(current.label).toBe("v3.0");
    expect(current.snapshot.skills).toEqual(["weather", "image"]);
  });

  it("builds ordered demo history without inventing live data", () => {
    const history = buildDemoVersionHistory(agent);
    expect(history.map((item) => item.version)).toEqual([3, 2, 1]);
    expect(history[0].status).toBe("current");
  });

  it("reports only actual field changes", () => {
    const [current, previous] = buildDemoVersionHistory(agent);
    const differences = compareVersions(previous, current);
    expect(differences.find((item) => item.field === "temperature")?.changed).toBe(true);
    expect(differences.find((item) => item.field === "model")?.changed).toBe(false);
  });

  it("creates an isolated demo draft from a selected version", () => {
    const source = buildCurrentVersion(agent);
    const draft = createDemoDraft(source, 4);
    draft.snapshot.skills.push("new-skill");
    expect(draft.status).toBe("draft");
    expect(source.snapshot.skills).not.toContain("new-skill");
  });
});
