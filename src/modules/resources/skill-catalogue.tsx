import React from "react";
import { getSkillVisual } from "./skill-presentation";
import type { CreatorSkill, MarketplaceSkill } from "./types";

export function SkillCatalogue({ skills, selectedId, creatorSkills, onSelect }: {
  skills: MarketplaceSkill[];
  selectedId?: number;
  creatorSkills: CreatorSkill[];
  onSelect: (id: number) => void;
}) {
  return <section className="divide-y divide-border overflow-hidden border-b border-border lg:border-b-0 lg:border-r" aria-label="技能目录">
    {skills.map((skill) => {
      const meta = getSkillVisual(skill);
      const SkillIcon = meta.icon;
      const isOwned = creatorSkills.some((item) => item.skill_id === skill.id);
      return <button key={skill.id} type="button" onClick={() => onSelect(skill.id)} aria-pressed={skill.id === selectedId} className={`relative flex w-full items-center gap-4 px-5 py-4 text-left transition-colors ${skill.id === selectedId ? "bg-surface-elevated before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-primary" : "hover:bg-surface-elevated/60"}`}>
        <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${meta.className}`}><SkillIcon className="size-6 shrink-0" weight="regular" /></span>
        <span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-3"><strong className="truncate text-[15px] font-semibold">{skill.name}</strong>{isOwned && <span className="shrink-0 text-xs font-medium text-primary">已添加</span>}</span><span className="mt-1 block truncate text-sm text-text-secondary">{skill.description}</span><span className="mt-1 block text-xs text-text-muted">{skill.category || "其他"}</span></span>
      </button>;
    })}
    {!skills.length && <p className="px-6 py-20 text-center text-sm text-text-muted">没有匹配的技能</p>}
  </section>;
}
