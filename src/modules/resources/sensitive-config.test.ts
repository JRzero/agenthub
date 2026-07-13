import { describe, expect, it } from "vitest";
import {
  maskSensitiveConfig,
  PROTECTED_CONFIG_VALUE,
  restoreSensitiveConfig,
} from "./sensitive-config";

describe("sensitive Creator Skill configuration", () => {
  it("masks common secret fields recursively without changing ordinary values", () => {
    expect(maskSensitiveConfig({
      api_key: "test-secret",
      base_url: "https://example.test/v1",
      nested: { accessToken: "nested-secret", model: "example-model" },
    })).toEqual({
      api_key: PROTECTED_CONFIG_VALUE,
      base_url: "https://example.test/v1",
      nested: { accessToken: PROTECTED_CONFIG_VALUE, model: "example-model" },
    });
  });

  it("restores untouched placeholders while allowing an intentional replacement", () => {
    const original = { api_key: "test-secret", token: "old-token", model: "example-model" };
    expect(restoreSensitiveConfig({
      api_key: PROTECTED_CONFIG_VALUE,
      token: "replacement-token",
      model: "new-model",
    }, original)).toEqual({
      api_key: "test-secret",
      token: "replacement-token",
      model: "new-model",
    });
  });
});
