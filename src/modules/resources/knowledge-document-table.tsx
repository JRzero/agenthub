"use client";

import { useMemo, useState } from "react";
import { ArrowClockwise, File, FileText, LinkSimple, MagnifyingGlass, Note, Trash } from "@phosphor-icons/react";
import { Select } from "@/shared/ui/select";
import { filterKnowledgeDocuments, getKnowledgeStatusPresentation } from "./knowledge-presentation";
import type { KnowledgeDocument } from "./types";

export function KnowledgeDocumentTable({ documents, busyDocumentId, onOpen, onReindex, onDelete }: {
  documents: KnowledgeDocument[];
  busyDocumentId: number | null;
  onOpen: (document: KnowledgeDocument) => void;
  onReindex: (document: KnowledgeDocument) => void;
  onDelete: (document: KnowledgeDocument) => void;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | KnowledgeDocument["status"]>("all");
  const filtered = useMemo(() => filterKnowledgeDocuments(documents, search, status), [documents, search, status]);
  return <div className="mt-6"><div className="flex flex-wrap items-center gap-3 border-y border-border py-3"><label className="relative min-w-56 flex-1 sm:max-w-72"><span className="sr-only">搜索文档</span><MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={17} /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索文档" className="control-field w-full pl-10" /></label><Select ariaLabel="文档状态" value={status} onValueChange={(value) => setStatus(value as typeof status)} options={[{ value: "all", label: "全部状态" }, { value: "pending", label: "等待索引" }, { value: "processing", label: "索引中" }, { value: "ready", label: "已就绪" }, { value: "failed", label: "索引失败" }]} className="w-40" /><span className="ml-auto text-xs text-text-muted">共 {filtered.length} 个文档</span></div><div className="overflow-x-auto"><div className="min-w-[760px]"><div className="grid grid-cols-[minmax(210px,1fr)_72px_60px_112px_132px_76px] gap-3 border-b border-border px-4 py-3 text-xs text-text-muted"><span>文档</span><span>来源</span><span>分块</span><span>状态</span><span>最近更新</span><span>操作</span></div>{filtered.map((document) => {
    const presentation = getKnowledgeStatusPresentation(document.status);
    const StatusIcon = presentation.icon;
    const SourceIcon = document.source_type === "url" ? LinkSimple : document.source_type === "text" ? Note : File;
    const sourceLabel = document.source_type === "url" ? "网址" : document.source_type === "text" ? "文本" : "文件";
    return <div key={document.id} className="grid grid-cols-[minmax(210px,1fr)_72px_60px_112px_132px_76px] items-center gap-3 border-b border-border px-4 py-3.5 transition-colors last:border-b-0 hover:bg-surface-elevated"><button type="button" onClick={() => onOpen(document)} className="flex min-w-0 items-center gap-3 text-left"><span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-elevated text-text-secondary"><SourceIcon size={19} /></span><strong className="truncate text-sm font-medium">{document.title}</strong></button><span className="text-xs text-text-secondary">{sourceLabel}</span><span className="text-xs text-text-secondary">{document.chunk_count}</span><span className={`inline-flex items-center gap-1.5 text-xs font-medium ${presentation.className}`}><StatusIcon size={16} weight="fill" className={presentation.spinning || busyDocumentId === document.id ? "loading-spin" : ""} />{presentation.label}</span><time className="text-xs text-text-secondary" dateTime={document.updated_at}>{formatUpdatedAt(document.updated_at)}</time><span className="flex"><button type="button" onClick={() => onReindex(document)} disabled={busyDocumentId === document.id} className="icon-button size-8" aria-label={`重建 ${document.title} 索引`}><ArrowClockwise size={16} className={busyDocumentId === document.id ? "loading-spin" : ""} /></button><button type="button" onClick={() => onDelete(document)} className="icon-button size-8 hover:text-danger" aria-label={`删除文档 ${document.title}`}><Trash size={16} /></button></span></div>;
  })}{!filtered.length && <div className="flex min-h-52 flex-col items-center justify-center text-center"><FileText size={36} className="text-primary" /><p className="mt-3 font-medium">{documents.length ? "没有匹配的文档" : "还没有文档"}</p><p className="mt-1 text-sm text-text-muted">{documents.length ? "调整搜索或状态筛选后重试。" : "添加文件、文本或网址，构建可检索的知识资产。"}</p></div>}</div></div></div>;
}

function formatUpdatedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
}
