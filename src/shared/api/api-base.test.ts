import { beforeEach, describe, expect, it } from "vitest";
import {
  API_OVERRIDE_STORAGE_KEY,
  clearApiBaseUrlOverride,
  setApiBaseUrlOverride,
  validateApiBaseUrl,
} from "./api-base";

describe("API Service override", () => {
  beforeEach(() => window.localStorage.clear());

  it("normalizes and persists a valid HTTP URL", () => {
    expect(setApiBaseUrlOverride(" https://api.example.com/// ")).toBe(
      "https://api.example.com",
    );
    expect(window.localStorage.getItem(API_OVERRIDE_STORAGE_KEY)).toBe(
      "https://api.example.com",
    );
  });

  it.each(["api.example.com", "ftp://api.example.com", "https://user:pass@api.example.com"])(
    "rejects an unsafe or invalid value: %s",
    (value) => expect(() => validateApiBaseUrl(value)).toThrow("http(s)://"),
  );

  it("clears the compatible override key", () => {
    setApiBaseUrlOverride("http://localhost:9090");
    clearApiBaseUrlOverride();
    expect(window.localStorage.getItem(API_OVERRIDE_STORAGE_KEY)).toBeNull();
  });
});
