import type { Icon } from "@phosphor-icons/react";
import {
  BookOpenText,
  CalendarDots,
  Code,
  FileArrowUp,
  Globe,
  Heart,
  ImageSquare,
  Note,
  ShieldCheck,
  SpeakerHigh,
  UserFocus,
} from "@phosphor-icons/react";
import type { MarketplaceSkill } from "./types";

export interface SkillVisual {
  icon: Icon;
  className: string;
}

export interface SkillStagePresentation {
  label: string;
  className: string;
}

const categoryLabels: Record<string, string> = {
  safety: "安全防护",
  input: "输入处理",
  prompt: "提示词",
  voice: "语音",
  api: "API 接口",
  document: "文档",
  image: "图像",
  search: "搜索",
  knowledge: "知识",
  function: "函数工具",
  other: "其他",
  "全部技能": "全部技能",
};
const categoryVisuals: Record<string, SkillVisual> = {
  "知识与搜索": { icon: BookOpenText, className: "bg-blue-500 text-white" },
  "内容生成": { icon: ImageSquare, className: "bg-violet-500 text-white" },
  "效率工具": { icon: CalendarDots, className: "bg-teal-500 text-white" },
  "互动能力": { icon: Heart, className: "bg-pink-500 text-white" },
  "数据处理": { icon: Note, className: "bg-orange-500 text-white" },
};

const semanticVisuals: Array<{ keywords: string[]; visual: SkillVisual }> = [
  { keywords: ["sensitive", "filter", "safety", "guard", "审核", "敏感", "安全"], visual: { icon: ShieldCheck, className: "bg-rose-500 text-white" } },
  { keywords: ["image", "picture", "photo", "图片", "图像"], visual: { icon: ImageSquare, className: "bg-violet-500 text-white" } },
  { keywords: ["document", "file", "pdf", "word", "文档", "文件"], visual: { icon: FileArrowUp, className: "bg-amber-500 text-white" } },
  { keywords: ["role", "persona", "character", "角色", "人设"], visual: { icon: UserFocus, className: "bg-indigo-500 text-white" } },
  { keywords: ["tts", "speech", "voice", "audio", "语音", "声音"], visual: { icon: SpeakerHigh, className: "bg-cyan-600 text-white" } },
  { keywords: ["search", "knowledge", "retrieval", "搜索", "检索", "知识"], visual: { icon: BookOpenText, className: "bg-blue-500 text-white" } },
  { keywords: ["calendar", "schedule", "日程", "计划"], visual: { icon: CalendarDots, className: "bg-teal-500 text-white" } },
  { keywords: ["emotion", "mood", "情绪", "情感"], visual: { icon: Heart, className: "bg-pink-500 text-white" } },
  { keywords: ["summary", "summarize", "总结", "摘要"], visual: { icon: Note, className: "bg-orange-500 text-white" } },
];

const stagePresentations: Record<string, SkillStagePresentation> = {
  pre: { label: "前置", className: "bg-sky-50 text-sky-700 ring-sky-200" },
  pre_conversation: { label: "前置", className: "bg-sky-50 text-sky-700 ring-sky-200" },
  mid: { label: "对话中", className: "bg-violet-50 text-violet-700 ring-violet-200" },
  mid_conversation: { label: "对话中", className: "bg-violet-50 text-violet-700 ring-violet-200" },
  post: { label: "后置", className: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  post_conversation: { label: "后置", className: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
};

export function getSkillVisual(skill: MarketplaceSkill): SkillVisual {
  const searchable = [skill.name, skill.description, skill.uuid].join(" ").toLowerCase();
  const semanticMatch = semanticVisuals.find(({ keywords }) => keywords.some((keyword) => searchable.includes(keyword)));
  if (semanticMatch) return semanticMatch.visual;
  if (skill.category && categoryVisuals[skill.category]) return categoryVisuals[skill.category];
  if (skill.implementation_type === "function") return { icon: Code, className: "bg-slate-700 text-white" };
  return { icon: Globe, className: "bg-slate-600 text-white" };
}

export function getSkillStagePresentation(stage: string): SkillStagePresentation {
  return stagePresentations[stage.toLowerCase()] || {
    label: stage || "未设置",
    className: "bg-slate-100 text-slate-600 ring-slate-200",
  };
}
export function getSkillCategoryLabel(category: string): string {
  const normalized = category.trim();
  return categoryLabels[normalized.toLowerCase()] || normalized || "其他";
}
