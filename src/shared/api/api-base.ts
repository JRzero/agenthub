export const API_OVERRIDE_STORAGE_KEY = "linkyun-api-url-override";

export function validateApiBaseUrl(value: string): string {
  const candidate = value.trim().replace(/\/+$/, "");
  let parsed: URL;

  try {
    parsed = new URL(candidate);
  } catch {
    throw new Error("API Service 地址格式无效，请使用 http(s)://");
  }

  if (!["http:", "https:"].includes(parsed.protocol) || parsed.username || parsed.password) {
    throw new Error("API Service 地址格式无效，请使用 http(s)://");
  }

  return candidate;
}

export function setApiBaseUrlOverride(value: string, storage?: Storage): string {
  const normalized = validateApiBaseUrl(value);
  const target = storage || window.localStorage;
  target.setItem(API_OVERRIDE_STORAGE_KEY, normalized);
  return normalized;
}

export function clearApiBaseUrlOverride(storage?: Storage): void {
  const target = storage || window.localStorage;
  target.removeItem(API_OVERRIDE_STORAGE_KEY);
}
