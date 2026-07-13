import { describe, expect, it } from "vitest";
import { DEMO_AGENTS } from "@/fixtures/demo-data";
import {
  DEMO_SHARE_LINK,
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
    expect(channels.find((item) => item.id === "web-chat")?.status).toBe("running");
    expect(channels.find((item) => item.id === "oyiioyii")?.status).toBe("unpublished");
  });

  it("uses an explicit host fallback only when the API omits share_url", () => {
    expect(resolveShareUrl({ ...DEMO_SHARE_LINK, share_url: undefined }, "https://chat.example.com/"))
      .toBe("https://chat.example.com/sharedAgent/lin-yue-demo");
  });

  it("exports only public Agent Card fields", () => {
    const card = buildPublicAgentCard(agent, DEMO_SHARE_LINK, "2026-07-10T12:00:00.000Z");
    expect(card.agent.name).toBe("林月");
    expect(card.distribution.share_url).toContain("sharedAgent");
    expect(JSON.stringify(card)).not.toContain("system_prompt");
    expect(JSON.stringify(card)).not.toContain("knowledge_base_id");
  });
});
