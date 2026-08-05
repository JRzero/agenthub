import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const assetHeaderSource = readFileSync(
  join(process.cwd(), "src/modules/agent-assets/asset-workspace-header.tsx"),
  "utf8",
);
const sourceBadgeSource = readFileSync(
  join(process.cwd(), "src/shared/ui/source-badge.tsx"),
  "utf8",
);
const stylesheet = readFileSync(
  join(process.cwd(), "src/app/globals.css"),
  "utf8",
);

describe("scoped status label theme", () => {
  it("uses the dedicated live treatment without changing other source badges", () => {
    expect(sourceBadgeSource).toContain(
      'live: { label: "实时数据", className: "status-live" }',
    );
    expect(sourceBadgeSource).toContain(
      'demo: { label: "演示数据", className: "status-warning" }',
    );
  });

  it("limits the draft treatment to the current-draft label", () => {
    expect(assetHeaderSource).toContain(
      '<span className="status-badge status-draft">',
    );
    expect(assetHeaderSource).toContain("当前草稿 · {draftBaseLabel}");
  });

  it("uses dark semantic surfaces and thin inset borders", () => {
    expect(stylesheet).toMatch(
      /\.status-live,[\s\S]*?\.status-saved\s*\{[\s\S]*?--color-status-positive-bg[\s\S]*?--color-success[\s\S]*?inset 0 0 0 1px var\(--color-status-positive-border\)/,
    );
    expect(stylesheet).toMatch(
      /\.status-draft\s*\{[\s\S]*?--color-status-draft-bg[\s\S]*?--color-warning[\s\S]*?inset 0 0 0 1px var\(--color-status-draft-border\)/,
    );
  });
});
