import type { RuntimeAttachment } from "@/modules/agent-runtime/types";

export interface SharedSessionInfo {
  id: number;
  uuid: string;
  title?: string | null;
  status: string;
  source: string;
  message_count: number;
  total_tokens: number;
  verified: boolean;
  created_at: string;
  updated_at: string;
  last_message_at?: string | null;
  custom_prompt_patch?: string | null;
  is_group?: boolean;
  group_id?: number | null;
}

export interface SharedSessionRow {
  session: SharedSessionInfo;
  agent: { id: number; uuid: string; name: string; code?: string; avatar: string; agent_type: string; online: boolean };
  human: { id: number; uuid: string; username: string; display_name?: string; avatar: string };
}

export interface SharedUser {
  user_id: number;
  username: string;
  display_name?: string;
  uuid?: string;
  avatar?: string;
  session_count: number;
}

export interface SessionMessage {
  id: number;
  uuid: string;
  session_id: number;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  content_type: string;
  attachments?: RuntimeAttachment[];
  metadata?: Record<string, unknown>;
  audio_url?: string;
  created_at: string;
  sender_agent_id?: number | null;
  sender_name?: string | null;
}

export interface UserAgentPrompt {
  id: number;
  agent_id: number;
  user_id: number;
  prompt: string;
}

export type PromptScope = "session" | "user";
