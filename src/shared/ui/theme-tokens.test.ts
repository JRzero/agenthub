import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

const expectedTokens = {
  "--color-canvas": "#08090a",
  "--color-surface": "#0f1113",
  "--color-surface-elevated": "#16181b",
  "--color-border": "#292c31",
  "--color-text-strong": "#f5f7f8",
  "--color-text-secondary": "#a5a8ae",
  "--color-text-muted": "#6f737a",
  "--color-primary": "#d7ff2f",
  "--color-success": "#9be228",
  "--color-warning": "#f5b82e",
  "--color-danger": "#f05f5f",
  "--color-info": "#65a7ff",
} as const;

describe("AgentHub V1 semantic theme", () => {
  it.each(Object.entries(expectedTokens))("defines %s as %s", (token, value) => {
    expect(stylesheet).toContain(`${token}: ${value}`);
  });

  it("does not retain the legacy purple primary values", () => {
    expect(stylesheet).not.toContain("#5b5ce2");
    expect(stylesheet).not.toContain("#7a7bf4");
    expect(stylesheet).not.toContain("#26264e");
  });

  it("uses dark color scheme for both root and persisted dark mode", () => {
    expect(stylesheet.match(/color-scheme: dark/g)).toHaveLength(2);
    expect(stylesheet).not.toContain("color-scheme: light");
  });
});
