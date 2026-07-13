import { ApiError, getApiBaseUrl } from "@/shared/api/http-client";
import type { KnowledgeDocument } from "./types";

interface UploadEnvelope {
  success?: boolean;
  data?: KnowledgeDocument;
  error?: { code?: string; message?: string };
}

export async function uploadKnowledgeDocument(
  apiKey: string,
  workspaceCode: string,
  knowledgeBaseId: number,
  file: File,
): Promise<KnowledgeDocument> {
  const form = new FormData();
  form.append("file", file);
  const headers: Record<string, string> = { "X-API-Key": apiKey };
  if (workspaceCode && workspaceCode !== "default") headers["X-Workspace-Code"] = workspaceCode;

  const response = await fetch(`${getApiBaseUrl()}/api/v1/knowledge-bases/${knowledgeBaseId}/documents/upload`, {
    method: "POST",
    headers,
    body: form,
  });
  const raw = await response.text();
  let envelope: UploadEnvelope = {};
  try {
    envelope = raw ? JSON.parse(raw) as UploadEnvelope : {};
  } catch {
    throw new ApiError(response.ok ? "服务返回了无法解析的数据" : `HTTP ${response.status}`, response.status);
  }
  if (!response.ok || envelope.success === false || !envelope.data) {
    if (response.status === 401) window.dispatchEvent(new CustomEvent("agenthub:unauthorized"));
    throw new ApiError(envelope.error?.message || `上传失败（${response.status}）`, response.status, envelope.error?.code);
  }
  return envelope.data;
}
