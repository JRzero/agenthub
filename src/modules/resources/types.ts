export interface ConfigProperty {
  type?: string;
  description?: string;
  default?: unknown;
  enum?: string[];
  enumLabels?: Record<string, string>;
}

export interface SkillConfigSchema {
  properties?: Record<string, ConfigProperty>;
  required?: string[];
}

export interface MarketplaceSkill {
  id: number;
  uuid: string;
  name: string;
  description: string;
  description_for_llm?: string | null;
  default_tool_description?: string;
  config_doc?: string | null;
  stage: string;
  implementation_type: string;
  trigger_config?: unknown;
  config_schema?: SkillConfigSchema;
  category?: string;
}

export interface CreatorSkill {
  id: number;
  uuid: string;
  creator_id?: number;
  skill_id: number;
  skill_name?: string;
  name: string;
  stage?: string;
  implementation_type?: string;
  default_tool_description?: string;
  status: string;
  config: Record<string, unknown>;
  config_schema?: SkillConfigSchema;
  created_at?: string;
  updated_at?: string;
}

export interface KnowledgeBase {
  id: number;
  uuid: string;
  name: string;
  description: string;
  embedding_model: string;
  chunk_size: number;
  chunk_overlap: number;
  metadata?: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeDocument {
  id: number;
  uuid: string;
  knowledge_base_id: number;
  source_type: "file" | "url" | "text";
  source: string;
  title: string;
  file_size?: number | null;
  char_count?: number | null;
  chunk_count: number;
  status: "pending" | "processing" | "ready" | "failed";
  progress: number;
  error_message?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentChunk {
  index: number;
  content: string;
  score?: number;
}

export interface DocumentChunksResponse {
  chunks: DocumentChunk[];
  total: number;
  page: number;
  page_size: number;
}

export type ResourceTab = "skills" | "knowledge" | "media" | "templates";
