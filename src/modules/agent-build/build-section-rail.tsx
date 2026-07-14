import type { Icon } from "@phosphor-icons/react";
import { Brain, ChatCircleDots, Database, IdentificationCard, ImageSquare, MagicWand, Planet, Robot, ShieldCheck, SlidersHorizontal } from "@phosphor-icons/react";
import type { BuildSectionId } from "./types";

interface BuildSection { id: BuildSectionId; label: string; icon: Icon }

export const BUILD_SECTIONS: BuildSection[] = [
  { id: "identity", label: "身份设定", icon: IdentificationCard },
  { id: "persona", label: "角色人格", icon: Robot },
  { id: "runtime", label: "运行配置", icon: SlidersHorizontal },
  { id: "skills", label: "技能", icon: MagicWand },
  { id: "knowledge", label: "知识", icon: Database },
  { id: "memory", label: "记忆策略", icon: Brain },
  { id: "safety", label: "安全边界", icon: ShieldCheck },
  { id: "media", label: "媒体素材", icon: ImageSquare },
  { id: "moments", label: "朋友圈", icon: ChatCircleDots },
  { id: "motherland", label: "Motherland", icon: Planet },
];

export function BuildSectionRail({ active, onChange }: { active: BuildSectionId; onChange: (section: BuildSectionId) => void }) {
  return <aside className="border-b border-border bg-surface lg:border-b-0 lg:border-r"><div className="flex gap-2 overflow-x-auto p-3 lg:flex-col lg:gap-1 lg:p-4">{BUILD_SECTIONS.map((section, index) => { const Icon = section.icon; const selected = section.id === active; return <button key={section.id} type="button" aria-pressed={selected} onClick={() => onChange(section.id)} className={`group flex min-w-max items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition lg:w-full ${selected ? "bg-primary-soft font-semibold text-primary" : "text-text-muted hover:bg-subtle hover:text-text-strong"}`}><span className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs ${selected ? "border-primary bg-primary text-white" : "border-border bg-surface"}`}><span className="lg:hidden">{index + 1}</span><Icon className="hidden lg:block" size={16} /></span><span>{section.label}</span></button>; })}</div></aside>;
}
