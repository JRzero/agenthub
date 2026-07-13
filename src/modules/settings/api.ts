import { apiRequest, getApiBaseUrl } from "@/shared/api/http-client";
import type { CreatorProfile, ProfileInput } from "./types";

export function getProfile(apiKey: string): Promise<CreatorProfile> {
  return apiRequest<CreatorProfile>("/profile", { method: "GET", apiKey });
}

export function updateProfile(apiKey: string, input: ProfileInput): Promise<CreatorProfile> {
  return apiRequest<CreatorProfile>("/profile", { method: "PUT", apiKey, body: JSON.stringify(input) });
}

export function changePassword(apiKey: string, currentPassword: string, newPassword: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("/profile/password", { method: "PUT", apiKey, body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }) });
}

export function deleteCreatorAvatar(apiKey: string): Promise<CreatorProfile> {
  return apiRequest<CreatorProfile>("/profile/avatar", { method: "DELETE", apiKey });
}

export async function uploadCreatorAvatar(apiKey: string, file: File): Promise<CreatorProfile> {
  const form = new FormData();
  form.append("avatar", file);
  const response = await fetch(`${getApiBaseUrl()}/api/v1/profile/avatar`, { method: "POST", headers: { "X-API-Key": apiKey }, body: form });
  const envelope = await response.json() as { success?: boolean; data?: CreatorProfile; error?: { message?: string } };
  if (!response.ok || envelope.success === false || !envelope.data) throw new Error(envelope.error?.message || `头像上传失败（${response.status}）`);
  return envelope.data;
}

export function getCreatorAvatarUrl(profile: CreatorProfile | null): string | null {
  const avatar = profile?.metadata?.avatar;
  if (!avatar) return null;
  return `${getApiBaseUrl()}/api/v1/avatars/${avatar}?t=${Math.floor(Date.now() / 60000)}`;
}
