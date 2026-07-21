"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowCounterClockwise, Info, X } from "@phosphor-icons/react";
import type { ConfigProperty, CreatorSkill } from "@/modules/resources/types";

type ConfigScope = "global" | "agent";

const fieldLabels: Record<string, string> = {
  api_key: "API Key",
  background: "背景",
  base_url: "Base URL",
  model: "模型",
  output_format: "输出格式",
  quality: "质量",
  size: "尺寸",
  tool_description: "调用提示词",
};

function inferProperty(value: unknown): ConfigProperty {
  if (typeof value === "boolean") return { type: "boolean" };
  if (typeof value === "number") return { type: Number.isInteger(value) ? "integer" : "number" };
  if (Array.isArray(value)) return { type: "array" };
  if (value && typeof value === "object") return { type: "object" };
  return { type: "string" };
}

function isSensitiveField(key: string): boolean {
  return /(^|_)(api_?key|token|secret|password|credential)($|_)/i.test(key);
}

function isLongTextField(key: string, property: ConfigProperty): boolean {
  return key === "tool_description" || key.endsWith("_prompt") || (property.description?.length || 0) > 80;
}

function displayValue(value: unknown): string {
  if (value === undefined || value === null) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function parseFieldValue(raw: string, property: ConfigProperty): unknown {
  if (raw === "") return undefined;
  if (property.type === "boolean") return raw === "true";
  if (property.type === "number" || property.type === "integer") {
    const value = Number(raw);
    return Number.isFinite(value) ? value : raw;
  }
  return raw;
}

export function SkillConfigDialog({ skill, agentConfig, saving, onClose, onSave }: { skill: CreatorSkill | null; agentConfig: Record<string, unknown>; saving: boolean; onClose: () => void; onSave: (scope: ConfigScope, config: Record<string, unknown>) => Promise<void> }) {
  const [scope, setScope] = useState<ConfigScope>("agent");
  const [config, setConfig] = useState<Record<string, unknown>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (!skill) return;
    setScope("agent");
    setConfig(agentConfig || {});
    setError("");
  }, [agentConfig, skill]);

  useEffect(() => {
    if (!skill) return;
    setConfig(scope === "global" ? skill.config || {} : agentConfig || {});
    setError("");
  }, [agentConfig, scope, skill]);

  const fields = useMemo(() => {
    if (!skill) return [];
    const declared = skill.config_schema?.properties || {};
    const properties: Record<string, ConfigProperty> = { ...declared };
    Object.entries(config).forEach(([key, value]) => {
      if (!properties[key]) properties[key] = inferProperty(value);
    });
    if (skill.default_tool_description && !properties.tool_description) {
      properties.tool_description = { type: "string", description: "技能被调用时提供给模型的说明" };
    }
    return Object.entries(properties);
  }, [config, skill]);

  if (!skill) return null;

  const updateField = (key: string, raw: string, property: ConfigProperty) => {
    const value = parseFieldValue(raw, property);
    setConfig((current) => {
      if (value === undefined) {
        const next = { ...current };
        delete next[key];
        return next;
      }
      return { ...current, [key]: value };
    });
    setError("");
  };

  const save = async () => {
    try {
      await onSave(scope, config);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "配置保存失败");
    }
  };

  const resetDescription = () => {
    if (!skill.default_tool_description) return;
    setConfig((current) => ({ ...current, tool_description: skill.default_tool_description }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4" onMouseDown={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="skill-config-title"
        onMouseDown={(event) => event.stopPropagation()}
        className="flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-surface shadow-2xl"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 id="skill-config-title" className="font-semibold">配置「{skill.name}」</h2>
            <p className="mt-1 text-xs text-text-muted">按字段填写技能参数，无需编辑 JSON。</p>
          </div>
          <button type="button" onClick={onClose} aria-label="关闭技能配置" className="rounded-md p-2 hover:bg-subtle"><X size={18} /></button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="flex rounded-md border border-border p-1">
            <button type="button" onClick={() => setScope("global")} className={`flex-1 rounded px-4 py-2 text-sm ${scope === "global" ? "bg-primary-soft font-medium text-primary" : "text-text-muted"}`}>Creator 全局配置</button>
            <button type="button" onClick={() => setScope("agent")} className={`flex-1 rounded px-4 py-2 text-sm ${scope === "agent" ? "bg-primary-soft font-medium text-primary" : "text-text-muted"}`}>当前 Agent 覆盖</button>
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-lg border border-primary/15 bg-primary-soft/50 px-4 py-3 text-sm leading-6 text-text-muted">
            <Info className="mt-1 shrink-0 text-primary" size={16} />
            <p>{scope === "agent" ? "保存后直接写入当前 Agent 草稿，无需再次点击页面顶部的“保存草稿”。" : "保存后更新 Creator 技能的全局配置；当前 Agent 可通过覆盖配置保留独立参数。"}</p>
          </div>

          {fields.length ? (
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {fields.map(([key, property]) => {
                const value = config[key];
                const label = fieldLabels[key] || property.description || key;
                const hint = property.description && property.description !== label ? property.description : "";
                const required = skill.config_schema?.required?.includes(key);
                const fieldClass = isLongTextField(key, property) || property.type === "object" || property.type === "array" ? "sm:col-span-2" : "";

                return (
                  <label key={key} className={`block text-sm font-medium ${fieldClass}`}>
                    <span>{label}{required && <span className="ml-1 text-danger">*</span>}</span>
                    <span className="ml-2 font-normal text-text-muted">{key}</span>
                    {property.enum?.length ? (
                      <select value={displayValue(value)} onChange={(event) => updateField(key, event.target.value, property)} className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm">
                        <option value="">未设置{property.default !== undefined ? `（默认：${String(property.default)}）` : ""}</option>
                        {property.enum.map((option) => <option key={option} value={option}>{property.enumLabels?.[option] || option}</option>)}
                      </select>
                    ) : property.type === "boolean" ? (
                      <select value={value === undefined ? "" : String(value)} onChange={(event) => updateField(key, event.target.value, property)} className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm">
                        <option value="">未设置{property.default !== undefined ? `（默认：${String(property.default)}）` : ""}</option>
                        <option value="true">开启</option>
                        <option value="false">关闭</option>
                      </select>
                    ) : property.type === "object" || property.type === "array" ? (
                      <textarea value={displayValue(value)} readOnly rows={3} className="mt-2 w-full cursor-not-allowed resize-none rounded-lg border border-border bg-subtle px-3 py-2.5 font-mono text-sm text-text-muted" aria-describedby={`${key}-hint`} />
                    ) : isLongTextField(key, property) ? (
                      <textarea value={displayValue(value)} onChange={(event) => updateField(key, event.target.value, property)} rows={4} placeholder={property.default === undefined ? "请输入" : `默认：${String(property.default)}`} className="mt-2 w-full resize-y rounded-lg border border-border bg-surface px-3 py-2.5 text-sm leading-6" />
                    ) : (
                      <input
                        type={isSensitiveField(key) ? "password" : property.type === "number" || property.type === "integer" ? "number" : "text"}
                        value={displayValue(value)}
                        onChange={(event) => updateField(key, event.target.value, property)}
                        placeholder={property.default === undefined ? "请输入" : `默认：${String(property.default)}`}
                        autoComplete="off"
                        step={property.type === "integer" ? 1 : property.type === "number" ? "any" : undefined}
                        className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm"
                      />
                    )}
                    {(hint || property.type === "object" || property.type === "array") && <span id={`${key}-hint`} className="mt-1.5 block text-xs font-normal leading-5 text-text-muted">{property.type === "object" || property.type === "array" ? "该复杂字段仅展示现有值，暂不支持在表单中修改。" : hint}</span>}
                  </label>
                );
              })}
            </div>
          ) : (
            <div className="mt-5 rounded-lg border border-dashed border-border p-8 text-center text-sm text-text-muted">该技能没有可配置参数。</div>
          )}

          {skill.default_tool_description && <button type="button" onClick={resetDescription} className="mt-4 inline-flex items-center gap-2 text-sm text-primary"><ArrowCounterClockwise size={16} />恢复默认调用提示词</button>}
          {error && <p className="mt-3 text-sm text-danger">{error}</p>}
        </div>

        <footer className="flex shrink-0 justify-end gap-3 border-t border-border bg-surface px-5 py-4">
          <button type="button" onClick={onClose} className="button-secondary">取消</button>
          <button type="button" onClick={() => void save()} disabled={saving} className="button-primary">{saving ? "保存中…" : scope === "agent" ? "保存到当前草稿" : "保存全局配置"}</button>
        </footer>
      </section>
    </div>
  );
}
