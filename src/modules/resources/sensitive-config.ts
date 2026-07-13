export const PROTECTED_CONFIG_VALUE = "••••••••";

const SENSITIVE_KEY = /(?:api[_-]?key|token|secret|password|authorization|credential|private[_-]?key)/i;

export function isSensitiveConfigKey(key: string): boolean {
  return SENSITIVE_KEY.test(key);
}

export function maskSensitiveConfig(config: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(config).map(([key, value]) => {
    if (isSensitiveConfigKey(key) && value !== null && value !== undefined && value !== "") {
      return [key, PROTECTED_CONFIG_VALUE];
    }
    if (Array.isArray(value)) {
      return [key, value.map((item) => isRecord(item) ? maskSensitiveConfig(item) : item)];
    }
    if (isRecord(value)) return [key, maskSensitiveConfig(value)];
    return [key, value];
  }));
}

export function restoreSensitiveConfig(
  edited: Record<string, unknown>,
  original: Record<string, unknown>,
): Record<string, unknown> {
  return Object.fromEntries(Object.entries(edited).map(([key, value]) => {
    if (isSensitiveConfigKey(key) && value === PROTECTED_CONFIG_VALUE) {
      return [key, original[key]];
    }
    if (Array.isArray(value)) {
      const originalItems = Array.isArray(original[key]) ? original[key] : [];
      return [key, value.map((item, index) => isRecord(item)
        ? restoreSensitiveConfig(item, isRecord(originalItems[index]) ? originalItems[index] : {})
        : item)];
    }
    if (isRecord(value)) {
      return [key, restoreSensitiveConfig(value, isRecord(original[key]) ? original[key] : {})];
    }
    return [key, value];
  }));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && !Array.isArray(value) && typeof value === "object";
}
