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
  "--color-text-muted": "#898d94",
  "--color-primary": "#d7ff2f",
  "--color-success": "#9be228",
  "--color-warning": "#f5b82e",
  "--color-danger": "#f05f5f",
  "--color-info": "#65a7ff",
  "--color-status-positive-bg": "#141a0c",
  "--color-status-positive-border": "#536a23",
  "--color-status-draft-bg": "#1c160b",
  "--color-status-draft-border": "#806222",
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

  it("keeps meaningful 12–14px muted text at WCAG AA contrast on every dark surface", () => {
    const muted = expectedTokens["--color-text-muted"];
    const surfaces = [
      expectedTokens["--color-canvas"],
      expectedTokens["--color-surface"],
      expectedTokens["--color-surface-elevated"],
      "#202719",
    ];

    surfaces.forEach((surface) => expect(contrastRatio(muted, surface)).toBeGreaterThanOrEqual(4.5));
  });

  it("keeps scoped live, saved, and draft labels above WCAG AA text contrast", () => {
    expect(
      contrastRatio(
        expectedTokens["--color-success"],
        expectedTokens["--color-status-positive-bg"],
      ),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(
        expectedTokens["--color-warning"],
        expectedTokens["--color-status-draft-bg"],
      ),
    ).toBeGreaterThanOrEqual(4.5);
  });
});

function contrastRatio(foreground: string, background: string): number {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background));
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

function relativeLuminance(hex: string): number {
  const channels = [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255);
  const [red, green, blue] = channels.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return (0.2126 * red) + (0.7152 * green) + (0.0722 * blue);
}
