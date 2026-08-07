export const DEFAULT_AUTH_REDIRECT = "/workbench";

export function resolveAuthRedirect(value: string | null | undefined): string {
  if (!value) return DEFAULT_AUTH_REDIRECT;
  if (!value.startsWith("/") || value.startsWith("//")) {
    return DEFAULT_AUTH_REDIRECT;
  }

  try {
    const resolved = new URL(value, "https://agenthub.local");
    if (resolved.origin !== "https://agenthub.local") {
      return DEFAULT_AUTH_REDIRECT;
    }
    return `${resolved.pathname}${resolved.search}${resolved.hash}`;
  } catch {
    return DEFAULT_AUTH_REDIRECT;
  }
}
