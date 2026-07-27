import { describe, expect, it } from "vitest";
import { DEMO_COMIC_DRAFTS } from "@/fixtures/demo-media-assets";
import type { Agent } from "@/modules/agents/types";
import { resolveBuildPreviewLayout } from "./build-layout";
import {
  buildDraftSimulationPayload,
  latestPreviewExchange,
} from "./build-preview-model";
import {
  latestRuntimeExchange,
  mapAgentMediaAssets,
  reduceMediaGenerationState,
  resolveGeneratedMediaUrl,
  resolveMediaCapabilityMap,
} from "./media-assets";
import {
  PROFESSIONAL_BUILD_GROUPS,
  getBuildLifecyclePath,
  resolveRequestedBuildSection,
} from "./professional-navigation";
import { createBuildDraft, serializeBuildDraft } from "./types";

const agent: Agent = {
  id: 32,
  uuid: "agent-32",
  code: "star-house",
  name: "星辰小筑",
  description: "儿童科普故事 Agent",
  model: "",
  status: "active",
  agent_type: "cloud",
  edge_status: "online",
  memory_enabled: true,
  version: 3,
  system_prompt: "用安全、积极的方式讲科普故事。",
  config: {
    opening_message: "今天想听什么故事？",
    metadata: {
      avatar: "avatar.png",
      character_design_spec: "蓝紫色科普角色",
      character_design_sheet: "sheet.png",
    },
  },
};

describe("professional Build contracts", () => {
  it("keeps grouped editor sections and lifecycle routes distinct", () => {
    expect(PROFESSIONAL_BUILD_GROUPS.map((group) => group.label)).toEqual([
      "身份与人设",
      "运行配置",
      "能力配置",
      "治理与发布",
    ]);
    const items = PROFESSIONAL_BUILD_GROUPS.flatMap((group) => group.items);
    expect(
      items.filter((item) => item.kind === "editor").map((item) => item.id),
    ).toEqual([
      "identity",
      "persona",
      "runtime",
      "skills",
      "knowledge",
      "memory",
      "media",
      "safety",
    ]);
    expect(
      items.filter((item) => item.kind === "route").map((item) => item.id),
    ).toEqual(["test", "versions"]);
    expect(items.map((item) => String(item.id))).not.toContain("motherland");
    expect(getBuildLifecyclePath(32, "test")).toBe("/assets/32/test");
  });

  it("safely migrates legacy Moments links to media assets", () => {
    expect(resolveRequestedBuildSection("moments")).toEqual({
      section: "media",
      momentsMigrated: true,
    });
    expect(resolveRequestedBuildSection("unknown")).toEqual({
      section: null,
      momentsMigrated: false,
    });
  });

  it("uses deterministic desktop widths for the collapsible preview", () => {
    expect(resolveBuildPreviewLayout(false)).toMatchObject({
      collapsed: false,
      desktopWidth: 280,
      gridClass: "lg:grid-cols-[184px_minmax(0,1fr)_280px]",
    });
    expect(resolveBuildPreviewLayout(true)).toMatchObject({
      collapsed: true,
      desktopWidth: 56,
      gridClass: "lg:grid-cols-[184px_minmax(0,1fr)_56px]",
    });
  });

  it("maps only the current Live character sheet and never synthesizes history", () => {
    const media = mapAgentMediaAssets(agent);
    expect(media.avatar?.status).toBe("saved");
    expect(media.characterSheets).toHaveLength(1);
    expect(media.characterSheets[0]).toMatchObject({
      kind: "character-sheet",
      specText: "蓝紫色科普角色",
      version: "v3",
    });
    expect(media.comicDrafts).toEqual([]);
  });

  it("resolves generated media urls before previewing candidates", () => {
    expect(resolveGeneratedMediaUrl("avatar.png", "avatar")).toBe("http://localhost:8080/api/v1/avatars/avatar.png");
    expect(resolveGeneratedMediaUrl("sheet.png", "character-sheet")).toBe("http://localhost:8080/api/v1/character-sheets/sheet.png");
    expect(resolveGeneratedMediaUrl("/api/v1/files/generated.png", "avatar")).toBe("http://localhost:8080/api/v1/files/generated.png");
    expect(resolveGeneratedMediaUrl("/images/lin-yue-avatar.png", "avatar")).toBe("/images/lin-yue-avatar.png");
  });

  it("keeps media actions independently sourced", () => {
    expect(resolveMediaCapabilityMap("live")).toEqual({
      avatarUpload: "live",
      avatarGeneration: "live",
      characterDesign: "live",
      assetLibrary: "unavailable",
      comicDrafts: "unavailable",
    });
    expect(new Set(Object.values(resolveMediaCapabilityMap("demo")))).toEqual(
      new Set(["demo"]),
    );
  });

  it("never serializes transient or Demo-only media state", () => {
    const draft = Object.assign(createBuildDraft(agent), {
      mediaCandidate: {
        kind: "avatar",
        url: "blob:candidate",
        state: "pending-confirmation",
      },
      mediaAssets: DEMO_COMIC_DRAFTS,
    });
    const payload = serializeBuildDraft(draft, 0);
    expect(payload).not.toHaveProperty("mediaCandidate");
    expect(payload).not.toHaveProperty("mediaAssets");
    expect(JSON.stringify(payload)).not.toContain("demo-comic");
  });

  it("projects only the latest Runtime exchange", () => {
    const messages = [
      { id: "u1", role: "user" },
      { id: "a1", role: "assistant" },
      { id: "tool", role: "tool" },
      { id: "u2", role: "user" },
      { id: "a2", role: "assistant" },
    ];
    expect(
      latestRuntimeExchange(messages).map((message) => message.id),
    ).toEqual(["u2", "a2"]);
  });

  it("previews the saved draft through simulation without creating a session", () => {
    const draft = createBuildDraft(agent);
    draft.examples = [{ role: "assistant", content: "欢迎提问" }];
    draft.skills = ["gpt_image"];
    const messages = [
      { id: "u1", role: "user" as const, content: "旧问题" },
      { id: "a1", role: "assistant" as const, content: "旧回答" },
      { id: "u2", role: "user" as const, content: "最近问题" },
      { id: "a2", role: "assistant" as const, content: "最近回答" },
    ];

    const latest = latestPreviewExchange(messages);
    expect(latest.map((message) => message.id)).toEqual(["u2", "a2"]);
    expect(buildDraftSimulationPayload(draft, "继续", latest)).toEqual({
      content: "继续",
      messages: [
        { role: "user", content: "最近问题" },
        { role: "assistant", content: "最近回答" },
      ],
      system_prompt: "用安全、积极的方式讲科普故事。",
      examples: [{ role: "assistant", content: "欢迎提问" }],
      skills: ["gpt_image"],
    });
  });

  it("keeps candidates pending until an explicit successful confirmation", () => {
    let state = reduceMediaGenerationState("idle", "start");
    expect(state).toBe("generating");
    state = reduceMediaGenerationState(state, "generated");
    expect(state).toBe("pending-confirmation");
    state = reduceMediaGenerationState(state, "confirm");
    expect(state).toBe("confirming");
    state = reduceMediaGenerationState(state, "failed");
    expect(state).toBe("failed");
    state = reduceMediaGenerationState(state, "confirm");
    expect(reduceMediaGenerationState(state, "confirmed")).toBe("saved");
  });
});
