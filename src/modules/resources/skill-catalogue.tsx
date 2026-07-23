import { getSkillStagePresentation, getSkillVisual } from "./skill-presentation";
import type { CreatorSkill, MarketplaceSkill } from "./types";

export function SkillCatalogue({ skills, selectedId, creatorSkills, onSelect }: {
  skills: MarketplaceSkill[];
  selectedId?: number;
  creatorSkills: CreatorSkill[];
  onSelect: (id: number) => void;
}) {
  return <section className="divide-y divide-border overflow-hidden border-b border-border min-[1400px]:border-b-0 min-[1400px]:border-r">
    <div className="hidden grid-cols-[minmax(150px,1fr)_minmax(190px,1.4fr)_110px_80px_95px] gap-3 px-4 py-3 text-xs font-medium text-text-muted md:grid"><span>技能名称</span><span>描述</span><span>提供方</span><span>阶段</span><span>状态</span></div>
    {skills.map((skill) => {
      const meta = getSkillVisual(skill);
      const stage = getSkillStagePresentation(skill.stage);
      const SkillIcon = meta.icon;
      const isOwned = creatorSkills.some((item) => item.skill_id === skill.id);
      return <button key={skill.id} type="button" onClick={() => onSelect(skill.id)} className={`grid w-full gap-3 px-4 py-4 text-left md:grid-cols-[minmax(150px,1fr)_minmax(190px,1.4fr)_110px_80px_95px] md:items-center ${skill.id === selectedId ? "bg-primary-soft/55 ring-1 ring-inset ring-primary/70" : "hover:bg-subtle/50"}`}>
        <span className="flex min-w-0 items-center gap-3"><span className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${meta.className}`}><SkillIcon className="size-5 shrink-0" /></span><span className="min-w-0"><strong className="block break-words text-sm">{skill.name}</strong><span className="text-xs text-primary">{skill.implementation_type}</span></span></span>
        <span className="text-sm leading-5 text-text-muted">{skill.description}</span>
        <span className="text-xs text-text-muted">{skill.category === "内容生成" ? "OyiiOyii" : "AgentHub"}</span>
        <span className={`inline-flex items-center gap-2 justify-self-start text-xs font-medium before:size-1.5 before:shrink-0 before:rounded-full ${stage.className}`}>{stage.label}</span>
        <span className={`inline-flex items-center gap-2 justify-self-start text-xs font-medium before:size-1.5 before:shrink-0 before:rounded-full ${isOwned ? "text-emerald-700 before:bg-emerald-500 dark:text-emerald-300" : "text-slate-600 before:bg-slate-400 dark:text-slate-300 dark:before:bg-slate-500"}`}>{isOwned ? "已添加" : "可添加"}</span>
      </button>;
    })}
    {!skills.length && <p className="px-6 py-20 text-center text-sm text-text-muted">没有匹配的技能</p>}
  </section>;
}
