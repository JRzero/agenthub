export type RuntimeAttachmentType = "file" | "image" | "audio";

export interface RuntimeAttachment {
  type: RuntimeAttachmentType;
  token?: string;
  url?: string;
  data?: string;
  download_url?: string;
  preview_url?: string;
  mime_type?: string;
  name?: string;
  size?: number;
  widget_id?: string;
  skill_id?: string;
}

export interface PendingRuntimeAttachment extends RuntimeAttachment {
  file?: File;
}

export type RuntimeWidgetType =
  | "file_upload" | "image_upload" | "document_upload"
  | "text" | "textarea" | "number" | "select" | "checkbox" | "switch"
  | "date_picker" | "custom";

export interface RuntimeWidgetSpec {
  id: string;
  type: RuntimeWidgetType;
  label: string;
  config: Record<string, unknown>;
  skill_id: string;
}

export interface RuntimeSession {
  id: number;
  uuid: string;
  agent_id: number;
  user_id: number;
  creator_id: number;
  status: string;
  message_count: number;
  total_tokens: number;
  created_at: string;
  title?: string | null;
  session_type?: string;
}

export interface RuntimeUsage {
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
}

export interface RuntimeMessage {
  id: number | string;
  uuid: string;
  session_id: number;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  content_type: string;
  attachments?: RuntimeAttachment[];
  metadata?: Record<string, unknown>;
  created_at: string;
  audio_url?: string;
  model?: string;
  usage?: RuntimeUsage;
}

export interface RuntimeMessageResponse {
  message_id: string;
  content: string;
  role: string;
  model: string;
  usage?: RuntimeUsage;
  audio_url?: string;
  docx_url?: string;
  image_url?: string;
  attachments?: RuntimeAttachment[];
}

export interface RuntimeMessageOptions {
  attachments?: RuntimeAttachment[];
  metadata?: { custom_fields?: Record<string, unknown> };
}

export type RuntimeStreamEvent =
  | { type: "delta"; text: string }
  | { type: "done"; message_id: string; usage?: RuntimeUsage }
  | { type: "error"; error?: string };

export interface EdgeStatusEvent {
  type: "edge_status";
  subtype: "status" | "progress" | "info";
  content: string;
  metadata?: { tool_name?: string; skill_name?: string; stage?: "pre_skill" | "tool_call" | "tool_done" | "post_skill"; [key: string]: unknown };
}
