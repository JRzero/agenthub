import type { KnowledgeDocument } from "./types";

export type KnowledgeDialogKind = "create-base" | "edit-base" | "text" | "url" | null;

export function createDemoDocument(baseId: number, kind: "text" | "url" | "file", title: string, source: string): KnowledgeDocument {
  const now = new Date().toISOString();
  return { id: Date.now(), uuid: `demo-doc-${Date.now()}`, knowledge_base_id: baseId, source_type: kind, source: source.trim(), title: title.trim(), chunk_count: 0, status: "ready", progress: 100, created_at: now, updated_at: now };
}
