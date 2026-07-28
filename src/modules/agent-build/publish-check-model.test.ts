import { describe, expect, it } from "vitest";
import type { AgentClient } from "@/modules/agent-versions/types";
import type { PublishTestSummary } from "@/modules/agent-test/publish-test-summary";
import {
  derivePublishCheck,
  resolvePublishActionState,
} from "./publish-check-model";
import type { AgentBuildDraft } from "./types";

const draft: AgentBuildDraft = {
  code: "agent-1",
  name: "冷冷",
  description: "冷漠无言的陪护",
  systemPrompt: "保持冷静、尊重用户并明确安全边界。",
  openingMessage: "有何贵干？",
  examples: [],
  skills: [],
  knowledgeBaseId: 8,
  memoryEnabled: false,
  agentType: "cloud",
  llmProvider: "",
  llmProviderType: "",
  llmBaseUrl: "",
  llmModelName: "",
  llmTemperature: null,
  showReasoning: true,
  showTools: true,
  hidden: false,
};

const testSummary: PublishTestSummary = {
  agentId: 1,
  draftRevision: 3,
  scenarioId: "boundary",
  passed: 5,
  total: 5,
  safetyPassed: true,
  generatedAt: "2026-07-28T08:00:00.000Z",
  evaluation: {
    overall: 92,
    status: "good",
    passed: 5,
    partial: 0,
    metrics: [],
    generatedAt: "2026-07-28T08:00:00.000Z",
    source: "derived",
  },
};

const client = (status: AgentClient["status"]): AgentClient => ({
  id: status === "enabled" ? 1 : 2,
  uuid: `client-${status}`,
  agent_id: 1,
  client_key: status,
  client_type: "web_chat",
  name: status,
  status,
  config: null,
  capability_manifest: null,
  capability_hash: "hash",
  created_at: "2026-07-28T08:00:00.000Z",
  updated_at: "2026-07-28T08:00:00.000Z",
});

function derive(
  patch: Partial<Parameters<typeof derivePublishCheck>[0]> = {},
) {
  return derivePublishCheck({
    draft,
    dirty: false,
    knowledgeBases: [{ id: 8, name: "角色知识库" }],
    knowledgeLoading: false,
    knowledgeError: false,
    testSummary,
    clients: [client("enabled"), client("disabled")],
    clientsLoading: false,
    clientsError: false,
    ...patch,
  });
}

describe("Build publish check", () => {
  it("returns the four fixed categories in product order", () => {
    const result = derive();
    expect(result.items.map((item) => item.label)).toEqual([
      "基础配置",
      "能力与资源",
      "测试与安全",
      "线上影响",
    ]);
    expect(result.canContinue).toBe(true);
    expect(result.items[3]).toMatchObject({
      status: "1 个 Client",
      blocking: false,
    });
  });

  it("routes missing system prompt to persona and blocks publishing", () => {
    const result = derive({
      draft: { ...draft, systemPrompt: "" },
    });
    expect(result.items[0]).toMatchObject({
      state: "blocked",
      detail: "角色系统提示词不能为空",
      action: { kind: "section", target: "persona" },
    });
    expect(result.canContinue).toBe(false);
  });

  it("blocks unavailable selected resources without claiming Live success", () => {
    const result = derive({ knowledgeBases: [] });
    expect(result.items[1]).toMatchObject({
      state: "blocked",
      detail: "已绑定的知识库不可用",
      action: { kind: "section", target: "knowledge" },
    });
  });

  it("shows honest pending and unavailable resource states", () => {
    expect(derive({ knowledgeLoading: true }).items[1]).toMatchObject({
      state: "pending",
      status: "检查中",
    });
    expect(derive({ knowledgeError: true }).items[1]).toMatchObject({
      state: "informational",
      status: "暂无法确认",
    });
  });

  it("does not treat missing test evidence as passed", () => {
    const result = derive({ testSummary: null });
    expect(result.items[2]).toMatchObject({
      state: "informational",
      status: "尚未测试",
      blocking: false,
      action: { kind: "test" },
    });
  });

  it("blocks a failed safety evaluation", () => {
    const result = derive({
      testSummary: { ...testSummary, passed: 4, safetyPassed: false },
    });
    expect(result.items[2]).toMatchObject({
      state: "blocked",
      blocking: true,
    });
    expect(result.canContinue).toBe(false);
  });

  it("moves the publish action through check before continuing", () => {
    expect(
      resolvePublishActionState({
        publishCheckEnabled: false,
        panelMode: "preview",
        dirty: false,
        saving: false,
        canContinue: true,
      }),
    ).toMatchObject({
      label: "发布为新版本",
      intent: "open-check",
      disabled: false,
    });
    expect(
      resolvePublishActionState({
        publishCheckEnabled: true,
        panelMode: "publish-check",
        dirty: false,
        saving: false,
        canContinue: true,
      }),
    ).toMatchObject({
      label: "继续发布",
      intent: "continue",
      disabled: false,
    });
    expect(
      resolvePublishActionState({
        publishCheckEnabled: true,
        panelMode: "publish-check",
        dirty: false,
        saving: false,
        canContinue: false,
      }).disabled,
    ).toBe(true);
  });
});
