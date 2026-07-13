import type { Agent } from "@/modules/agents/types";
import type { ActivityItem, ClientAdapter } from "@/modules/agent-assets/model";
import type { Workspace } from "@/modules/workspace/types";

export const DEMO_WORKSPACES: Workspace[] = [
  {
    id: 1,
    uuid: "demo-workspace",
    name: "星海内容工作室",
    code: "xinghai-studio",
    role: "owner",
    status: "active",
  },
  {
    id: 2,
    uuid: "demo-brand-workspace",
    name: "品牌共创空间",
    code: "brand-lab",
    role: "editor",
    status: "active",
  },
];

export const DEMO_AGENTS: Agent[] = [
  {
    id: 32,
    uuid: "demo-lin-yue",
    code: "lin-yue",
    name: "林月",
    description: "星海内容工作室的陪伴型 Agent",
    model: "qwen-max",
    status: "active",
    agent_type: "cloud",
    edge_status: "online",
    memory_enabled: true,
    knowledge_base_id: 8,
    version: 3,
    system_prompt: "温柔、敏锐，善于接住用户的情绪，但不会替用户做决定。",
    llm_provider: "qwen",
    llm_provider_type: "openai-compatible",
    llm_model_name: "qwen-max",
    updated_at: "2026-07-10T10:24:00+08:00",
    config: {
      examples: [
        { role: "user", content: "今天有点累。" },
        { role: "assistant", content: "先在这里缓一缓，我陪你把今天放下来。" },
      ],
      skills: ["realtime_weather", "image_generation"],
      metadata: {
        avatar: "/images/lin-yue-avatar.png",
        character_design_spec: "月色系陪伴角色，沉静但不疏离。",
        character_design_sheet: "lin-yue-sheet.png",
      },
    },
  },
  {
    id: 19,
    uuid: "demo-knowledge-guide",
    code: "knowledge-guide",
    name: "知识向导",
    description: "帮助用户检索知识库并给出引用。",
    model: "gpt-4.1-mini",
    status: "draft",
    agent_type: "cloud",
    edge_status: "online",
    memory_enabled: false,
    knowledge_base_id: 3,
    version: 1,
    system_prompt: "根据知识库回答并提供引用。",
    config: { skills: ["document_search"] },
  },
];

export const DEMO_ADAPTERS: ClientAdapter[] = [
  {
    id: "core",
    name: "Core Asset",
    version: "v3.2",
    status: "running",
    publishedAt: "2026-07-10 10:24",
  },
  {
    id: "oyiioyii",
    name: "OyiiOyii Adapter",
    version: "v3.2",
    status: "running",
    publishedAt: "2026-07-10 10:24",
  },
  {
    id: "web-chat",
    name: "Web Chat Adapter",
    version: "v2.4",
    status: "outdated",
    publishedAt: "2026-07-08 09:58",
  },
  {
    id: "api-runtime",
    name: "API Runtime Adapter",
    version: "v1.2",
    status: "draft",
    publishedAt: "2026-07-05 18:11",
  },
];

export const DEMO_ACTIVITIES: ActivityItem[] = [
  {
    id: "activity-1",
    actor: "林月",
    action: "更新",
    detail: "更新角色设定：补充了行为准则与价值观描述",
    time: "今天 10:24",
    tone: "update",
  },
  {
    id: "activity-2",
    actor: "OyiiOyii Adapter",
    action: "发布",
    detail: "发布到 OyiiOyii",
    time: "昨天 16:42",
    tone: "publish",
  },
  {
    id: "activity-3",
    actor: "李然",
    action: "更新",
    detail: "优化技能「实时天气查询」的错误处理逻辑",
    time: "昨天 11:37",
    tone: "update",
  },
  {
    id: "activity-4",
    actor: "Web Chat Adapter",
    action: "更新",
    detail: "适配到 Web Chat v2.4",
    time: "07-08 09:58",
    tone: "warning",
  },
];
