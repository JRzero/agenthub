import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const previewSource = readFileSync(
  join(process.cwd(), "src/modules/agent-build/build-preview.tsx"),
  "utf8",
);

const versionsSource = readFileSync(
  join(process.cwd(), "src/modules/agent-versions/versions-workspace.tsx"),
  "utf8",
);

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

describe("preview and draft status contrast contracts", () => {
  it("pairs lime accent actions with the canvas foreground", () => {
    expect(previewSource).toContain('"ml-8 bg-primary text-canvas"');
    expect(previewSource).not.toContain("bg-primary text-white");
    expect(contrast([8, 9, 10], [215, 255, 47])).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps disabled send icon and boundary visible without whole-control opacity", () => {
    expect(previewSource).toContain("disabled:border-text-muted");
    expect(previewSource).toContain("disabled:bg-surface-elevated");
    expect(previewSource).toContain("disabled:text-text-muted");
    expect(previewSource).not.toContain("disabled:opacity-40");
    expect(contrast([137, 141, 148], [22, 24, 27])).toBeGreaterThanOrEqual(3);
  });

  it("preserves enabled hover, pressed, and keyboard focus states", () => {
    expect(previewSource).toContain("enabled:hover:brightness-105");
    expect(previewSource).toContain("enabled:active:brightness-90");
    expect(previewSource).toContain("focus-visible:ring-2");
  });

  it("uses the dark theme warning surface for the current draft row", () => {
    expect(versionsSource).toContain("border-warning bg-surface-elevated");
    expect(versionsSource).toContain("font-semibold text-text-strong");
    expect(versionsSource).toContain('className="text-text-secondary"');
    expect(versionsSource).toContain("h-5 w-px bg-warning");
    expect(versionsSource).not.toContain("bg-amber-50/70");
    expect(contrast([245, 247, 248], [22, 24, 27])).toBeGreaterThanOrEqual(4.5);
    expect(contrast([165, 168, 174], [22, 24, 27])).toBeGreaterThanOrEqual(4.5);
    expect(contrast([245, 184, 46], [22, 24, 27])).toBeGreaterThanOrEqual(3);
  });
});
