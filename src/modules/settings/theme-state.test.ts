import { describe, expect, it } from "vitest";
import { isEffectiveDark, loadThemeState, parseThemeState, saveThemeState } from "./theme-state";

describe("AgentHub theme state", () => {
  it("loads the legacy JSON shape and rejects unknown modes", () => {
    expect(parseThemeState('{"themePackId":"default","mode":"dark"}').mode).toBe("dark");
    expect(parseThemeState('{"mode":"sepia"}').mode).toBe("system");
    expect(parseThemeState("broken").mode).toBe("system");
  });

  it("persists the compatible key shape", () => {
    const values = new Map<string, string>();
    const storage = { getItem: (key: string) => values.get(key) || null, setItem: (key: string, value: string) => values.set(key, value) };
    saveThemeState(storage, { themePackId: "default", mode: "light" });
    expect(loadThemeState(storage)).toEqual({ themePackId: "default", mode: "light" });
  });

  it("derives system mode without changing explicit modes", () => {
    expect(isEffectiveDark("system", true)).toBe(true);
    expect(isEffectiveDark("system", false)).toBe(false);
    expect(isEffectiveDark("dark", false)).toBe(true);
    expect(isEffectiveDark("light", true)).toBe(false);
  });
});
