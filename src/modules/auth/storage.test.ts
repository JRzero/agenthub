import { beforeEach, describe, expect, it } from "vitest";
import {
  AUTH_STORAGE_KEY,
  clearAuthSession,
  readAuthSession,
  writeAuthSession,
} from "./storage";

describe("creator auth storage compatibility", () => {
  beforeEach(() => window.localStorage.clear());

  it("uses the legacy linkyun_auth key and schema", () => {
    writeAuthSession({ apiKey: "test-key", username: "creator" });
    expect(window.localStorage.getItem(AUTH_STORAGE_KEY)).toBe(
      JSON.stringify({ apiKey: "test-key", username: "creator" }),
    );
    expect(readAuthSession()).toEqual({ apiKey: "test-key", username: "creator" });
  });

  it("rejects malformed sessions and clears valid sessions", () => {
    window.localStorage.setItem(AUTH_STORAGE_KEY, "not-json");
    expect(readAuthSession()).toBeNull();
    writeAuthSession({ apiKey: "key", username: "name" });
    clearAuthSession();
    expect(readAuthSession()).toBeNull();
  });
});
