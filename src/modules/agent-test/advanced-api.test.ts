import { describe, expect, it } from "vitest";
import type { Agent } from "@/modules/agents/types";
import { buildSimulationPayload } from "./api";

const agent = { id: 1, uuid: "a", code: "a", name: "Agent", description: "", model: "m", status: "active", agent_type: "cloud", edge_status: "offline", memory_enabled: true, knowledge_base_id: null, version: 1 } as Agent;

describe("advanced simulation payload", () => {
  it("maps attachments and widget metadata without changing history", () => {
    const payload = buildSimulationPayload(agent, "分析", [{ id: "1", role: "assistant", content: "上下文" }], [{ type: "file", token: "doc", widget_id: "upload", skill_id: "knowledge" }], { custom_fields: { tone: "brief" } });
    expect(payload.attachments).toEqual([{ type: "file", token: "doc", widget_id: "upload", skill_id: "knowledge" }]);
    expect(payload.metadata).toEqual({ custom_fields: { tone: "brief" } });
    expect(payload.messages).toEqual([{ role: "assistant", content: "上下文" }]);
  });
});
