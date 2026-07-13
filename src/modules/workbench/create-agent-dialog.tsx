"use client";

import { useEffect, useState } from "react";
import { X } from "@phosphor-icons/react";
import { suggestAgentCode } from "./model";
import type { CreateAgentInput } from "./api";

const inputClass = "mt-2 h-10 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15";

export function CreateAgentDialog({ open, saving, error, onClose, onSubmit }: { open: boolean; saving: boolean; error: string; onClose: () => void; onSubmit: (input: CreateAgentInput) => void }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [model, setModel] = useState("claude-3-5-sonnet-20241022");
  const [codeTouched, setCodeTouched] = useState(false);

  useEffect(() => {
    if (!codeTouched) setCode(suggestAgentCode(name));
  }, [codeTouched, name]);

  if (!open) return null;
  const valid = Boolean(name.trim() && code.trim());
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4" onMouseDown={onClose}>
      <form role="dialog" aria-modal="true" aria-labelledby="create-agent-title" onMouseDown={(event) => event.stopPropagation()} onSubmit={(event) => { event.preventDefault(); if (valid) onSubmit({ name, code, description, model }); }} className="w-full max-w-lg rounded-xl border border-border bg-surface shadow-2xl">
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <div><h2 id="create-agent-title" className="text-lg font-semibold">新建 Agent Asset</h2><p className="mt-1 text-xs text-text-muted">先创建基础身份，随后进入构建工作区完善资产。</p></div>
          <button type="button" onClick={onClose} className="rounded-md p-2 text-text-muted hover:bg-subtle" aria-label="关闭新建 Agent"><X size={19} /></button>
        </header>
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <label className="text-sm font-medium">Agent 名称<input autoFocus className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="例如：品牌客服" /></label>
          <label className="text-sm font-medium">Agent Code<input className={inputClass} value={code} onChange={(e) => { setCodeTouched(true); setCode(e.target.value); }} placeholder="brand-support" /></label>
          <label className="text-sm font-medium sm:col-span-2">简介<textarea className={`${inputClass} min-h-24 resize-y py-2.5`} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="说明 Agent 的用途和定位" /></label>
          <label className="text-sm font-medium sm:col-span-2">默认模型<input className={inputClass} value={model} onChange={(e) => setModel(e.target.value)} /></label>
          {error && <p className="text-sm text-danger sm:col-span-2">{error}</p>}
        </div>
        <footer className="flex justify-end gap-3 border-t border-border px-5 py-4"><button type="button" onClick={onClose} className="button-secondary">取消</button><button type="submit" disabled={!valid || saving} className="button-primary">{saving ? "创建中…" : "创建并进入构建"}</button></footer>
      </form>
    </div>
  );
}
