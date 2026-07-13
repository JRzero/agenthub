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
  return <aside className="border-b border-border p-5 lg:border-b-0 lg:border-r"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><h2 className="font-semibold">知识库</h2><SourceBadge source={demo ? "demo" : "live"} /></div><button type="button" onClick={onCreate} className="rounded-md p-2 text-primary hover:bg-primary-soft" aria-label="新建知识库"><Plus size={18} /></button></div><div className="mt-4 space-y-2">{bases.map((base) => <div key={base.id} className={`group flex items-start rounded-lg border ${base.id === selectedId ? "border-primary bg-primary-soft" : "border-border"}`}><button type="button" onClick={() => onSelect(base.id)} className="min-w-0 flex-1 p-3 text-left"><strong className="block truncate text-sm">{base.name}</strong><span className="mt-1 block line-clamp-2 text-xs leading-5 text-text-muted">{base.description || "暂无描述"}</span></button>{base.id === selectedId && <button type="button" onClick={onEdit} className="mt-2 rounded p-1.5 text-text-muted hover:bg-surface hover:text-primary" aria-label={`编辑 ${base.name}`}><PencilSimple size={16} /></button>}<button type="button" onClick={() => onDelete(base)} disabled={busy} className="m-2 rounded p-1.5 text-text-muted opacity-0 hover:bg-rose-50 hover:text-danger group-hover:opacity-100" aria-label={`删除 ${base.name}`}><Trash size={16} /></button></div>)}{!bases.length && <p className="py-12 text-center text-sm text-text-muted">还没有知识库</p>}</div></aside>;
}
