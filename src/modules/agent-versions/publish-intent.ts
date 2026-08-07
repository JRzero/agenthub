export const PUBLISH_INTENT_PARAM = "publishIntent";

export function buildPublishIntentPath(agentId: number): string {
  return `/assets/${agentId}/versions?${PUBLISH_INTENT_PARAM}=${agentId}`;
}

export function hasMatchingPublishIntent(
  searchParams: Pick<URLSearchParams, "get">,
  agentId: number,
): boolean {
  return searchParams.get(PUBLISH_INTENT_PARAM) === String(agentId);
}

export function removePublishIntent(
  searchParams: Pick<URLSearchParams, "toString">,
): string {
  const next = new URLSearchParams(searchParams.toString());
  next.delete(PUBLISH_INTENT_PARAM);
  return next.toString();
}
