"use client";

import { BookOpen, FileText, LinkSimple, Plus, UploadSimple } from "@phosphor-icons/react";
import { DocumentDetailPanel } from "./document-detail-panel";
import { KnowledgeDialog } from "./knowledge-dialog";
import { KnowledgeDocumentTable } from "./knowledge-document-table";
import { KnowledgeSidebar } from "./knowledge-sidebar";
import { ResourceErrorFeedback } from "./resource-error-feedback";
import { useKnowledgeLibrary } from "./use-knowledge-library";

export function KnowledgeLibraryNext() {
  const knowledge = useKnowledgeLibrary();

  if (knowledge.loading) return <KnowledgeLoading />;
  return <div className="grid min-h-[620px] lg:grid-cols-[290px_minmax(0,1fr)]">
    <KnowledgeSidebar bases={knowledge.bases} selectedId={knowledge.selectedId} busy={knowledge.busy} demo={knowledge.demo} onSelect={knowledge.setSelectedId} onCreate={knowledge.openCreateBase} onEdit={knowledge.openEditBase} onDelete={(base) => void knowledge.removeBase(base)} />
    <section className="min-w-0 p-5 sm:p-6">{knowledge.selected ? <><div className="flex flex-wrap items-start justify-between gap-4"><div className="min-w-0"><h2 className="text-xl font-semibold">{knowledge.selected.name}</h2><p className="mt-1 text-sm text-text-secondary">{knowledge.selected.description || "暂无描述"}</p><p className="mt-3 text-xs text-text-muted">Embedding: {knowledge.selected.embedding_model} · Chunk {knowledge.selected.chunk_size} / {knowledge.selected.chunk_overlap}</p></div><div className="flex flex-wrap gap-2"><label className="button-secondary cursor-pointer"><UploadSimple size={17} />{knowledge.busy ? "处理中…" : "上传文件"}<input type="file" accept=".txt,.md,.markdown,.pdf,.doc,.docx,.csv,.json" disabled={knowledge.busy} className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void knowledge.uploadFile(file); event.currentTarget.value = ""; }} /></label><button type="button" onClick={() => knowledge.openDocumentDialog("text")} className="button-secondary"><FileText size={17} />添加文本</button><button type="button" onClick={() => knowledge.openDocumentDialog("url")} className="button-primary"><LinkSimple size={17} />添加网址</button></div></div><ResourceErrorFeedback message={knowledge.error} onRetry={knowledge.retry} className="mt-4" /><KnowledgeDocumentTable documents={knowledge.documents} busyDocumentId={knowledge.busyDocumentId} onOpen={(document) => void knowledge.openDocument(document)} onReindex={(document) => void knowledge.reindexItem(document)} onDelete={(document) => void knowledge.removeDocument(document)} /></> : <div className="flex min-h-96 flex-col items-center justify-center text-center"><BookOpen size={40} className="text-primary" /><h2 className="mt-3 font-semibold">创建第一个知识库</h2><p className="mt-2 text-sm text-text-secondary">知识库用于组织 Agent 可检索的文档。</p><button type="button" onClick={knowledge.openCreateBase} className="button-primary mt-4"><Plus size={17} />新建知识库</button></div>}</section>
    {knowledge.dialog && <KnowledgeDialog kind={knowledge.dialog} name={knowledge.name} description={knowledge.description} title={knowledge.title} content={knowledge.content} busy={knowledge.busy} error={knowledge.error} onName={knowledge.setName} onDescription={knowledge.setDescription} onTitle={knowledge.setTitle} onContent={knowledge.setContent} onClose={knowledge.closeDialog} onSubmit={() => void knowledge.saveDialog()} />}
    {knowledge.detail && <DocumentDetailPanel document={knowledge.detail} chunks={knowledge.chunks} total={knowledge.chunkTotal} loading={knowledge.detailLoading} busy={knowledge.busy} error={knowledge.error} onClose={() => knowledge.setDetail(null)} onReindex={() => void knowledge.reindexCurrent()} onDelete={() => void knowledge.removeDocument(knowledge.detail!)} />}
  </div>;
}

function KnowledgeLoading() {
  return <div className="grid min-h-[620px] animate-pulse lg:grid-cols-[290px_minmax(0,1fr)]" aria-label="正在加载知识库"><div className="border-r border-border p-5"><div className="h-10 rounded-lg bg-surface-elevated" /><div className="mt-4 h-24 rounded-xl bg-surface-elevated" /></div><div className="p-6"><div className="h-20 rounded-xl bg-surface-elevated" /><div className="mt-6 h-64 rounded-xl bg-surface-elevated" /></div></div>;
}
