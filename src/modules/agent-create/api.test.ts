import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Agent } from "@/modules/agents/types";
import type { CreatorSkill } from "@/modules/resources/types";
import {
  mapAgentToBasicRoleContent,
  completeAgentCreation,
  generateAvatarCandidate,
  generateBasicProfile,
  generateCharacterSheetCandidate,
  getAgentCreationProgress,
  saveBasicRoleContent,
  saveGuidedCreationSkills,
} from "./api";

const EXPECTED_API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const input = {
  name: "暖屿",
  identity: "温柔清醒的心理陪伴员",
  relationship: "愿意倾听和陪伴的朋友",
  primaryInteraction: "梳理情绪、温和提问",
  personalityTags: ["温和", "有同理心"],
};

const agent: Agent = {
  id: 28,
  uuid: "agent-test-28",
  code: "warm-island",
  name: "暖屿",
  description: "温和清醒的陪伴角色",
  model: "",
  status: "draft",
  agent_type: "cloud",
  edge_status: "offline",
  memory_enabled: false,
  version: 0,
  draft_revision: 2,
  system_prompt: "你是暖屿。",
  config: {
    system_prompt: "你是暖屿。",
    opening_message: "今天想聊些什么？",
    examples: [
      { role: "user", content: "我有点焦虑。" },
      { role: "assistant", content: "我们可以慢慢梳理。" },
    ],
  },
};

beforeEach(() => {
  vi.stubGlobal("localStorage", {
    getItem: vi.fn().mockReturnValue(null),
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("guided Agent creation API", () => {
  it("generates the basic profile through the guided creation endpoint", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({
      success: true,
      data: agent,
    }), { status: 201 }));

    await generateBasicProfile("et_test_key", "workspace-test", input);

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${EXPECTED_API_BASE}/api/v1/agents/generate-basic-profile`);
    expect(init?.headers).toMatchObject({
      "X-API-Key": "et_test_key",
      "X-Workspace-Code": "workspace-test",
    });
    expect(JSON.parse(String(init?.body))).toEqual({
      name: "暖屿",
      role_identity: "温柔清醒的心理陪伴员",
      user_relationship: "愿意倾听和陪伴的朋友",
      primary_interactions: "梳理情绪、温和提问",
      personality_tags: ["温和", "有同理心"],
    });
  });

  it("generates exactly one avatar preview candidate per request", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({
      success: true,
      data: { image_url: "https://cdn.example.test/avatar.png" },
    }), { status: 200 }));

    const candidate = await generateAvatarCandidate("et_test_key", 28, input, mapAgentToBasicRoleContent(agent));

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0][0]).toBe(`${EXPECTED_API_BASE}/api/v1/agents/28/avatar/generate-preview`);
    expect(candidate).toMatchObject({
      url: "https://cdn.example.test/avatar.png",
      sourceUrl: "https://cdn.example.test/avatar.png",
      alt: "暖屿 的头像候选",
    });
  });

  it("keeps the generated textual specification with the character-sheet candidate", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({
        success: true,
        data: { spec_text: "黑色长发，冷色服装，包含正侧背视图与三种表情。" },
      }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        success: true,
        data: { image_url: "https://cdn.example.test/character-sheet.png" },
      }), { status: 200 }));

    const candidate = await generateCharacterSheetCandidate("et_test_key", 28, input, mapAgentToBasicRoleContent(agent));

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(candidate).toMatchObject({
      url: "https://cdn.example.test/character-sheet.png",
      sourceUrl: "https://cdn.example.test/character-sheet.png",
      specText: "黑色长发，冷色服装，包含正侧背视图与三种表情。",
    });
  });

  it("queries progress and completes creation with the latest draft revision", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: true, data: {
        agent_id: 28, current_step: "skills", creation_completed: false, draft_revision: 3,
        steps: { basic_profile: true, avatar: true, character_sheet: true, skills: false },
      } }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: true, data: { ...agent, draft_revision: 4, creation_step: "complete", creation_completed: true } }), { status: 200 }));

    const progress = await getAgentCreationProgress("et_test_key", "workspace-test", 28);
    await completeAgentCreation("et_test_key", "workspace-test", 28, progress.draft_revision);

    expect(fetchMock.mock.calls[0][0]).toBe(`${EXPECTED_API_BASE}/api/v1/agents/28/creation-progress`);
    expect(fetchMock.mock.calls[1][0]).toBe(`${EXPECTED_API_BASE}/api/v1/agents/28/complete-creation`);
    expect(JSON.parse(String(fetchMock.mock.calls[1][1]?.body))).toEqual({ expected_draft_revision: 3 });
  });

  it("maps backend examples into an editable opening and example pairs", () => {
    expect(mapAgentToBasicRoleContent(agent)).toEqual({
      description: "温和清醒的陪伴角色",
      systemPrompt: "你是暖屿。",
      opening: "今天想聊些什么？",
      examples: [{ user: "我有点焦虑。", assistant: "我们可以慢慢梳理。" }],
    });
  });

  it("saves confirmed basic content with optimistic draft revision", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ success: true, data: agent }), { status: 200 }));

    await saveBasicRoleContent("et_test_key", "workspace-test", 28, 2, "暖屿", mapAgentToBasicRoleContent(agent));

    const [, init] = fetchMock.mock.calls[0];
    expect(JSON.parse(String(init?.body))).toMatchObject({
      expected_draft_revision: 2,
      name: "暖屿",
      description: "温和清醒的陪伴角色",
      system_prompt: "你是暖屿。",
      opening_message: "今天想聊些什么？",
    });
    expect(JSON.parse(String(init?.body)).examples).toEqual([
      { role: "user", content: "我有点焦虑。" },
      { role: "assistant", content: "我们可以慢慢梳理。" },
    ]);
  });

  it("persists selected resource-library skills through their actual stage endpoints", async () => {
    let nextRevision = 8;
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () =>
      new Response(JSON.stringify({
        success: true,
        data: { message: "ok", draft_revision: nextRevision++ },
      }), { status: 200 }),
    );
    const skills: CreatorSkill[] = [
      { id: 11, uuid: "pre-11", skill_id: 101, name: "图片上传", stage: "pre_conversation", status: "active", config: {} },
      { id: 12, uuid: "mid-12", skill_id: 102, name: "天气查询", stage: "mid_conversation", status: "active", config: {} },
    ];

    await expect(
      saveGuidedCreationSkills("et_test_key", 28, 7, skills),
    ).resolves.toBe(10);

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      `${EXPECTED_API_BASE}/api/v1/agents/28/pre-skills`,
      `${EXPECTED_API_BASE}/api/v1/agents/28/mid-skills`,
      `${EXPECTED_API_BASE}/api/v1/agents/28/post-skills`,
    ]);
    expect(fetchMock.mock.calls.map(([, init]) =>
      JSON.parse(String(init?.body)).expected_draft_revision,
    )).toEqual([7, 8, 9]);
  });
});
