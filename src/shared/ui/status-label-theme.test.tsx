import { readFileSync, readdirSync, statSync } from "node:fs";
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
const productionSources = readProductionSources(join(process.cwd(), "src"));
const productionSource = productionSources.join("\n");
const labelTags = productionSources.flatMap(
  (source) => source.match(/<(?:span|div)\b[^>]*status-badge[^>]*>/g) || [],
);

describe("global status label theme", () => {
  it("maps shared source and lifecycle labels to semantic variants", () => {
    expect(sourceBadgeSource).toContain(
      'live: { label: "实时数据", className: "status-live" }',
    );
    expect(sourceBadgeSource).toContain(
      'demo: { label: "演示数据", className: "status-warning" }',
    );
    expect(productionSource).toContain(
      'running: { label: "运行中", className: "status-info" }',
    );
    expect(productionSource).toContain(
      'draft: { label: "草稿", className: "status-warning" }',
    );
  });

  it("limits the draft treatment to the current-draft label", () => {
    expect(assetHeaderSource).toContain(
      '<span className="status-badge status-draft">',
    );
    expect(assetHeaderSource).toContain("当前草稿 · {draftBaseLabel}");
  });

  it.each(["success", "warning", "info", "danger", "neutral"])(
    "uses a dark semantic surface and thin border for %s",
    (variant) => {
      expect(stylesheet).toContain(
        `background: var(--color-status-${variant}-bg);`,
      );
      expect(stylesheet).toContain(
        `color: var(--color-status-${variant}-text);`,
      );
      expect(stylesheet).toContain(
        `box-shadow: inset 0 0 0 1px var(--color-status-${variant}-border);`,
      );
    },
  );

  it("keeps live, saved, and draft as compatibility aliases", () => {
    expect(stylesheet).toMatch(
      /\.status-success,\s*\.status-live,\s*\.status-saved\s*\{/,
    );
    expect(stylesheet).toMatch(
      /\.status-warning,\s*\.status-draft\s*\{/,
    );
  });

  it("covers the complete inventory and rejects light or ad hoc label fills", () => {
    expect(labelTags).toHaveLength(49);

    const forbiddenFill =
      /\bbg-(?:white|slate-100|emerald-50|green-50|blue-50|amber-50|orange-50|yellow-50|red-50|rose-50|cyan-50|sky-50|lime-50|success\/10|warning\/10|danger\/10|info\/10|primary-soft|surface(?:-elevated)?)\b/;
    expect(labelTags.filter((tag) => forbiddenFill.test(tag))).toEqual([]);

    expect(productionSource).not.toContain(
      "rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success",
    );
    expect(productionSource).not.toContain(
      "rounded bg-slate-100 px-2 py-1 text-xs text-slate-500",
    );
    expect(productionSource).not.toContain(
      "rounded bg-primary-soft px-1.5 py-0.5 text-[11px] text-primary",
    );
  });

  it("does not apply the label API to representative non-label components", () => {
    const operationsSource = readFileSync(
      join(process.cwd(), "src/modules/operations/operations-workspace.tsx"),
      "utf8",
    );
    const runtimeInputSource = readFileSync(
      join(process.cwd(), "src/modules/agent-runtime/runtime-input-bar.tsx"),
      "utf8",
    );
    const conversationSource = readFileSync(
      join(process.cwd(), "src/modules/operations/conversation-panel.tsx"),
      "utf8",
    );
    const distributionPanelSource = readFileSync(
      join(process.cwd(), "src/modules/agent-distribution/distribution-side-panel.tsx"),
      "utf8",
    );

    expect(operationsSource).toContain('onClick={() => setViewMode("by-agent")}');
    expect(operationsSource).not.toMatch(/<button[^>]*status-badge/);
    expect(runtimeInputSource).toContain('aria-label={`移除 ${attachment.name}`}');
    expect(runtimeInputSource).not.toContain("status-badge");
    expect(conversationSource).toContain(
      'border border-success/25 bg-success/10 text-success',
    );
    expect(conversationSource).not.toMatch(/<button[^>]*status-(?:success|warning|info|danger|neutral)/);
    expect(distributionPanelSource).toContain(
      "rounded-md border border-orange-200 bg-orange-50",
    );
  });
});

function readProductionSources(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) return readProductionSources(path);
    if (!path.endsWith(".tsx") || path.endsWith(".test.tsx")) return [];
    return [readFileSync(path, "utf8")];
  });
}
