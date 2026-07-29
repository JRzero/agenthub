import { describe, expect, it } from "vitest";
import type { CredentialSchema } from "@/modules/resources/types";
import {
  buildClearCredentialRequest,
  buildCreatorSkillUpdateRequest,
  getOrdinaryConfigProperties,
  sanitizeSkillConfig,
} from "./skill-credential-model";

const credentialSchema: CredentialSchema = {
  type: "object",
  description: "凭证单独加密保存",
  properties: {
    api_key: {
      type: "string",
      title: "豆包搜索 API Key",
      description: "只写字段",
      format: "password",
      writeOnly: true,
      maxLength: 4096,
    },
  },
};

describe("Skill credential safety model", () => {
  it("removes credential keys from ordinary and legacy Agent config", () => {
    expect(
      sanitizeSkillConfig(
        { timeout_seconds: 15, api_key: "legacy-plaintext" },
        credentialSchema,
      ),
    ).toEqual({ timeout_seconds: 15 });
    expect(
      getOrdinaryConfigProperties(
        {
          type: "object",
          properties: {
            timeout_seconds: { type: "integer" },
            api_key: { type: "string" },
          },
        },
        credentialSchema,
      ),
    ).toEqual({ timeout_seconds: { type: "integer" } });
  });

  it("places a new credential at the request top level", () => {
    expect(
      buildCreatorSkillUpdateRequest(
        {
          version: "global",
          timeout_seconds: 15,
          api_key: "legacy-plaintext",
        },
        credentialSchema,
        "new-secret-value",
      ),
    ).toEqual({
      config: {
        version: "global",
        timeout_seconds: 15,
      },
      api_key: "new-secret-value",
    });
  });

  it("omits an empty credential to preserve the existing Key", () => {
    const request = buildCreatorSkillUpdateRequest(
      { max_results: 10 },
      credentialSchema,
      "",
    );
    expect(request).toEqual({ config: { max_results: 10 } });
    expect(request).not.toHaveProperty("api_key");
  });

  it("uses an explicit null only for confirmed clearing", () => {
    expect(buildClearCredentialRequest()).toEqual({ api_key: null });
  });
});
