import { describe, expect, it } from "vitest";
import {
  DEFAULT_WORKSPACE_PREFERENCES,
  WORKSPACE_PREFERENCES_KEY,
  loadWorkspacePreferences,
  parseWorkspacePreferences,
  saveWorkspacePreferences,
} from "./workspace-preferences";

describe("workspace browser preferences", () => {
  it("uses safe defaults for missing, broken, or unsupported values", () => {
    expect(parseWorkspacePreferences(null)).toEqual(DEFAULT_WORKSPACE_PREFERENCES);
    expect(parseWorkspacePreferences("broken")).toEqual(DEFAULT_WORKSPACE_PREFERENCES);
    expect(parseWorkspacePreferences('{"language":"xx","timezone":"Mars","visibility":"public"}')).toEqual(DEFAULT_WORKSPACE_PREFERENCES);
  });

  it("preserves only the supported preference values", () => {
    expect(parseWorkspacePreferences('{"language":"en-US","timezone":"UTC","visibility":"private","members":99}')).toEqual({
      language: "en-US",
      timezone: "UTC",
      visibility: "private",
    });
  });

  it("reads and writes only the existing browser-local preference key", () => {
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) || null,
      setItem: (key: string, value: string) => values.set(key, value),
    };
    const preferences = { language: "en-US", timezone: "UTC", visibility: "private" } as const;
    saveWorkspacePreferences(storage, preferences);
    expect([...values.keys()]).toEqual([WORKSPACE_PREFERENCES_KEY]);
    expect(loadWorkspacePreferences(storage)).toEqual(preferences);
  });
});
