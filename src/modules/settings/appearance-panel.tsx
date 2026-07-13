"use client";

import { Desktop, Moon, Sun } from "@phosphor-icons/react";
import { useTheme } from "./theme-provider";
import type { ThemeMode } from "./theme-state";

const modes: Array<{ id: ThemeMode; label: string; description: string; icon: typeof Sun }> = [
  { id: "light", label: "亮色", description: "始终使用明亮工作区", icon: Sun },
  { id: "dark", label: "暗色", description: "始终使用深色工作区", icon: Moon },
  { id: "system", label: "跟随系统", description: "随操作系统外观自动变化", icon: Desktop },
];

export function AppearancePanel() {
  const { mode, isDark, setMode } = useTheme();
  return <section className="panel p-6"><h2 className="text-xl font-semibold">外观</h2><p className="mt-2 text-sm text-text-muted">主题选择保存在当前浏览器，并在页面加载前应用，避免闪烁。</p><div className="mt-6 grid gap-3 md:grid-cols-3">{modes.map((item) => { const Icon = item.icon; return <button key={item.id} type="button" onClick={() => setMode(item.id)} className={`rounded-xl border p-4 text-left transition ${mode === item.id ? "border-primary bg-primary-soft ring-1 ring-primary" : "border-border bg-surface hover:bg-subtle"}`}><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-subtle text-primary"><Icon size={21} /></span><strong className="mt-4 block">{item.label}</strong><span className="mt-1 block text-xs leading-5 text-text-muted">{item.description}</span>{mode === item.id && <span className="mt-3 inline-block text-xs font-medium text-primary">当前选择</span>}</button>; })}</div><div className="mt-6 rounded-lg border border-border bg-subtle px-4 py-3 text-sm text-text-muted">当前有效外观：<strong className="text-text-strong">{isDark ? "暗色" : "亮色"}</strong> · 主题包：默认</div></section>;
}
