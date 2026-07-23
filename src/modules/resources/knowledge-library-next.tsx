"use client";

import { BookOpen, FileText, LinkSimple, Plus, UploadSimple } from "@phosphor-icons/react";
import { useAuth } from "@/modules/auth/auth-provider";
import { useWorkspace } from "@/modules/workspace/workspace-provider";
import { reindexDocument } from "./api";
import { DocumentDetailPanel } from "./document-detail-panel";
import { KnowledgeDialog } from "./knowledge-dialog";
import { KnowledgeDocumentTable } from "./knowledge-document-table";
import { KnowledgeSidebar } from "./knowledge-sidebar";
import type { KnowledgeDocument } from "./types";
import { useKnowledgeLibrary } from "./use-knowledge-library";

export function KnowledgeLibraryNext() {
  const knowledge = useKnowledgeLibrary();
  const { session } = useAuth();
  const { workspaceCode } = useWorkspace();

  async function reindexFromTable(document: KnowledgeDocument) {
    try {
      if (!knowledge.demo && session?.apiKey) await reindexDocument(session.apiKey, workspaceCode, document.id);
      await knowledge.openDocument(document);
    } catch (err) { window.alert(err instanceof Error ? err.message : "重建索引失败"); }
  }

  if (knowledge.loading) return <div className="py-24 text-center text-text-muted">正在加载知识库…</div>;
  return <div className="grid min-h-[620px] lg:grid-cols-[300px_minmax(0,1fr)]">
    <KnowledgeSidebar bases={knowledge.bases} selectedId={knowledge.selectedId} busy={knowledge.busy} demo={knowledge.demo} onSelect={knowledge.setSelectedId} onCreate={knowledge.openCreateBase} onEdit={knowledge.openEditBase} onDelete={(base) => void knowledge.removeBase(base)} />
    <section className="p-5 sm:p-6">{knowledge.selected ? <><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-xl font-semibold">{knowledge.selected.name}</h2><p className="mt-1 text-sm text-text-muted">{knowledge.selected.description || "暂无描述"}</p><p className="mt-2 text-xs text-text-muted">Embedding: {knowledge.selected.embedding_model} · Chunk {knowledge.selected.chunk_size}/{knowledge.selected.chunk_overlap}</p></div><div className="flex flex-wrap gap-2"><label className="button-secondary cursor-pointer"><UploadSimple size={17} />{knowledge.busy ? "处理中…" : "上传文件"}<input type="file" accept=".txt,.md,.markdown,.pdf,.doc,.docx,.csv,.json" disabled={knowledge.busy} className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void knowledge.uploadFile(file); event.currentTarget.value = ""; }} /></label><button type="button" onClick={() => knowledge.openDocumentDialog("text")} className="button-secondary"><FileText size={17} />添加文本</button><button type="button" onClick={() => knowledge.openDocumentDialog("url")} className="button-primary"><LinkSimple size={17} />添加网址</button></div></div>{knowledge.error && <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-danger dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200">{knowledge.error}</div>}<KnowledgeDocumentTable documents={knowledge.documents} onOpen={(document) => void knowledge.openDocument(document)} onReindex={(document) => void reindexFromTable(document)} onDelete={(document) => void knowledge.removeDocument(document)} /></> : <div className="flex min-h-96 flex-col items-center justify-center text-center"><BookOpen size={40} className="text-primary" /><h2 className="mt-3 font-semibold">创建第一个知识库</h2><button type="button" onClick={knowledge.openCreateBase} className="button-primary mt-4"><Plus size={17} />新建知识库</button></div>}</section>
    {knowledge.dialog && <KnowledgeDialog kind={knowledge.dialog} name={knowledge.name} description={knowledge.description} title={knowledge.title} content={knowledge.content} busy={knowledge.busy} error={knowledge.error} onName={knowledge.setName} onDescription={knowledge.setDescription} onTitle={knowledge.setTitle} onContent={knowledge.setContent} onClose={knowledge.closeDialog} onSubmit={() => void knowledge.saveDialog()} />}
    {knowledge.detail && <DocumentDetailPanel document={knowledge.detail} chunks={knowledge.chunks} total={knowledge.chunkTotal} loading={knowledge.detailLoading} busy={knowledge.busy} error={knowledge.error} onClose={() => knowledge.setDetail(null)} onReindex={() => void knowledge.reindexCurrent()} onDelete={() => void knowledge.removeDocument(knowledge.detail!)} />}
  </div>;
}
