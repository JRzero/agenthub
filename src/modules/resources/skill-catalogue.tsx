import type { Icon } from "@phosphor-icons/react";
import { BookOpenText, CalendarDots, Globe, Heart, ImageSquare, Note } from "@phosphor-icons/react";
import type { CreatorSkill, MarketplaceSkill } from "./types";

const icons: Record<string, { icon: Icon; className: string }> = {
  "知识与搜索": { icon: BookOpenText, className: "bg-blue-500 text-white" },
  "内容生成": { icon: ImageSquare, className: "bg-violet-500 text-white" },
  "效率工具": { icon: CalendarDots, className: "bg-teal-500 text-white" },
  "互动能力": { icon: Heart, className: "bg-pink-500 text-white" },
  "数据处理": { icon: Note, className: "bg-orange-500 text-white" },
};

export function SkillCatalogue({ skills, selectedId, creatorSkills, onSelect }: {
  skills: MarketplaceSkill[];
  selectedId?: number;
  creatorSkills: CreatorSkill[];
  onSelect: (id: number) => void;
}) {
  return <section className="divide-y divide-border overflow-hidden border-b border-border min-[1400px]:border-b-0 min-[1400px]:border-r">
    <div className="hidden grid-cols-[minmax(150px,1fr)_minmax(190px,1.4fr)_110px_80px_95px] gap-3 px-4 py-3 text-xs font-medium text-text-muted md:grid"><span>技能名称</span><span>描述</span><span>提供方</span><span>阶段</span><span>状态</span></div>
    {skills.map((skill) => {
      const meta = icons[skill.category || ""] || { icon: Globe, className: "bg-slate-600 text-white" };
      const SkillIcon = meta.icon;
      const isOwned = creatorSkills.some((item) => item.skill_id === skill.id);
      return <button key={skill.id} type="button" onClick={() => onSelect(skill.id)} className={`grid w-full gap-3 px-4 py-4 text-left md:grid-cols-[minmax(150px,1fr)_minmax(190px,1.4fr)_110px_80px_95px] md:items-center ${skill.id === selectedId ? "bg-primary-soft/55 ring-1 ring-inset ring-primary/70" : "hover:bg-subtle/50"}`}>
        <span className="flex items-center gap-3"><span className={`flex h-10 w-10 items-center justify-center rounded-lg ${meta.className}`}><SkillIcon size={21} /></span><span><strong className="block text-sm">{skill.name}</strong><span className="text-xs text-primary">{skill.implementation_type}</span></span></span>
        <span className="text-sm leading-5 text-text-muted">{skill.description}</span>
        <span className="text-xs text-text-muted">{skill.category === "内容生成" ? "OyiiOyii" : "AgentHub"}</span>
        <span className="text-xs text-text-muted">{skill.stage.replace("_conversation", "")}</span>
        <span className={`status-badge justify-self-start ${isOwned ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{isOwned ? "已添加" : "可添加"}</span>
      </button>;
    })}
    {!skills.length && <p className="px-6 py-20 text-center text-sm text-text-muted">没有匹配的技能</p>}
  </section>;
}
