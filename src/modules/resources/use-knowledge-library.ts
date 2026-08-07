"use client";

import { useEffect, useState } from "react";
import { DATA_MODE } from "@/config/capabilities";
import { useAuth } from "@/modules/auth/auth-provider";
import { useWorkspace } from "@/modules/workspace/workspace-provider";
import {
  addTextDocument, addUrlDocument, createKnowledgeBase, deleteDocument, deleteKnowledgeBase,
  getDocument, listDocumentChunks, listDocuments, listKnowledgeBases, reindexDocument, updateKnowledgeBase,
} from "./api";
import { createDemoChunks, createDemoKnowledgeBase } from "./knowledge-demo-data";
import { DEMO_DOCUMENTS, DEMO_KNOWLEDGE_BASES } from "./fixtures";
import { createDemoDocument, type KnowledgeDialogKind } from "./knowledge-utils";
import { getSafeResourceError } from "./resource-feedback";
import type { DocumentChunk, KnowledgeBase, KnowledgeDocument } from "./types";
import { uploadKnowledgeDocument } from "./upload-api";

export function useKnowledgeLibrary() {
  const { session } = useAuth();
  const { workspaceCode } = useWorkspace();
  const demo = DATA_MODE === "demo";
  const [bases, setBases] = useState<KnowledgeBase[]>(demo ? DEMO_KNOWLEDGE_BASES : []);
  const [selectedId, setSelectedId] = useState(DEMO_KNOWLEDGE_BASES[0].id);
  const [documents, setDocuments] = useState<KnowledgeDocument[]>(DEMO_DOCUMENTS[DEMO_KNOWLEDGE_BASES[0].id]);
  const [loading, setLoading] = useState(!demo);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [dialog, setDialog] = useState<KnowledgeDialogKind>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [detail, setDetail] = useState<KnowledgeDocument | null>(null);
  const [chunks, setChunks] = useState<DocumentChunk[]>([]);
  const [chunkTotal, setChunkTotal] = useState(0);
  const [detailLoading, setDetailLoading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [busyDocumentId, setBusyDocumentId] = useState<number | null>(null);
  const selected = bases.find((item) => item.id === selectedId);

  useEffect(() => {
    if (demo || !session?.apiKey) return;
    setLoading(true);
    listKnowledgeBases(session.apiKey, workspaceCode)
      .then((items) => { setBases(items); setSelectedId(items[0]?.id || 0); })
      .catch((err: unknown) => setError(getSafeResourceError(err, "无法加载知识库")))
      .finally(() => setLoading(false));
  }, [demo, reloadKey, session?.apiKey, workspaceCode]);

  useEffect(() => {
    setDetail(null); setChunks([]);
    if (!selectedId) { setDocuments([]); return; }
    if (demo) { setDocuments(DEMO_DOCUMENTS[selectedId] || []); return; }
    if (!session?.apiKey) return;
    listDocuments(session.apiKey, workspaceCode, selectedId)
      .then(setDocuments)
      .catch((err: unknown) => setError(getSafeResourceError(err, "无法加载文档")));
  }, [demo, reloadKey, selectedId, session?.apiKey, workspaceCode]);

  function closeDialog() {
    setDialog(null); setName(""); setDescription(""); setTitle(""); setContent(""); setError("");
  }
  function openCreateBase() { closeDialog(); setDialog("create-base"); }
  function openEditBase() {
    if (!selected) return;
    setName(selected.name); setDescription(selected.description || ""); setDialog("edit-base");
  }
  function openDocumentDialog(kind: "text" | "url") { closeDialog(); setDialog(kind); }

  async function saveDialog() {
    if (!session?.apiKey || !dialog) return;
    setBusy(true); setError("");
    try {
      if (dialog === "create-base") {
        const created = demo ? createDemoKnowledgeBase(name, description) : await createKnowledgeBase(session.apiKey, workspaceCode, { name: name.trim(), description: description.trim() });
        setBases((current) => [created, ...current]); setSelectedId(created.id);
      } else if (dialog === "edit-base" && selected) {
        const updated = demo ? { ...selected, name: name.trim(), description: description.trim(), updated_at: new Date().toISOString() } : await updateKnowledgeBase(session.apiKey, workspaceCode, selected.id, { name: name.trim(), description: description.trim() });
        setBases((current) => current.map((base) => base.id === updated.id ? updated : base));
      } else if (selected && (dialog === "text" || dialog === "url")) {
        const created = demo
          ? createDemoDocument(selected.id, dialog, title, content)
          : dialog === "url"
            ? await addUrlDocument(session.apiKey, workspaceCode, selected.id, { title: title.trim(), url: content.trim() })
            : await addTextDocument(session.apiKey, workspaceCode, selected.id, { title: title.trim(), content: content.trim() });
        setDocuments((current) => [created, ...current]);
      }
      closeDialog();
    } catch (err) { setError(getSafeResourceError(err, "保存失败")); }
    finally { setBusy(false); }
  }

  async function uploadFile(file: File) {
    if (!selected || !session?.apiKey) return;
    if (file.size > 20 * 1024 * 1024) { setError("文档不能超过 20MB"); return; }
    setBusy(true); setError("");
    try {
      const created = demo ? createDemoDocument(selected.id, "file", file.name, file.name) : await uploadKnowledgeDocument(session.apiKey, workspaceCode, selected.id, file);
      setDocuments((current) => [created, ...current]);
    } catch (err) { setError(getSafeResourceError(err, "上传文档失败")); }
    finally { setBusy(false); }
  }

  async function removeBase(base: KnowledgeBase) {
    if (!session?.apiKey || !window.confirm(`删除知识库「${base.name}」及其文档？`)) return;
    setBusy(true);
    try {
      if (!demo) await deleteKnowledgeBase(session.apiKey, workspaceCode, base.id);
      const next = bases.filter((item) => item.id !== base.id); setBases(next); setSelectedId(next[0]?.id || 0);
    } catch (err) { setError(getSafeResourceError(err, "删除知识库失败")); }
    finally { setBusy(false); }
  }

  async function openDocument(document: KnowledgeDocument) {
    setDetail(document); setDetailLoading(true); setError("");
    try {
      if (demo || !session?.apiKey) { setChunks(createDemoChunks(document)); setChunkTotal(document.chunk_count); return; }
      const [current, page] = await Promise.all([getDocument(session.apiKey, workspaceCode, document.id), listDocumentChunks(session.apiKey, workspaceCode, document.id, 1, 20)]);
      setDetail(current); setChunks(page.chunks || []); setChunkTotal(page.total || 0);
    } catch (err) { setError(getSafeResourceError(err, "无法加载文档详情")); }
    finally { setDetailLoading(false); }
  }

  async function reindexItem(document: KnowledgeDocument) {
    if (!session?.apiKey) return;
    setBusy(true); setBusyDocumentId(document.id); setError("");
    try {
      const current = demo ? { ...document, status: "processing" as const, progress: 0 } : (await reindexDocument(session.apiKey, workspaceCode, document.id), await getDocument(session.apiKey, workspaceCode, document.id));
      setDetail(current); setDocuments((items) => items.map((doc) => doc.id === current.id ? current : doc));
    } catch (err) { setError(getSafeResourceError(err, "重建索引失败，请重试")); }
    finally { setBusy(false); setBusyDocumentId(null); }
  }

  async function reindexCurrent() { if (detail) await reindexItem(detail); }

  async function removeDocument(document: KnowledgeDocument) {
    if (!session?.apiKey || !window.confirm(`删除文档「${document.title}」？`)) return;
    setBusy(true); setError("");
    try {
      if (!demo) await deleteDocument(session.apiKey, workspaceCode, document.id);
      setDocuments((current) => current.filter((item) => item.id !== document.id));
      if (detail?.id === document.id) setDetail(null);
    } catch (err) { setError(getSafeResourceError(err, "删除文档失败")); }
    finally { setBusy(false); }
  }

  return { bases, selectedId, selected, documents, loading, busy, busyDocumentId, error, dialog, name, description, title, content, detail, chunks, chunkTotal, detailLoading, demo, setSelectedId, setName, setDescription, setTitle, setContent, setDetail, openCreateBase, openEditBase, openDocumentDialog, closeDialog, saveDialog, uploadFile, removeBase, openDocument, reindexItem, reindexCurrent, removeDocument, retry: () => { setError(""); setReloadKey((current) => current + 1); } };
}
