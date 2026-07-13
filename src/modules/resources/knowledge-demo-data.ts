import { DEMO_KNOWLEDGE_BASES } from "./fixtures";
import type { DocumentChunk, KnowledgeBase, KnowledgeDocument } from "./types";

export function createDemoKnowledgeBase(name: string, description: string): KnowledgeBase {
  return { ...DEMO_KNOWLEDGE_BASES[0], id: Date.now(), uuid: `demo-${Date.now()}`, name: name.trim(), description: description.trim() };
}

export function createDemoChunks(document: KnowledgeDocument): DocumentChunk[] {
  const content = document.source_type === "url" ? `来源网址：${document.source}` : `${document.title} 的示例知识分块。`;
  return [{ index: 0, content }];
}
