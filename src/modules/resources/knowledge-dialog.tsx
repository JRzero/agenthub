import { X } from "@phosphor-icons/react";
import type { KnowledgeDialogKind } from "./knowledge-utils";

export function KnowledgeDialog({ kind, name, description, title, content, busy, error, onName, onDescription, onTitle, onContent, onClose, onSubmit }: {
  kind: Exclude<KnowledgeDialogKind, null>;
  name: string;
  description: string;
  title: string;
  content: string;
  busy: boolean;
  error: string;
  onName: (value: string) => void;
  onDescription: (value: string) => void;
  onTitle: (value: string) => void;
  onContent: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const base = kind === "create-base" || kind === "edit-base";
  const heading = kind === "create-base" ? "新建知识库" : kind === "edit-base" ? "编辑知识库" : kind === "url" ? "添加网址" : "添加文本";
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4" onMouseDown={onClose}><form role="dialog" aria-modal="true" aria-labelledby="knowledge-dialog-title" onMouseDown={(event) => event.stopPropagation()} onSubmit={(event) => { event.preventDefault(); onSubmit(); }} className="w-full max-w-lg rounded-xl bg-surface shadow-2xl"><header className="flex items-center justify-between border-b border-border px-5 py-4"><div><h2 id="knowledge-dialog-title" className="font-semibold">{heading}</h2><p className="mt-1 text-xs text-text-muted">{base ? "维护知识资产容器" : "内容将进入现有索引流程"}</p></div><button type="button" onClick={onClose} aria-label="关闭知识弹窗" className="p-2"><X size={18} /></button></header><div className="space-y-4 p-5">{base ? <><label className="block text-sm font-medium">名称<input autoFocus value={name} onChange={(event) => onName(event.target.value)} className="mt-2 h-10 w-full rounded-md border border-border px-3" /></label><label className="block text-sm font-medium">描述<textarea value={description} onChange={(event) => onDescription(event.target.value)} className="mt-2 min-h-24 w-full rounded-md border border-border p-3" /></label></> : <><label className="block text-sm font-medium">标题<input autoFocus value={title} onChange={(event) => onTitle(event.target.value)} className="mt-2 h-10 w-full rounded-md border border-border px-3" /></label><label className="block text-sm font-medium">{kind === "url" ? "网址" : "正文"}<textarea value={content} onChange={(event) => onContent(event.target.value)} className="mt-2 min-h-32 w-full rounded-md border border-border p-3" /></label></>}{error && <p className="text-sm text-danger">{error}</p>}</div><footer className="flex justify-end gap-3 border-t border-border px-5 py-4"><button type="button" onClick={onClose} className="button-secondary">取消</button><button type="submit" disabled={busy || (base ? !name.trim() : !title.trim() || !content.trim())} className="button-primary">{busy ? "保存中…" : "保存"}</button></footer></form></div>;
}
