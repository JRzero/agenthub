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

describe("PublishDialog dark semantic surfaces", () => {
  const source = readFileSync(
    join(process.cwd(), "src/modules/agent-versions/versions-workspace.tsx"),
    "utf8",
  );
  const surface: Rgb = [15, 17, 19];
  const info: Rgb = [101, 167, 255];
  const infoBackground: Rgb = [13, 23, 34];
  const infoText: Rgb = [143, 192, 255];
  const success: Rgb = [155, 226, 40];
  const successBackground: Rgb = [20, 26, 12];
  const successText: Rgb = [183, 239, 84];

  it("uses repository semantic surfaces instead of light-theme fills", () => {
    expect(source).toContain(
      'border-info bg-[var(--color-status-info-bg)] text-[var(--color-status-info-text)]',
    );
    expect(source).toContain(
      'border-success bg-[var(--color-status-success-bg)] text-[var(--color-status-success-text)]',
    );
    expect(source).toContain('marker:text-info');
    expect(source).toContain('onClick={onPublish}');
    expect(source.match(/disabled={publishing}/g)?.length).toBeGreaterThanOrEqual(2);
  });

  it("keeps semantic text comfortably above 4.5:1", () => {
    expect(contrast(infoText, infoBackground)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(successText, successBackground)).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps semantic borders and bullets above 3:1", () => {
    expect(contrast(info, surface)).toBeGreaterThanOrEqual(3);
    expect(contrast(success, surface)).toBeGreaterThanOrEqual(3);
    expect(contrast(info, infoBackground)).toBeGreaterThanOrEqual(3);
  });
});
