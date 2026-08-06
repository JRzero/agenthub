import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const sources = [
  "src/modules/agent-test/conversation-panel.tsx",
  "src/modules/agent-test/advanced-conversation-panel.tsx",
  "src/modules/agent-runtime/runtime-chat-panel.tsx",
].map((path) => readFileSync(join(process.cwd(), path), "utf8"));

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

describe("Agent test and runtime user-message contrast", () => {
  it("uses the canvas foreground for every lime user-message bubble", () => {
    for (const source of sources) {
      expect(source).toContain('message.role === "user" ? "bg-primary text-canvas"');
      expect(source).not.toContain('message.role === "user" ? "bg-primary text-white"');
    }
  });

  it("keeps the shared accent pairing above the normal-text threshold", () => {
    expect(contrast([8, 9, 10], [215, 255, 47])).toBeGreaterThanOrEqual(4.5);
  });
});
