import { ArrowClockwise, X } from "@phosphor-icons/react";
import type { DocumentChunk, KnowledgeDocument } from "./types";

export function DocumentDetailPanel({ document, chunks, total, loading, busy, error, onClose, onReindex, onDelete }: {
  document: KnowledgeDocument;
  chunks: DocumentChunk[];
  total: number;
  loading: boolean;
  busy: boolean;
  error: string;
  onClose: () => void;
  onReindex: () => void;
  onDelete: () => void;
}) {
  return <div className="fixed inset-0 z-50 bg-slate-950/30" onMouseDown={onClose}><aside role="dialog" aria-modal="true" aria-labelledby="document-detail-title" onMouseDown={(event) => event.stopPropagation()} className="ml-auto flex h-full w-full max-w-xl flex-col bg-surface shadow-2xl"><header className="flex items-start justify-between border-b border-border px-5 py-4"><div className="min-w-0"><h2 id="document-detail-title" className="truncate font-semibold">{document.title}</h2><p className="mt-1 text-xs text-text-muted">{document.source_type} · {document.status} · {document.progress}%</p></div><button type="button" onClick={onClose} aria-label="关闭文档详情" className="p-2"><X size={18} /></button></header><div className="flex-1 overflow-y-auto p-5"><dl className="grid grid-cols-2 gap-4 rounded-lg bg-subtle p-4 text-sm"><div><dt className="text-xs text-text-muted">分块</dt><dd className="mt-1 font-medium">{document.chunk_count}</dd></div><div><dt className="text-xs text-text-muted">字符</dt><dd className="mt-1 font-medium">{document.char_count ?? "—"}</dd></div><div className="col-span-2"><dt className="text-xs text-text-muted">来源</dt><dd className="mt-1 break-all font-medium">{document.source}</dd></div></dl>{error && <p className="mt-4 text-sm text-danger">{error}</p>}<div className="mt-6 flex items-center justify-between"><h3 className="font-semibold">知识分块</h3><span className="text-xs text-text-muted">首屏 {chunks.length} / 共 {total}</span></div>{loading ? <p className="py-12 text-center text-sm text-text-muted">正在加载分块…</p> : <div className="mt-3 space-y-3">{chunks.map((chunk) => <article key={chunk.index} className="rounded-lg border border-border p-4"><div className="mb-2 flex justify-between text-xs text-text-muted"><span>Chunk {chunk.index + 1}</span>{chunk.score !== undefined && <span>score {chunk.score.toFixed(3)}</span>}</div><p className="whitespace-pre-wrap text-sm leading-6">{chunk.content}</p></article>)}{!chunks.length && <p className="rounded-lg border border-dashed border-border py-12 text-center text-sm text-text-muted">暂无可查看分块</p>}</div>}</div><footer className="flex justify-between gap-3 border-t border-border px-5 py-4"><button type="button" onClick={onDelete} disabled={busy} className="button-secondary text-danger">删除文档</button><button type="button" onClick={onReindex} disabled={busy} className="button-primary"><ArrowClockwise size={17} />{busy ? "处理中…" : "重建索引"}</button></footer></aside></div>;
}
