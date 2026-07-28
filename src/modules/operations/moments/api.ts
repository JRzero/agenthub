import { apiRequest, getApiBaseUrl } from "@/shared/api/http-client";
import type {
  CreateMomentInput,
  MomentAuth,
  MomentComment,
  MomentItem,
  MomentPage,
  MomentQuery,
  MomentScheduleResult,
  MomentUpload,
} from "./types";

function normalizeMoment(item: MomentItem): MomentItem {
  return {
    ...item,
    image_urls: item.image_urls || [],
    thumbnail_urls: item.thumbnail_urls || item.image_urls || [],
    video_urls: item.video_urls || [],
    comments: item.comments || [],
  };
}

function normalizePage(
  result: { moments?: MomentItem[]; total?: number },
  limit: number,
  offset: number,
): MomentPage {
  return {
    moments: (result.moments || []).map(normalizeMoment),
    total: typeof result.total === "number" ? result.total : null,
    limit,
    offset,
  };
}

export function getMomentDraft(auth: MomentAuth, agentId: number) {
  return apiRequest<{ content: string; agent_name: string }>(
    `/agents/${agentId}/moments/draft`,
    auth,
  );
}

export async function uploadMomentImage(
  auth: MomentAuth,
  file: File,
): Promise<MomentUpload> {
  if (!file.type.startsWith("image/")) throw new Error("仅支持图片文件");
  if (file.size > 20 * 1024 * 1024) throw new Error("图片不能超过 20MB");
  const form = new FormData();
  form.append("file", file);
  const headers: Record<string, string> = { "X-API-Key": auth.apiKey };
  if (auth.workspaceCode && auth.workspaceCode !== "default") {
    headers["X-Workspace-Code"] = auth.workspaceCode;
  }
  const response = await fetch(
    `${getApiBaseUrl()}/api/v1/files/upload-moment-image`,
    { method: "POST", headers, body: form },
  );
  const envelope = (await response.json()) as {
    success?: boolean;
    data?: MomentUpload;
    error?: { message?: string };
  };
  if (!response.ok || envelope.success === false || !envelope.data) {
    throw new Error(
      envelope.error?.message || `图片上传失败（${response.status}）`,
    );
  }
  return envelope.data;
}

export async function createMoment(
  auth: MomentAuth,
  agentId: number,
  input: CreateMomentInput,
) {
  const result = await apiRequest<MomentItem>(`/agents/${agentId}/moments`, {
    ...auth,
    method: "POST",
    body: JSON.stringify(input),
  });
  return normalizeMoment(result);
}

export async function listMoments(auth: MomentAuth, query: MomentQuery = {}) {
  const limit = query.limit ?? 20;
  const offset = query.offset ?? 0;
  const path = query.agentId
    ? `/agents/${query.agentId}/moments?limit=${limit}&offset=${offset}`
    : `/moments?limit=${limit}&offset=${offset}`;
  const result = await apiRequest<{ moments?: MomentItem[]; total?: number }>(
    path,
    auth,
  );
  return normalizePage(result, limit, offset);
}

export async function getMoment(auth: MomentAuth, momentId: number) {
  const result = await apiRequest<MomentItem>(`/moments/${momentId}`, auth);
  return normalizeMoment(result);
}

export async function deleteMoment(
  auth: MomentAuth,
  agentId: number,
  momentId: number,
) {
  return apiRequest<{ message: string }>(
    `/agents/${agentId}/moments/${momentId}`,
    { ...auth, method: "DELETE" },
  );
}

export function addMomentComment(
  auth: MomentAuth,
  momentId: number,
  content: string,
) {
  return apiRequest<MomentComment>(`/moments/${momentId}/comments`, {
    ...auth,
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

export async function listMomentComments(
  auth: MomentAuth,
  momentId: number,
) {
  const result = await apiRequest<{ comments?: MomentComment[] }>(
    `/moments/${momentId}/comments`,
    auth,
  );
  return result.comments || [];
}

export function getMomentSchedule(auth: MomentAuth, agentId: number) {
  return apiRequest<MomentScheduleResult>(
    `/agents/${agentId}/moments/auto-schedule`,
    auth,
  );
}

export function generateMomentSchedule(auth: MomentAuth, agentId: number) {
  return apiRequest<MomentScheduleResult>(
    `/agents/${agentId}/moments/auto-schedule`,
    { ...auth, method: "POST" },
  );
}

export function deleteMomentSchedule(auth: MomentAuth, agentId: number) {
  return apiRequest<{ message: string }>(
    `/agents/${agentId}/moments/auto-schedule`,
    { ...auth, method: "DELETE" },
  );
}
