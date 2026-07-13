import { ApiError, getApiBaseUrl } from "@/shared/api/http-client";
import { runtimeHeaders } from "./headers";
import type { PendingRuntimeAttachment, RuntimeAttachment } from "./types";

interface UploadData { token: string; download_url?: string; preview_url?: string; expires_in?: number }
interface UploadEnvelope { success?: boolean; data?: UploadData; error?: { code?: string; message?: string } }

const MAX_SIZE = 20 * 1024 * 1024;
const DOCUMENT_EXTENSIONS = [".pdf", ".doc", ".docx", ".txt"];

function isDocument(file: File): boolean {
  const name = file.name.toLowerCase();
  return DOCUMENT_EXTENSIONS.some((extension) => name.endsWith(extension));
}

async function upload(apiKey: string, workspaceCode: string, path: string, file: File): Promise<UploadData> {
  const form = new FormData(); form.append("file", file);
  const response = await fetch(`${getApiBaseUrl()}/api/v1${path}`, { method: "POST", headers: runtimeHeaders(apiKey, workspaceCode), body: form });
  const raw = await response.text();
  let envelope: UploadEnvelope = {};
  try { envelope = raw ? JSON.parse(raw) as UploadEnvelope : {}; }
  catch { throw new ApiError(response.ok ? "服务返回了无法解析的数据" : `HTTP ${response.status}`, response.status); }
  if (!response.ok || envelope.success === false || !envelope.data?.token) {
    if (response.status === 401) window.dispatchEvent(new CustomEvent("agenthub:unauthorized"));
    throw new ApiError(envelope.error?.message || `上传失败（${response.status}）`, response.status, envelope.error?.code);
  }
  return envelope.data;
}

export async function uploadRuntimeFile(apiKey: string, workspaceCode: string, file: File, type: "image" | "file"): Promise<RuntimeAttachment> {
  if (file.size > MAX_SIZE) throw new Error("附件不能超过 20MB");
  if (type === "image" && !file.type.startsWith("image/")) throw new Error("仅支持图片文件");
  if (type === "file" && !isDocument(file)) throw new Error("仅支持 PDF、Word、TXT 文件");
  const data = await upload(apiKey, workspaceCode, type === "image" ? "/files/upload" : "/files/upload-document", file);
  return { type, token: data.token, download_url: data.download_url, preview_url: data.preview_url, mime_type: file.type || undefined, name: file.name, size: file.size };
}

export async function resolveRuntimeAttachments(apiKey: string, workspaceCode: string, attachments: PendingRuntimeAttachment[]): Promise<RuntimeAttachment[]> {
  const resolved: RuntimeAttachment[] = [];
  for (const attachment of attachments) {
    const identifiers = { widget_id: attachment.widget_id, skill_id: attachment.skill_id };
    if (attachment.file) {
      const type = attachment.type === "image" && !isDocument(attachment.file) ? "image" : "file";
      resolved.push({ ...await uploadRuntimeFile(apiKey, workspaceCode, attachment.file, type), ...identifiers });
    } else if (attachment.token) {
      const { file: _file, ...value } = attachment;
      void _file; resolved.push(value);
    }
  }
  return resolved;
}
