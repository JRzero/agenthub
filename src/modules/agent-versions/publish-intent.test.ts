import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  buildPublishIntentPath,
  hasMatchingPublishIntent,
  PUBLISH_INTENT_PARAM,
  removePublishIntent,
} from "./publish-intent";

describe("Build to Versions publish intent", () => {
  it("builds an intent scoped to the current Agent", () => {
    expect(buildPublishIntentPath(32)).toBe(
      "/assets/32/versions?publishIntent=32",
    );
  });

  it("accepts only an exact current-Agent match", () => {
    expect(hasMatchingPublishIntent(new URLSearchParams("publishIntent=32"), 32)).toBe(true);
    expect(hasMatchingPublishIntent(new URLSearchParams("publishIntent=31"), 32)).toBe(false);
    expect(hasMatchingPublishIntent(new URLSearchParams("publishIntent=true"), 32)).toBe(false);
    expect(hasMatchingPublishIntent(new URLSearchParams(), 32)).toBe(false);
  });

  it("removes only the consumed intent and preserves unrelated query state", () => {
    const cleaned = removePublishIntent(
      new URLSearchParams("tab=history&publishIntent=32&filter=current"),
    );
    const params = new URLSearchParams(cleaned);

    expect(params.has(PUBLISH_INTENT_PARAM)).toBe(false);
    expect(params.get("tab")).toBe("history");
    expect(params.get("filter")).toBe("current");
  });

  it("wires continuation and one-time replacement without changing publish authority", () => {
    const buildSource = readFileSync(
      join(process.cwd(), "src/modules/agent-build/build-workspace.tsx"),
      "utf8",
    );
    const versionsSource = readFileSync(
      join(process.cwd(), "src/modules/agent-versions/versions-workspace.tsx"),
      "utf8",
    );

    expect(buildSource).toContain("if (publishCheck.canContinue)");
    expect(buildSource).toContain("router.push(buildPublishIntentPath(agentId))");
    expect(versionsSource).toContain("publishIntentConsumedRef.current = true");
    expect(versionsSource).toContain("router.replace(");
    expect(versionsSource).toContain("openPublish();");
    expect(versionsSource.match(/onClick={openPublish}/g)?.length).toBeGreaterThanOrEqual(2);
    expect(versionsSource).toContain("onPublish={() => void submitPublish()}");
  });
});
