import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(join(process.cwd(), "src/modules/agent-distribution/distribution-launcher.tsx"), "utf8");

describe("global distribution entry", () => {
  it("selects from the existing Agent query and enters the existing distribution route", () => {
    expect(source).toContain("useAgents()");
    expect(source).toContain("/assets/${agent.id}/distribution");
    expect(source).toContain("此处不创建新的发布流程");
    expect(source).not.toContain("DEMO_AGENTS");
  });
});
