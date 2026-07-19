import type {
  AgentClient,
  AgentClientRuntimeVersion,
  AgentVersion,
} from "@/modules/agent-versions/types";

const AGENT_ID = 32;
const CURRENT_VERSION_ID = 104;

export const DEMO_AGENT_VERSIONS: AgentVersion[] = [
  {
    id: CURRENT_VERSION_ID,
    agent_id: AGENT_ID,
    version_no: 4,
    version_hash: "8f31a7c2d4e9a6bd7118e916f14284c388584a1f2248e448",
    hash_schema_version: 1,
    config_snapshot: {
      name: "林月",
      description: "星海内容工作室的陪伴型 Agent",
      model: "qwen-max",
      system_prompt: "温柔、敏锐，善于接住用户的情绪，但不会替用户做决定。",
      temperature: 0.7,
      skills: ["realtime_weather", "image_generation", "document_search"],
      memory_enabled: true,
      deployment: "cloud",
    },
    resource_manifest: {
      avatar: "/images/lin-yue-avatar.png",
      character_design: "lin-yue-sheet.png",
      knowledge_base: "情绪陪伴知识库",
      prompt_templates: ["companion-v4"],
    },
    required_capabilities: ["text_chat", "image_generation", "document_search"],
    change_summary: { summary: "优化角色表达与媒体素材" },
    release_note: "优化角色表达与媒体素材",
    availability: "available",
    created_by: 7,
    created_by_name: "Jin",
    created_at: "2026-07-17T14:20:00+08:00",
  },
  {
    id: 103,
    agent_id: AGENT_ID,
    version_no: 3,
    version_hash: "0ad7d2f94a9f37e2d08fc63b0ce8235088150c292acc6c21",
    hash_schema_version: 1,
    config_snapshot: {
      name: "林月",
      description: "陪伴型 Agent",
      model: "qwen-max",
      skills: ["realtime_weather", "image_generation"],
      memory_enabled: true,
    },
    resource_manifest: {
      avatar: "/images/lin-yue-avatar.png",
      knowledge_base: "情绪陪伴知识库",
    },
    required_capabilities: ["text_chat", "image_generation"],
    change_summary: { summary: "新增图片生成技能" },
    release_note: "新增图片生成技能",
    availability: "available",
    created_by: 7,
    created_by_name: "Jin",
    created_at: "2026-07-16T09:35:00+08:00",
  },
  {
    id: 102,
    agent_id: AGENT_ID,
    version_no: 2,
    version_hash: "31bd69f40a724df411a0d7ccf0e6eb9253c166fed8ff23ee",
    hash_schema_version: 1,
    config_snapshot: {
      name: "林月",
      description: "陪伴型 Agent",
      model: "qwen-max",
      skills: ["realtime_weather"],
      memory_enabled: false,
    },
    resource_manifest: {
      avatar: "/images/lin-yue-avatar.png",
    },
    required_capabilities: ["text_chat"],
    change_summary: { summary: "更新角色设定" },
    release_note: "更新角色设定",
    availability: "available",
    created_by: 7,
    created_by_name: "Jin",
    created_at: "2026-07-12T14:20:00+08:00",
  },
  {
    id: 101,
    agent_id: AGENT_ID,
    version_no: 1,
    version_hash: "e01d0f77dc5b4f40e64dd50d06aa1b1f92cb8f1b8bb9e422",
    hash_schema_version: 1,
    config_snapshot: {
      name: "林月",
      description: "陪伴型 Agent",
      model: "qwen-max",
      skills: [],
      memory_enabled: false,
    },
    resource_manifest: {
      avatar: "/images/lin-yue-avatar.png",
    },
    required_capabilities: ["text_chat"],
    change_summary: { summary: "初始版本" },
    release_note: "初始版本",
    availability: "available",
    created_by: 7,
    created_by_name: "Jin",
    created_at: "2026-07-08T10:00:00+08:00",
  },
];

export const DEMO_AGENT_CLIENTS: AgentClient[] = [
  {
    id: 201,
    uuid: "demo-client-oyiioyii",
    agent_id: AGENT_ID,
    client_key: "oyiioyii",
    client_type: "web_chat",
    name: "OyiiOyii",
    status: "enabled",
    config: { interaction_mode: "对话", companion_mode: "陪伴模式" },
    capability_manifest: {
      capabilities: ["text_chat", "image_generation", "document_search"],
    },
    capability_hash: "cap-oyiioyii-v4",
    last_ack_version_id: CURRENT_VERSION_ID,
    last_seen_at: "2026-07-17T14:21:00+08:00",
    created_at: "2026-07-01T09:00:00+08:00",
    updated_at: "2026-07-17T14:21:00+08:00",
  },
  {
    id: 202,
    uuid: "demo-client-web",
    agent_id: AGENT_ID,
    client_key: "web-chat",
    client_type: "web_chat",
    name: "Web Chat",
    status: "enabled",
    config: { interaction_mode: "网页聊天", companion_mode: "标准" },
    capability_manifest: {
      capabilities: ["text_chat", "image_generation", "document_search"],
    },
    capability_hash: "cap-web-chat-v4",
    last_ack_version_id: CURRENT_VERSION_ID,
    last_seen_at: "2026-07-17T14:22:00+08:00",
    created_at: "2026-07-02T09:00:00+08:00",
    updated_at: "2026-07-17T14:22:00+08:00",
  },
  {
    id: 203,
    uuid: "demo-client-h5",
    agent_id: AGENT_ID,
    client_key: "h5-campaign",
    client_type: "h5_remote",
    name: "H5 活动页",
    status: "enabled",
    config: { interaction_mode: "活动页", companion_mode: "轻量" },
    capability_manifest: { capabilities: ["text_chat"] },
    capability_hash: "cap-h5-v3",
    last_ack_version_id: 103,
    last_seen_at: "2026-07-17T12:18:00+08:00",
    created_at: "2026-07-03T09:00:00+08:00",
    updated_at: "2026-07-17T12:18:00+08:00",
  },
  {
    id: 204,
    uuid: "demo-client-local",
    agent_id: AGENT_ID,
    client_key: "local-experience",
    client_type: "local_desktop",
    name: "本地体验端",
    status: "disabled",
    config: { interaction_mode: "离线体验", companion_mode: "本地" },
    capability_manifest: { capabilities: ["text_chat", "image_generation"] },
    capability_hash: "cap-local-v3",
    last_ack_version_id: 103,
    last_seen_at: "2026-07-16T17:30:00+08:00",
    created_at: "2026-07-04T09:00:00+08:00",
    updated_at: "2026-07-16T17:30:00+08:00",
  },
];

export function demoVersions(agentId: number) {
  return agentId === AGENT_ID ? DEMO_AGENT_VERSIONS : [];
}

export function demoVersion(agentId: number, versionNo: number) {
  return demoVersions(agentId).find(
    (version) => version.version_no === versionNo,
  );
}

export function demoClients(agentId: number) {
  return agentId === AGENT_ID ? DEMO_AGENT_CLIENTS : [];
}

export function demoRuntime(
  clientId: number,
): AgentClientRuntimeVersion | undefined {
  const client = DEMO_AGENT_CLIENTS.find((item) => item.id === clientId);
  if (!client) return undefined;
  return {
    version: DEMO_AGENT_VERSIONS[0],
    client_config: client.config,
    current_version_id: CURRENT_VERSION_ID,
    current_version_no: 4,
    current_version_hash: DEMO_AGENT_VERSIONS[0].version_hash,
  };
}
