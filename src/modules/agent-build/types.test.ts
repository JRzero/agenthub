import { describe, expect, it } from "vitest";
import {
  createBuildDraft,
  draftsEqual,
  serializeBuildDraft,
  validateBuildDraft,
  type BuildAgent,
} from "./types";

const agent: BuildAgent = {
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
  system_prompt: "温柔、敏锐，但不替用户做决定。",
  llm_provider_type: "openai",
  llm_model_name: "qwen-max",
  llm_temperature: 0.6,
  config: {
    examples: [{ role: "user", content: "今天有点累" }],
    skills: ["realtime_weather"],
    show_reasoning: false,
    show_tools: true,
  },
};

describe("Agent build draft", () => {
  it("maps the existing Agent contract into controlled editor values", () => {
    const draft = createBuildDraft(agent);
    expect(draft.name).toBe("林月");
    expect(draft.knowledgeBaseId).toBe(8);
    expect(draft.llmTemperature).toBe(0.6);
    expect(draft.showReasoning).toBe(false);
  });

  it("preserves system defaults instead of backfilling legacy runtime values", () => {
    const draft = createBuildDraft({
      ...agent,
      model: "gpt-4o",
      temperature: 0.7,
      llm_model_name: "",
      llm_temperature: null,
    });
    expect(draft.llmModelName).toBe("");
    expect(draft.llmTemperature).toBeNull();
    expect(serializeBuildDraft(draft)).toMatchObject({ llm_model_name: "", llm_temperature: null });
  });

  it("serializes only supported update fields and normalizes identifiers", () => {
    const draft = createBuildDraft(agent);
    draft.code = "  LIN-YUE-V2 ";
    draft.skills = [" realtime_weather ", ""];
    expect(serializeBuildDraft(draft, "draft")).toMatchObject({
      code: "lin-yue-v2",
      skills: ["realtime_weather"],
      status: "draft",
      knowledge_base_id: 8,
    });
  });

  it("blocks invalid identity and runtime values", () => {
    const draft = createBuildDraft(agent);
    draft.name = "";
    draft.code = "Invalid Code";
    draft.systemPrompt = "";
    draft.llmTemperature = 3;
    expect(validateBuildDraft(draft)).toEqual({
      name: "Agent 名称不能为空",
      code: "使用 2–64 位小写字母、数字、下划线或短横线",
      systemPrompt: "角色系统提示词不能为空",
      llmTemperature: "Temperature 必须位于 0–2",
    });
  });

  it("detects dirty state after a nested example change", () => {
    const saved = createBuildDraft(agent);
    const next = structuredClone(saved);
    next.examples[0].content = "新的示例";
    expect(draftsEqual(saved, next)).toBe(false);
    expect(draftsEqual(saved, structuredClone(saved))).toBe(true);
  });
});
