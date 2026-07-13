export function runtimeHeaders(apiKey: string, workspaceCode: string, json = false): Record<string, string> {
  const headers: Record<string, string> = { "X-API-Key": apiKey };
  if (json) headers["Content-Type"] = "application/json";
  if (workspaceCode && workspaceCode !== "default") headers["X-Workspace-Code"] = workspaceCode;
  return headers;
}
