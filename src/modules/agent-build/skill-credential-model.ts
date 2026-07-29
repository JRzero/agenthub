import type {
  CredentialSchema,
  SkillConfigSchema,
  UpdateCreatorSkillRequest,
} from "@/modules/resources/types";

export const SUPPORTED_CREDENTIAL_KEY = "api_key";

export function getCredentialKeys(schema?: CredentialSchema): string[] {
  return Object.keys(schema?.properties || {});
}

export function sanitizeSkillConfig(
  config: Record<string, unknown>,
  credentialSchema?: CredentialSchema,
): Record<string, unknown> {
  const credentialKeys = new Set(getCredentialKeys(credentialSchema));
  return Object.fromEntries(
    Object.entries(config).filter(([key]) => !credentialKeys.has(key)),
  );
}

export function getOrdinaryConfigProperties(
  configSchema?: SkillConfigSchema,
  credentialSchema?: CredentialSchema,
) {
  const credentialKeys = new Set(getCredentialKeys(credentialSchema));
  return Object.fromEntries(
    Object.entries(configSchema?.properties || {}).filter(
      ([key]) => !credentialKeys.has(key),
    ),
  );
}

export function buildCreatorSkillUpdateRequest(
  config: Record<string, unknown>,
  credentialSchema?: CredentialSchema,
  apiKeyInput = "",
): UpdateCreatorSkillRequest {
  const request: UpdateCreatorSkillRequest = {
    config: sanitizeSkillConfig(config, credentialSchema),
  };
  if (apiKeyInput !== "") request.api_key = apiKeyInput;
  return request;
}

export function buildClearCredentialRequest(): UpdateCreatorSkillRequest {
  return { api_key: null };
}
