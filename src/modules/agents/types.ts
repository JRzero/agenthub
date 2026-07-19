export interface ExampleMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AgentConfig {
  system_prompt?: string;
  temperature?: number;
  examples?: ExampleMessage[];
  skills?: string[];
  metadata?: {
    avatar?: string;
    character_design_spec?: string;
    character_design_sheet?: string;
  };
  show_reasoning?: boolean;
  show_tools?: boolean;
}

export interface Agent {
  id: number;
  uuid: string;
  code: string;
  name: string;
  description: string;
  model: string;
  status: string;
  agent_type: "cloud" | "edge";
  edge_status: "offline" | "online";
  edge_token?: string;
  memory_enabled: boolean;
  hidden?: boolean;
  llm_api_key_configured?: boolean;
  knowledge_base_id?: number | null;
  version: number;
  current_version_id?: number | null;
  draft_base_version_id?: number | null;
  draft_revision?: number;
  draft_content_hash?: string;
  published_at?: string | null;
  system_prompt?: string;
  temperature?: number;
  config?: AgentConfig;
  llm_provider?: string;
  llm_temperature?: number | null;
  llm_provider_type?: string;
  llm_base_url?: string;
  llm_model_name?: string;
  updated_at?: string;
}
