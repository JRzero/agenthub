import { describe, expect, it } from "vitest";
import { buildCurrentVersionConfigExport } from "./current-version-export";

describe("current version configuration export", () => {
  it("exports the published snapshot without requiring a Client", () => {
    const result = buildCurrentVersionConfigExport({
      agentId: 28,
      agentName: "星辰小筑",
      note: "  线下备份  ",
      exportedAt: "2026-07-21T03:00:00.000Z",
      version: {
        id: 72,
        agent_id: 28,
        version_no: 2,
        version_hash: "cca50c91ef1f1234",
        hash_schema_version: 1,
        config_snapshot: { name: "星辰小筑", skills: ["gpt_image"] },
        resource_manifest: { skills: ["gpt_image"] },
        required_capabilities: ["image_generation"],
        change_summary: null,
        release_note: "增加图片能力",
        availability: "available",
        created_by: 2,
        created_at: "2026-07-21T02:00:00.000Z",
      },
    });

    expect(result).toMatchObject({
      format: "agenthub-current-version-config",
      format_version: 1,
      exported_at: "2026-07-21T03:00:00.000Z",
      export_note: "线下备份",
      agent: { id: 28, name: "星辰小筑" },
      version: {
        id: 72,
        version_no: 2,
        version_hash: "cca50c91ef1f1234",
      },
      config_snapshot: { name: "星辰小筑", skills: ["gpt_image"] },
      resource_manifest: { skills: ["gpt_image"] },
      required_capabilities: ["image_generation"],
    });
    expect(result).not.toHaveProperty("client");
  });
});
