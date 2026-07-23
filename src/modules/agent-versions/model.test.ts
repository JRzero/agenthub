import { describe, expect, it } from "vitest";
import type { Agent } from "@/modules/agents/types";
import { ApiError } from "@/shared/api/http-client";
import {
  buildCurrentVersion,
  buildDemoVersionHistory,
  compareVersions,
  countSkillReferences,
  createDemoDraft,
  resolveDraftBaseVersionNumber,
  resolveVersionResourceCounts,
  resolveVersionSummary,
  resolveVersionPublisher,
  versionErrorMessage,
} from "./model";

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
  it("turns draft conflicts into an actionable publish message", () => {
    expect(
      versionErrorMessage(
        new ApiError("Draft revision changed", 409, "DRAFT_CONFLICT"),
      ),
    ).toBe(
      "草稿内容已被其他操作更新，已刷新最新状态。请检查后重新发布。",
    );
  });

  it("maps the live Agent into a current snapshot", () => {
    const current = buildCurrentVersion(agent);
    expect(current.label).toBe("v3.0");
    expect(current.snapshot.skills).toEqual(["weather", "image"]);
  });

  it("counts stage-bound skills together with legacy configured skills", () => {
    expect(
      countSkillReferences(["weather_api", "gpt_image"], [
        { id: 7, skill_id: 11, skill_name: "gpt_image" },
        { id: 8, skill_id: 12, skill_name: "nanobanana_image" },
      ]),
    ).toBe(3);
  });

  it("treats null skill collections from legacy version data as empty", () => {
    expect(countSkillReferences(null, null)).toBe(0);
  });

  it("reads knowledge, stage skills, and media from a version resource manifest", () => {
    expect(
      resolveVersionResourceCounts({
        id: 1,
        agent_id: 32,
        version_no: 4,
        version_hash: "hash",
        hash_schema_version: 1,
        config_snapshot: { config: { skills: ["weather_api"] } },
        resource_manifest: {
          skills: [
            { creator_skill_id: 7, skill_id: 11, name: "gpt_image" },
          ],
          knowledge_documents: [{ document_id: 3 }],
          media: [{ purpose: "avatar" }, { purpose: "character_design" }],
        },
        required_capabilities: [],
        change_summary: null,
        release_note: "",
        availability: "available",
        created_by: 2,
        created_at: "2026-07-21T00:00:00Z",
      }),
    ).toEqual({ knowledgeCount: 1, skillCount: 2, mediaCount: 2 });
  });

  it("builds ordered demo history without inventing live data", () => {
    const history = buildDemoVersionHistory(agent);
    expect(history.map((item) => item.version)).toEqual([3, 2, 1]);
    expect(history[0].status).toBe("current");
  });

  it("reports only actual field changes", () => {
    const [current, previous] = buildDemoVersionHistory(agent);
    const differences = compareVersions(previous, current);
    expect(
      differences.find((item) => item.field === "temperature")?.changed,
    ).toBe(true);
    expect(differences.find((item) => item.field === "model")?.changed).toBe(
      false,
    );
  });

  it("creates an isolated demo draft from a selected version", () => {
    const source = buildCurrentVersion(agent);
    const draft = createDemoDraft(source, 4);
    draft.snapshot.skills.push("new-skill");
    expect(draft.status).toBe("draft");
    expect(source.snapshot.skills).not.toContain("new-skill");
  });

  it("resolves a restored draft base id to its published version number", () => {
    expect(
      resolveDraftBaseVersionNumber(
        {
          version: 3,
          current_version_id: 103,
          draft_base_version_id: 101,
        },
        [
          { id: 103, version_no: 3 },
          { id: 101, version_no: 1 },
        ],
      ),
    ).toBe(1);

    expect(
      resolveDraftBaseVersionNumber(
        {
          version: 3,
          current_version_id: 103,
          draft_base_version_id: 103,
        },
        [],
      ),
    ).toBe(3);
  });

  it("resolves the publisher name without exposing the numeric creator id", () => {
    expect(
      resolveVersionPublisher({
        created_by: 2,
        created_by_name: "Alice Chen",
      }),
    ).toBe("Alice Chen");

    expect(
      resolveVersionPublisher(
        { created_by: 2 },
        {
          id: 2,
          uuid: "creator-2",
          username: "alice",
          email: "alice@example.com",
          status: "active",
          metadata: { full_name: "Alice" },
        },
      ),
    ).toBe("Alice");

    expect(
      resolveVersionPublisher(
        { created_by: 9 },
        {
          id: 2,
          uuid: "creator-2",
          username: "alice",
          email: "alice@example.com",
          status: "active",
        },
      ),
    ).toBe("未知用户");
  });
  it("uses a dash when a version has no user-facing summary", () => {
    expect(resolveVersionSummary("首次发布", null)).toBe("首次发布");
    expect(resolveVersionSummary("", { summary: "优化角色表达" })).toBe(
      "优化角色表达",
    );
    expect(resolveVersionSummary("", { base_version_id: null })).toBe("-");
    expect(resolveVersionSummary("   ", { summary: "   " })).toBe("-");
  });
});
