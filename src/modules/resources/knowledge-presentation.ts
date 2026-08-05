import { CheckCircle, CircleNotch, Clock, XCircle, type Icon } from "@phosphor-icons/react";
import type { KnowledgeDocument } from "./types";

export interface KnowledgeStatusPresentation {
  label: string;
  icon: Icon;
  className: string;
  spinning?: boolean;
}

const documentStatuses: Record<KnowledgeDocument["status"], KnowledgeStatusPresentation> = {
  pending: { label: "等待索引", icon: Clock, className: "text-warning" },
  processing: { label: "索引中", icon: CircleNotch, className: "text-info", spinning: true },
  ready: { label: "已就绪", icon: CheckCircle, className: "text-success" },
  failed: { label: "索引失败", icon: XCircle, className: "text-danger" },
};

export function getKnowledgeStatusPresentation(status: KnowledgeDocument["status"]): KnowledgeStatusPresentation {
  return documentStatuses[status];
}

export function filterKnowledgeDocuments(documents: KnowledgeDocument[], search: string, status: "all" | KnowledgeDocument["status"]): KnowledgeDocument[] {
  const keyword = search.trim().toLowerCase();
  return documents.filter((document) => (status === "all" || document.status === status)
    && (!keyword || `${document.title} ${document.source}`.toLowerCase().includes(keyword)));
}

export function getDocumentSourceLabel(document: KnowledgeDocument): string {
  if (document.source_type !== "file") return document.source;
  const segments = document.source.replace(/\\/g, "/").split("/");
  return segments.at(-1) || document.title;
}
