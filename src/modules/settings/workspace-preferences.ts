export const WORKSPACE_PREFERENCES_KEY = "agenthub-workspace-preferences";

export interface WorkspacePreferences {
  language: "zh-CN" | "en-US";
  timezone: "Asia/Shanghai" | "UTC";
  visibility: "workspace" | "private";
}

export const DEFAULT_WORKSPACE_PREFERENCES: WorkspacePreferences = {
  language: "zh-CN",
  timezone: "Asia/Shanghai",
  visibility: "workspace",
};

export function parseWorkspacePreferences(raw: string | null): WorkspacePreferences {
  if (!raw) return DEFAULT_WORKSPACE_PREFERENCES;
  try {
    const value = JSON.parse(raw) as Partial<WorkspacePreferences>;
    return {
      language: value.language === "en-US" ? "en-US" : "zh-CN",
      timezone: value.timezone === "UTC" ? "UTC" : "Asia/Shanghai",
      visibility: value.visibility === "private" ? "private" : "workspace",
    };
  } catch {
    return DEFAULT_WORKSPACE_PREFERENCES;
  }
}

export function loadWorkspacePreferences(storage: Pick<Storage, "getItem">): WorkspacePreferences {
  return parseWorkspacePreferences(storage.getItem(WORKSPACE_PREFERENCES_KEY));
}

export function saveWorkspacePreferences(storage: Pick<Storage, "setItem">, preferences: WorkspacePreferences): void {
  storage.setItem(WORKSPACE_PREFERENCES_KEY, JSON.stringify(preferences));
}
