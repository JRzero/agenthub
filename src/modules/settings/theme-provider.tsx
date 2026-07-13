"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_THEME_STATE, isEffectiveDark, loadThemeState, saveThemeState, type ThemeMode } from "./theme-state";

interface ThemeContextValue { mode: ThemeMode; isDark: boolean; setMode: (mode: ThemeMode) => void }
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(DEFAULT_THEME_STATE.mode);
  const [systemDark, setSystemDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMode(loadThemeState(window.localStorage).mode); setMounted(true); }, []);
  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystemDark(query.matches); update();
    query.addEventListener("change", update); return () => query.removeEventListener("change", update);
  }, []);
  const isDark = isEffectiveDark(mode, systemDark);
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", isDark);
    saveThemeState(window.localStorage, { themePackId: "default", mode });
  }, [isDark, mode, mounted]);
  const value = useMemo(() => ({ mode, isDark, setMode }), [isDark, mode]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext); if (!value) throw new Error("useTheme must be used inside ThemeProvider"); return value;
}
