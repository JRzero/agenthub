"use client";

import { useEffect, useState } from "react";
import { ArrowCounterClockwise, X } from "@phosphor-icons/react";
import type { CreatorSkill } from "@/modules/resources/types";

export function SkillConfigDialog({ skill, agentConfig, saving, onClose, onSave }: { skill: CreatorSkill | null; agentConfig: Record<string, unknown>; saving: boolean; onClose: () => void; onSave: (scope: "global" | "agent", config: Record<string, unknown>) => Promise<void> }) {
  const [scope, setScope] = useState<"global" | "agent">("agent");
  const [text, setText] = useState("{}");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!skill) return;
    setScope("agent");
    setText(JSON.stringify(agentConfig || {}, null, 2));
    setError("");
  }, [agentConfig, skill]);

  useEffect(() => {
    if (!skill) return;
    setText(JSON.stringify(scope === "global" ? skill.config || {} : agentConfig || {}, null, 2));
    setError("");
  }, [agentConfig, scope, skill]);

  if (!skill) return null;
  const save = async () => {
    try {
      const value = JSON.parse(text) as unknown;
      if (!value || Array.isArray(value) || typeof value !== "object") throw new Error("配置必须是 JSON 对象");
      await onSave(scope, value as Record<string, unknown>);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "JSON 格式无效");
    }
  };
  const resetDescription = () => {
    if (!skill.default_tool_description) return;
    try {
      const current = JSON.parse(text) as Record<string, unknown>;
      setText(JSON.stringify({ ...current, tool_description: skill.default_tool_description }, null, 2));
    } catch { setText(JSON.stringify({ tool_description: skill.default_tool_description }, null, 2)); }
  };

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4" onMouseDown={onClose}><section role="dialog" aria-modal="true" aria-labelledby="skill-config-title" onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-2xl rounded-xl bg-surface shadow-2xl"><header className="flex items-center justify-between border-b border-border px-5 py-4"><div><h2 id="skill-config-title" className="font-semibold">配置「{skill.name}」</h2><p className="mt-1 text-xs text-text-muted">同时保留 Creator 全局配置与当前 Agent 覆盖配置。</p></div><button type="button" onClick={onClose} aria-label="关闭技能配置" className="p-2"><X size={18} /></button></header><div className="p-5"><div className="flex rounded-md border border-border p-1"><button type="button" onClick={() => setScope("global")} className={`flex-1 rounded px-4 py-2 text-sm ${scope === "global" ? "bg-primary-soft text-primary" : "text-text-muted"}`}>Creator 全局配置</button><button type="button" onClick={() => setScope("agent")} className={`flex-1 rounded px-4 py-2 text-sm ${scope === "agent" ? "bg-primary-soft text-primary" : "text-text-muted"}`}>当前 Agent 覆盖</button></div>{skill.config_schema?.properties && <div className="mt-4 rounded-lg bg-subtle p-4"><p className="text-xs font-semibold text-text-muted">已声明字段</p><div className="mt-2 flex flex-wrap gap-2">{Object.entries(skill.config_schema.properties).map(([key, property]) => <span key={key} className="status-badge bg-surface text-text-muted">{key}{property.type ? ` · ${property.type}` : ""}</span>)}</div></div>}<label className="mt-4 block text-sm font-medium">配置 JSON<textarea value={text} onChange={(event) => setText(event.target.value)} rows={12} spellCheck={false} className="mt-2 w-full resize-y rounded-lg border border-border bg-slate-950 p-4 font-mono text-sm leading-6 text-slate-100" /></label>{skill.default_tool_description && <button type="button" onClick={resetDescription} className="mt-3 inline-flex items-center gap-2 text-sm text-primary"><ArrowCounterClockwise size={16} />恢复默认调用提示词</button>}{error && <p className="mt-3 text-sm text-danger">{error}</p>}</div><footer className="flex justify-end gap-3 border-t border-border px-5 py-4"><button type="button" onClick={onClose} className="button-secondary">取消</button><button type="button" onClick={() => void save()} disabled={saving} className="button-primary">{saving ? "保存中…" : "保存配置"}</button></footer></section></div>;
}
