import { describe, expect, it } from "vitest";
import { DEMO_AGENTS } from "@/fixtures/demo-data";
import {
  DEMO_SHARE_LINK,
  buildAgentVersionConfigExport,
  buildAgentVersionConfigFilename,
  buildDistributionChannels,
  buildPublicAgentCard,
  resolveShareUrl,
} from "./model";

describe("distribution model", () => {
  const agent = DEMO_AGENTS[0];

  it("maps the live public share link without inventing other live channels", () => {
    const channels = buildDistributionChannels(agent, {
      demo: false,
      shareLink: DEMO_SHARE_LINK,
    });
    expect(channels.find((item) => item.id === "web-chat")?.status).toBe(
      "running",
    );
    expect(channels.find((item) => item.id === "oyiioyii")?.status).toBe(
      "unpublished",
    );
  });

  it("uses an explicit host fallback only when the API omits share_url", () => {
    expect(
      resolveShareUrl(
        { ...DEMO_SHARE_LINK, share_url: undefined },
        "https://chat.example.com/",
      ),
    ).toBe("https://chat.example.com/sharedAgent/lin-yue-demo");
  });

  it("exports only public Agent Card fields", () => {
    const card = buildPublicAgentCard(
      agent,
      DEMO_SHARE_LINK,
      "2026-07-10T12:00:00.000Z",
    );
    expect(card.agent.name).toBe("林月");
    expect(card.distribution.share_url).toContain("sharedAgent");
    expect(JSON.stringify(card)).not.toContain("system_prompt");
    expect(JSON.stringify(card)).not.toContain("knowledge_base_id");
  });

  it("builds a Client-independent current-version config export without secrets", () => {
    const payload = buildAgentVersionConfigExport(
      agent,
      {
        id: 18,
        agent_id: agent.id,
        version_no: 3,
        version_hash: "abc123",
        hash_schema_version: 1,
        config_snapshot: {
          system_prompt: "Be helpful",
          llm_api_key: "secret-value",
          nested: { accessToken: "secret-token", credential_ref: "cred-1" },
        },
        resource_manifest: { knowledge: [12], private_key: "secret-key" },
        required_capabilities: ["knowledge.search"],
        change_summary: null,
        release_note: "稳定版本",
        availability: "available",
        created_by: 2,
        created_at: "2026-07-18T12:00:00.000Z",
      },
      "线下演示",
      "2026-07-20T12:00:00.000Z",
    );

    expect(payload.version.config).toMatchObject({
      system_prompt: "Be helpful",
      nested: { credential_ref: "cred-1" },
    });
    expect(payload.version.resources).toEqual({ knowledge: [12] });
    expect(payload.version.required_capabilities).toEqual(["knowledge.search"]);
    expect(payload.export_note).toBe("线下演示");
    expect(JSON.stringify(payload)).not.toContain("secret-value");
    expect(JSON.stringify(payload)).not.toContain("secret-token");
    expect(JSON.stringify(payload)).not.toContain("secret-key");
  });

  it("creates a safe filename for the exported config", () => {
    expect(
      buildAgentVersionConfigFilename(agent, {
        id: 18,
        agent_id: agent.id,
        version_no: 3,
        version_hash: "abc123",
        hash_schema_version: 1,
        config_snapshot: {},
        resource_manifest: {},
        required_capabilities: [],
        change_summary: null,
        release_note: "",
        availability: "available",
        created_by: 2,
        created_at: "2026-07-18T12:00:00.000Z",
      }),
    ).toMatch(/-v3-config\.json$/);
  });
});
