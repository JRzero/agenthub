import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

type Rgb = readonly [number, number, number];

function luminance([red, green, blue]: Rgb) {
  const [r, g, b] = [red, green, blue].map((value) => {
    const channel = value / 255;
    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(foreground: Rgb, background: Rgb) {
  const values = [luminance(foreground), luminance(background)];
  return (Math.max(...values) + 0.05) / (Math.min(...values) + 0.05);
}

describe("VersionDetail session notice semantic contrast", () => {
  const source = readFileSync(
    join(process.cwd(), "src/modules/agent-versions/versions-workspace.tsx"),
    "utf8",
  );
  const surface: Rgb = [15, 17, 19];
  const info: Rgb = [101, 167, 255];
  const infoBackground: Rgb = [13, 23, 34];
  const infoText: Rgb = [143, 192, 255];

  it("uses the existing dark info surface without changing layout or copy", () => {
    expect(source).toContain(
      'className="rounded-md border border-info bg-[var(--color-status-info-bg)] px-4 py-2.5 text-sm text-[var(--color-status-info-text)]"',
    );
    expect(source).toContain(
      '"；已有会话继续使用创建时绑定的版本。"',
    );
    expect(source).not.toContain(
      'border-blue-200 bg-blue-50 px-4 py-2.5 text-sm text-blue-700',
    );
  });

  it("keeps ordinary text above 4.5:1", () => {
    expect(contrast(infoText, infoBackground)).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps the semantic boundary above 3:1", () => {
    expect(contrast(info, surface)).toBeGreaterThanOrEqual(3);
    expect(contrast(info, infoBackground)).toBeGreaterThanOrEqual(3);
  });
});
