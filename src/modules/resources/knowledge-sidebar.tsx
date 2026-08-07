import { PencilSimple, Plus, Trash } from "@phosphor-icons/react";
import { SourceBadge } from "@/shared/ui/source-badge";
import type { KnowledgeBase } from "./types";

export function KnowledgeSidebar({ bases, selectedId, busy, demo, onSelect, onCreate, onEdit, onDelete }: {
  bases: KnowledgeBase[];
  selectedId: number;
  busy: boolean;
  demo: boolean;
  onSelect: (id: number) => void;
  onCreate: () => void;
  onEdit: () => void;
  onDelete: (base: KnowledgeBase) => void;
}) {
  return <aside className="border-b border-border p-4 lg:border-b-0 lg:border-r"><div className="flex items-center justify-between gap-3 px-1"><div className="flex min-w-0 items-center gap-2"><h2 className="text-base font-semibold">知识库</h2><SourceBadge source={demo ? "demo" : "live"} /></div><button type="button" onClick={onCreate} className="button-secondary control-compact shrink-0"><Plus size={16} />新建</button></div><div className="mt-4 space-y-2">{bases.map((base) => <div key={base.id} className={`group relative flex items-start rounded-xl border transition-colors ${base.id === selectedId ? "border-border bg-surface-elevated before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-full before:bg-primary" : "border-transparent hover:bg-surface-elevated"}`}><button type="button" onClick={() => onSelect(base.id)} aria-pressed={base.id === selectedId} className="min-w-0 flex-1 py-4 pl-4 pr-2 text-left"><strong className="block truncate text-sm font-semibold">{base.name}</strong><span className="mt-1 block line-clamp-2 text-xs leading-5 text-text-secondary">{base.description || "暂无描述"}</span></button>{base.id === selectedId && <button type="button" onClick={onEdit} className="mt-2 rounded-lg p-2 text-text-muted hover:bg-surface hover:text-primary" aria-label={`编辑 ${base.name}`}><PencilSimple size={16} /></button>}<button type="button" onClick={() => onDelete(base)} disabled={busy} className="m-2 rounded-lg p-2 text-text-muted opacity-0 transition-opacity hover:bg-surface hover:text-danger group-hover:opacity-100 group-focus-within:opacity-100" aria-label={`删除 ${base.name}`}><Trash size={16} /></button></div>)}{!bases.length && <div className="rounded-xl border border-dashed border-border px-4 py-10 text-center"><p className="text-sm text-text-secondary">还没有知识库</p><button type="button" onClick={onCreate} className="mt-3 text-sm font-medium text-primary">新建知识库</button></div>}</div></aside>;
}
