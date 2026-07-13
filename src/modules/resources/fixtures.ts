import type { CreatorSkill, KnowledgeBase, KnowledgeDocument, MarketplaceSkill } from "./types";

export const DEMO_MARKETPLACE_SKILLS: MarketplaceSkill[] = [
  { id: 1, uuid: "skill-search", name: "知识检索", description: "基于企业知识库的语义检索与内容召回", stage: "mid_conversation", implementation_type: "function", category: "知识与搜索", config_schema: { properties: { query: { type: "string", description: "检索关键词" }, top_k: { type: "integer", description: "返回结果数量" } } } },
  { id: 2, uuid: "skill-web", name: "联网搜索", description: "实时联网搜索并提取可靠信息", stage: "mid_conversation", implementation_type: "function", category: "知识与搜索" },
  { id: 3, uuid: "skill-image", name: "图片生成", description: "根据文本描述生成高质量图片", stage: "mid_conversation", implementation_type: "prompt-api", category: "内容生成" },
  { id: 4, uuid: "skill-summary", name: "长文总结", description: "对长文本内容进行结构化总结与提炼", stage: "post_conversation", implementation_type: "prompt-based", category: "数据处理" },
  { id: 5, uuid: "skill-calendar", name: "日程助手", description: "创建、查询与管理日程安排", stage: "mid_conversation", implementation_type: "function", category: "效率工具" },
  { id: 6, uuid: "skill-emotion", name: "情绪识别", description: "识别人脸情绪类型与置信度", stage: "pre_conversation", implementation_type: "function", category: "互动能力" },
];

export const DEMO_CREATOR_SKILLS: CreatorSkill[] = [
  { id: 101, uuid: "creator-search", skill_id: 1, skill_name: "知识检索", name: "知识检索", stage: "mid_conversation", status: "active", config: {} },
];

export const DEMO_KNOWLEDGE_BASES: KnowledgeBase[] = [
  { id: 8, uuid: "kb-brand", name: "品牌知识库", description: "品牌介绍、产品资料与常见问答", embedding_model: "text-embedding-v3", chunk_size: 800, chunk_overlap: 100, created_at: "2026-07-06T09:00:00+08:00", updated_at: "2026-07-10T10:12:00+08:00" },
  { id: 3, uuid: "kb-world", name: "林月世界观", description: "角色背景、关系和世界观设定", embedding_model: "text-embedding-v3", chunk_size: 800, chunk_overlap: 100, created_at: "2026-07-02T14:00:00+08:00", updated_at: "2026-07-09T18:20:00+08:00" },
];

export const DEMO_DOCUMENTS: Record<number, KnowledgeDocument[]> = {
  8: [{ id: 81, uuid: "doc-brand", knowledge_base_id: 8, source_type: "text", source: "brand", title: "品牌手册", chunk_count: 24, status: "ready", progress: 100, created_at: "2026-07-06T09:10:00+08:00", updated_at: "2026-07-10T10:12:00+08:00" }],
  3: [{ id: 31, uuid: "doc-world", knowledge_base_id: 3, source_type: "url", source: "https://example.com/world", title: "世界观设定", chunk_count: 16, status: "ready", progress: 100, created_at: "2026-07-02T14:10:00+08:00", updated_at: "2026-07-09T18:20:00+08:00" }],
};
