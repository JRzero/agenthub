import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

describe("shared control styles", () => {
  it("keeps default actions and fields on the 36px scale", () => {
    expect(stylesheet).toMatch(
      /\.button-primary\s*\{[\s\S]*?min-h-9[\s\S]*?text-sm/,
    );
    expect(stylesheet).toMatch(
      /\.button-secondary\s*\{[\s\S]*?min-h-9[\s\S]*?text-sm/,
    );
    expect(stylesheet).toMatch(
      /\.control-field,[\s\S]*?\.control-select\s*\{[\s\S]*?h-9[\s\S]*?text-sm/,
    );
  });

  it("provides compact, destructive, and icon-only variants", () => {
    expect(stylesheet).toMatch(
      /\.control-compact\s*\{[\s\S]*?h-8[\s\S]*?text-xs/,
    );
    expect(stylesheet).toMatch(
      /\.button-danger\s*\{[\s\S]*?min-h-9[\s\S]*?bg-danger/,
    );
    expect(stylesheet).toMatch(
      /\.icon-button\s*\{[\s\S]*?h-8[\s\S]*?w-8/,
    );
  });

  it("normalizes only native single-select controls", () => {
    expect(stylesheet).toContain(
      "select:not([multiple]):not([size]):not(.control-compact):not(.control-large)",
    );
    expect(stylesheet).toContain("height: 2.25rem");
    expect(stylesheet).toContain("font-size: 0.875rem");
  });

  it("normalizes single-line inputs and preserves explicit large fields", () => {
    expect(stylesheet).toContain(
      'input[type="text"]:not(.control-compact):not(.control-large):not(.control-native-large)',
    );
    expect(stylesheet).toContain(
      'input[type="password"]:not(.control-compact):not(.control-large):not(.control-native-large)',
    );
    expect(stylesheet).toContain("height: 2.25rem");
    expect(stylesheet).toContain("font-size: 0.875rem");
  });
});
