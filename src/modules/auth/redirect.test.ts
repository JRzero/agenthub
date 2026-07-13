import { describe, expect, it } from "vitest";
import { DEFAULT_AUTH_REDIRECT, resolveAuthRedirect } from "./redirect";

describe("authentication redirect safety", () => {
  it("preserves internal routes with query and hash", () => {
    expect(resolveAuthRedirect("/assets/32/build?tab=identity#name")).toBe(
      "/assets/32/build?tab=identity#name",
    );
  });

  it.each([
    null,
    "",
    "https://evil.example/path",
    "//evil.example/path",
    "javascript:alert(1)",
  ])("falls back for an unsafe redirect: %s", (value) => {
    expect(resolveAuthRedirect(value)).toBe(DEFAULT_AUTH_REDIRECT);
  });
});
