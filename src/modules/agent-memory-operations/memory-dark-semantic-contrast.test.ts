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

function tint(foreground: Rgb, background: Rgb, alpha: number): Rgb {
  return foreground.map((value, index) =>
    Math.round(value * alpha + background[index] * (1 - alpha)),
  ) as unknown as Rgb;
}

describe("memory page dark semantic surfaces", () => {
  const source = readFileSync(
    join(
      process.cwd(),
      "src/modules/agent-memory-operations/memory-operations-workspace.tsx",
    ),
    "utf8",
  );
  const surface: Rgb = [15, 17, 19];

  it("reuses the warning status surface for both page feedback notices", () => {
    const warningClass =
      "border-warning bg-[var(--color-status-warning-bg)] px-4 py-3.5 text-sm text-[var(--color-status-warning-text)]";

    expect(source.match(new RegExp(warningClass.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"))).toHaveLength(2);
    expect(source).not.toContain(
      "border-amber-200 bg-amber-50 px-4 py-3.5 text-sm text-amber-800",
    );
  });

  it("uses dark tinted channel and unavailable surfaces", () => {
    for (const className of [
      "bg-indigo-400/10 text-indigo-300 ring-1 ring-inset ring-indigo-400",
      "bg-cyan-400/10 text-cyan-300 ring-1 ring-inset ring-cyan-400",
      "bg-amber-400/10 text-amber-300 ring-1 ring-inset ring-amber-400",
      "bg-slate-400/10 px-2.5 py-1 font-medium text-slate-300 ring-1 ring-inset ring-slate-500",
    ]) {
      expect(source).toContain(className);
    }
  });

  it("keeps text and semantic boundaries above their contrast targets", () => {
    const warningBackground: Rgb = [28, 22, 11];
    expect(contrast([245, 196, 81], warningBackground)).toBeGreaterThanOrEqual(4.5);
    expect(contrast([245, 184, 46], surface)).toBeGreaterThanOrEqual(3);

    const channels = [
      { color: [129, 140, 248] as Rgb, text: [165, 180, 252] as Rgb },
      { color: [34, 211, 238] as Rgb, text: [103, 232, 249] as Rgb },
      { color: [251, 191, 36] as Rgb, text: [252, 211, 77] as Rgb },
      { color: [100, 116, 139] as Rgb, text: [203, 213, 225] as Rgb },
    ];

    for (const channel of channels) {
      expect(contrast(channel.text, tint(channel.color, surface, 0.1))).toBeGreaterThanOrEqual(4.5);
      expect(contrast(channel.color, surface)).toBeGreaterThanOrEqual(3);
    }
  });
});
