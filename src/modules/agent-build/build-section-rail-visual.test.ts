import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "src/modules/agent-build/build-section-rail.tsx"),
  "utf8",
);

describe("BuildSectionRail selected icon treatment", () => {
  it("uses a high-contrast canvas foreground and library-provided bold weight only when selected", () => {
    expect(source).toContain(
      'selected ? "border-primary bg-primary text-canvas" : "border-border bg-surface"',
    );
    expect(source).toContain("size={selected ? 16 : 13}");
    expect(source).toContain(
      'weight={selected ? "bold" : "regular"}',
    );
    expect(source).not.toContain("bg-primary text-white");
  });

  it("preserves selected, hover, focus, editor, and route interaction contracts", () => {
    expect(source).toContain(
      'selected ? "bg-primary-soft font-semibold text-primary" : "text-text-muted hover:bg-subtle hover:text-text-strong"',
    );
    expect(source).toContain(
      "item.kind === \"editor\" ? selected : undefined",
    );
    expect(source).toContain(
      'if (item.kind === "editor") onChange(item.id);',
    );
    expect(source).toContain(
      "router.push(getBuildLifecyclePath(agentId, item.id));",
    );
  });
});
