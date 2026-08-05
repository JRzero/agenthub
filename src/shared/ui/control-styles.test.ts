import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

describe("shared control styles", () => {
  it("keeps default actions and fields on the 40px scale", () => {
    expect(stylesheet).toMatch(
      /\.button-primary\s*\{[\s\S]*?min-h-10[\s\S]*?text-sm/,
    );
    expect(stylesheet).toMatch(
      /\.button-secondary\s*\{[\s\S]*?min-h-10[\s\S]*?text-sm/,
    );
    expect(stylesheet).toMatch(
      /\.control-field,[\s\S]*?\.control-select\s*\{[\s\S]*?h-10[\s\S]*?text-sm/,
    );
  });

  it("provides compact, destructive, and icon-only variants", () => {
    expect(stylesheet).toMatch(
      /\.control-compact\s*\{[\s\S]*?h-8[\s\S]*?text-xs/,
    );
    expect(stylesheet).toMatch(
      /\.button-danger\s*\{[\s\S]*?min-h-10[\s\S]*?border-danger[\s\S]*?text-danger/,
    );
    expect(stylesheet).toMatch(
      /\.icon-button\s*\{[\s\S]*?h-10[\s\S]*?w-10/,
    );
  });

  it("normalizes only native single-select controls", () => {
    expect(stylesheet).toContain(
      "select:not([multiple]):not([size]):not(.control-compact):not(.control-large)",
    );
    expect(stylesheet).toContain("height: 2.5rem");
    expect(stylesheet).toContain("font-size: 0.875rem");
  });

  it("normalizes single-line inputs and preserves explicit large fields", () => {
    expect(stylesheet).toContain(
      'input[type="text"]:not(.control-compact):not(.control-large):not(.control-native-large)',
    );
    expect(stylesheet).toContain(
      'input[type="password"]:not(.control-compact):not(.control-large):not(.control-native-large)',
    );
    expect(stylesheet).toContain("height: 2.5rem");
    expect(stylesheet).toContain("font-size: 0.875rem");
  });

  it("provides reusable card, table, empty, loading, and error feedback states", () => {
    expect(stylesheet).toMatch(/\.card\s*\{[\s\S]*?bg-surface/);
    expect(stylesheet).toMatch(/\.table-frame\s*\{[\s\S]*?overflow-x-auto/);
    expect(stylesheet).toMatch(/\.table-row\s*\{[\s\S]*?min-h-12/);
    expect(stylesheet).toMatch(/\.empty-state\s*\{[\s\S]*?border-dashed/);
    expect(stylesheet).toMatch(/\.error-feedback\s*\{[\s\S]*?text-danger/);
    expect(stylesheet).toMatch(/\.skeleton\s*\{[\s\S]*?animate-pulse/);
  });

  it("uses a visible lime focus ring and honors reduced motion", () => {
    expect(stylesheet).toContain("outline: 2px solid var(--color-primary)");
    expect(stylesheet).toContain("@media (prefers-reduced-motion: reduce)");
  });
});
