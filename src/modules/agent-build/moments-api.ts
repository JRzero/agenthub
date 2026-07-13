import { apiRequest, getApiBaseUrl } from "@/shared/api/http-client";

export interface MomentComment { id: number; creator_id?: number; creator_name: string; content: string; created_at?: string }
export interface MomentItem { id: number; agent_id: number; agent_name: string; agent_avatar?: string; content: string; image_urls: string[]; thumbnail_urls: string[]; video_urls: string[]; created_at: string; like_count?: number; comments?: MomentComment[] }
export interface MomentScheduleItem { id: number; scheduled_at: string; status: string; moment_id?: number }
export interface MomentScheduleResult { config: { agent_id: number; enabled: boolean; weekdays: number[]; daily_times: string[]; timezone: string; week_start: string } | null; schedules: MomentScheduleItem[]; reasoning?: string }

export function getMomentDraft(apiKey: string, agentId: number): Promise<{ content: string; agent_name: string }> {
  return apiRequest<{ content: string; agent_name: string }>(`/agents/${agentId}/moments/draft`, { apiKey });
}

export async function uploadMomentImage(apiKey: string, file: File): Promise<{ token: string; url_800: string; url_240: string }> {
  if (!file.type.startsWith("image/")) throw new Error("仅支持图片文件");
  if (file.size > 20 * 1024 * 1024) throw new Error("图片不能超过 20MB");
  const form = new FormData(); form.append("file", file);
  const response = await fetch(`${getApiBaseUrl()}/api/v1/files/upload-moment-image`, { method: "POST", headers: { "X-API-Key": apiKey }, body: form });
  const envelope = await response.json() as { success?: boolean; data?: { token: string; url_800: string; url_240: string }; error?: { message?: string } };
  if (!response.ok || envelope.success === false || !envelope.data) throw new Error(envelope.error?.message || `图片上传失败（${response.status}）`);
  return envelope.data;
}

export function createMoment(apiKey: string, agentId: number, input: { content: string; image_tokens?: string[]; video_urls?: string[]; auto_image?: boolean }): Promise<MomentItem> {
  return apiRequest<MomentItem>(`/agents/${agentId}/moments`, { method: "POST", apiKey, body: JSON.stringify(input) });
}

export async function listMoments(apiKey: string, agentId: number): Promise<MomentItem[]> {
  const result = await apiRequest<{ moments: MomentItem[] }>(`/agents/${agentId}/moments?limit=50&offset=0`, { apiKey });
  return result.moments || [];
}

export function deleteMoment(apiKey: string, agentId: number, momentId: number): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/agents/${agentId}/moments/${momentId}`, { method: "DELETE", apiKey });
}

export function addMomentComment(apiKey: string, momentId: number, content: string): Promise<MomentComment> {
  return apiRequest<MomentComment>(`/moments/${momentId}/comments`, { method: "POST", apiKey, body: JSON.stringify({ content }) });
}

export function getMomentSchedule(apiKey: string, agentId: number): Promise<MomentScheduleResult> {
  return apiRequest<MomentScheduleResult>(`/agents/${agentId}/moments/auto-schedule`, { apiKey });
}

export function generateMomentSchedule(apiKey: string, agentId: number): Promise<MomentScheduleResult> {
  return apiRequest<MomentScheduleResult>(`/agents/${agentId}/moments/auto-schedule`, { method: "POST", apiKey });
}

export function deleteMomentSchedule(apiKey: string, agentId: number): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/agents/${agentId}/moments/auto-schedule`, { method: "DELETE", apiKey });
}
