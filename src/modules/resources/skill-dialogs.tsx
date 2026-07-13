"use client";

import { useState } from "react";
import { Trash, X } from "@phosphor-icons/react";
import type { Agent } from "@/modules/agents/types";
import { maskSensitiveConfig, restoreSensitiveConfig } from "./sensitive-config";
import type { CreatorSkill, MarketplaceSkill } from "./types";

export function AttachSkillDialog({ skill, agents, agentId, busy, onAgentId, onClose, onSubmit }: {
  skill: MarketplaceSkill;
  agents: Agent[];
  agentId: number | "";
  busy: boolean;
  onAgentId: (id: number | "") => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4" onMouseDown={onClose}>
    <section role="dialog" aria-modal="true" aria-labelledby="attach-title" onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-md rounded-xl bg-surface shadow-2xl">
      <header className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 id="attach-title" className="font-semibold">添加“{skill.name}”到 Agent</h2>
          <p className="mt-1 text-xs text-text-muted">复用现有 Agent 更新接口，不改变其他技能。</p>
        </div>
        <button onClick={onClose} aria-label="关闭绑定技能" className="p-2"><X size={18} /></button>
      </header>
      <div className="p-5">
        <label className="text-sm font-medium">选择 Agent
          <select value={agentId} onChange={(event) => onAgentId(Number(event.target.value) || "")} className="mt-2 h-10 w-full rounded-md border border-border bg-surface px-3">
            <option value="">请选择</option>
            {agents.map((agent) => <option key={agent.id} value={agent.id}>{agent.name}</option>)}
          </select>
        </label>
        <button type="button" onClick={onSubmit} disabled={!agentId || busy} className="button-primary mt-5 w-full">{busy ? "添加中…" : "确认添加"}</button>
      </div>
    </section>
  </div>;
}

export function CreatorSkillDialog({ skill, busy, error, onClose, onSave, onDelete }: {
  skill: CreatorSkill;
  busy: boolean;
  error: string;
  onClose: () => void;
  onSave: (input: { name: string; status: string; config: Record<string, unknown> }) => void;
  onDelete: () => void;
}) {
  const [name, setName] = useState(skill.name);
  const [status, setStatus] = useState(skill.status || "active");
  const [configText, setConfigText] = useState(JSON.stringify(maskSensitiveConfig(skill.config || {}), null, 2));
  const [parseError, setParseError] = useState("");

  function submit() {
    try {
      const parsed: unknown = JSON.parse(configText);
      if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") throw new Error("配置必须是 JSON 对象");
      setParseError("");
      onSave({
        name: name.trim(),
        status,
        config: restoreSensitiveConfig(parsed as Record<string, unknown>, skill.config || {}),
      });
    } catch (err) {
      setParseError(err instanceof Error ? err.message : "JSON 格式无效");
    }
  }

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4" onMouseDown={onClose}>
    <section role="dialog" aria-modal="true" aria-labelledby="creator-skill-title" onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-xl rounded-xl bg-surface shadow-2xl">
      <header className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 id="creator-skill-title" className="font-semibold">管理工作空间技能</h2>
          <p className="mt-1 text-xs text-text-muted">{skill.skill_name || skill.name}</p>
        </div>
        <button onClick={onClose} aria-label="关闭技能管理" className="p-2"><X size={18} /></button>
      </header>
      <div className="space-y-4 p-5">
        <label className="block text-sm font-medium">显示名称
          <input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 h-10 w-full rounded-md border border-border bg-surface px-3" />
        </label>
        <label className="block text-sm font-medium">状态
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="mt-2 h-10 w-full rounded-md border border-border bg-surface px-3">
            <option value="active">启用</option>
            <option value="inactive">停用</option>
          </select>
        </label>
        <label className="block text-sm font-medium">JSON 配置
          <textarea value={configText} onChange={(event) => setConfigText(event.target.value)} spellCheck={false} className="mt-2 min-h-48 w-full rounded-md border border-border bg-slate-950 p-3 font-mono text-xs text-slate-100" />
          <span className="mt-2 block text-xs leading-5 text-text-muted">敏感字段已隐藏。保留占位符会继续使用现有值，只有主动替换时才会更新。</span>
        </label>
        {(parseError || error) && <p className="text-sm text-danger">{parseError || error}</p>}
      </div>
      <footer className="flex flex-wrap justify-between gap-3 border-t border-border px-5 py-4">
        <button type="button" onClick={onDelete} disabled={busy} className="button-secondary text-danger"><Trash size={17} />删除技能</button>
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="button-secondary">取消</button>
          <button type="button" onClick={submit} disabled={busy || !name.trim()} className="button-primary">{busy ? "保存中…" : "保存"}</button>
        </div>
      </footer>
    </section>
  </div>;
}
