export const THEME_STORAGE_KEY = "linkyun-theme";
export type ThemeMode = "light" | "dark" | "system";
export interface ThemeState { themePackId: "default"; mode: ThemeMode }

export const DEFAULT_THEME_STATE: ThemeState = { themePackId: "default", mode: "system" };

export function parseThemeState(raw: string | null): ThemeState {
  if (!raw) return DEFAULT_THEME_STATE;
  try {
    const value = JSON.parse(raw) as Partial<ThemeState>;
    const mode = value.mode === "light" || value.mode === "dark" || value.mode === "system" ? value.mode : "system";
    return { themePackId: "default", mode };
  } catch { return DEFAULT_THEME_STATE; }
}

export function loadThemeState(storage: Pick<Storage, "getItem">): ThemeState {
  return parseThemeState(storage.getItem(THEME_STORAGE_KEY));
}

export function saveThemeState(storage: Pick<Storage, "setItem">, state: ThemeState): void {
  storage.setItem(THEME_STORAGE_KEY, JSON.stringify(state));
}

export function isEffectiveDark(mode: ThemeMode, systemPrefersDark: boolean): boolean {
  return mode === "dark" || (mode === "system" && systemPrefersDark);
}
