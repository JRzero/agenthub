import type { CreatorSkill } from "@/modules/resources/types";
import type { BasicRoleContent, BasicRoleInput, ImageCandidate } from "./types";

export function createDemoBasicContent(input: BasicRoleInput): BasicRoleContent {
  const traits = input.personalityTags.length ? input.personalityTags.join("、") : "自然、清晰";
  const interaction = input.primaryInteraction.trim() || "陪伴用户交流并提供有帮助的回应";
  return {
    description: `${input.name}是一位${input.identity}，${input.relationship}。擅长${interaction}，表达风格${traits}。`,
    systemPrompt: `你是${input.name}，角色身份是${input.identity}。你与用户的关系是：${input.relationship}。主要互动方式：${interaction}。请保持${traits}的表达风格，尊重用户边界，并始终以当前角色身份回应。`,
    opening: `你好，我是${input.name}。很高兴见到你，今天想从哪里开始？`,
    examples: [
      { user: "你能先介绍一下自己吗？", assistant: `当然可以，我是${input.name}，${input.identity}。` },
      { user: "我现在有点不知道该怎么办。", assistant: `我们可以慢慢梳理。我会以${traits}的方式陪你一起想清楚。` },
      { user: "接下来我们做什么？", assistant: `可以从你最想解决的一件事开始，我会陪你一步一步进行。` },
    ],
  };
}

export const DEMO_AVATAR_CANDIDATES: ImageCandidate[] = [
  { id: "avatar-1", url: "/images/lin-yue-avatar.png", alt: "温和自然的角色头像候选一" },
  { id: "avatar-2", url: "/images/login-agent-asset-hero.png", alt: "明亮亲和的角色头像候选二" },
  { id: "avatar-3", url: "/images/lin-yue-avatar.png", alt: "简洁专业的角色头像候选三" },
  { id: "avatar-4", url: "/images/login-agent-asset-hero.png", alt: "活泼清晰的角色头像候选四" },
];

export const DEMO_SHEET_CANDIDATE: ImageCandidate = {
  id: "sheet-1",
  url: "/images/login-agent-asset-hero.png",
  alt: "角色设定稿候选",
};

export const DEMO_CREATOR_SKILLS: CreatorSkill[] = [
  {
    id: 101,
    uuid: "demo-skill-101",
    skill_id: 1001,
    name: "实时天气查询",
    default_tool_description: "按城市查询天气与近期预报",
    status: "active",
    config: {},
  },
  {
    id: 102,
    uuid: "demo-skill-102",
    skill_id: 1002,
    name: "知识检索",
    default_tool_description: "从已授权资料中检索相关内容",
    status: "active",
    config: {},
  },
  {
    id: 103,
    uuid: "demo-skill-103",
    skill_id: 1003,
    name: "图片生成",
    default_tool_description: "根据描述生成可用图片候选",
    status: "active",
    config: {},
  },
];
