import { CheckCircle, GearSix, GlobeHemisphereWest } from "@phosphor-icons/react";
import { SourceBadge } from "@/shared/ui/source-badge";
import { getSkillStagePresentation } from "./skill-presentation";
import { getSkillVisual } from "./skill-presentation";
import type { CreatorSkill, MarketplaceSkill } from "./types";

export function MarketplaceSkillDetail({ skill, ownedSkill, demo, busy, onAdd, onAttach, onManage }: {
  skill?: MarketplaceSkill;
  ownedSkill?: CreatorSkill;
  demo: boolean;
  busy: boolean;
  onAdd: () => void;
  onAttach: () => void;
  onManage: (skill: CreatorSkill) => void;
}) {
  if (!skill) return <aside className="hidden border-l border-border p-5 text-sm text-text-muted lg:block">选择一个技能查看详情</aside>;
  const stage = getSkillStagePresentation(skill.stage);
  const visual = getSkillVisual(skill);
  const SkillIcon = visual.icon;
  const properties = Object.entries(skill.config_schema?.properties || {});
  return <aside className="border-t border-border p-5 lg:border-l lg:border-t-0">
    <div className="flex items-start gap-4"><span className={`flex size-14 shrink-0 items-center justify-center rounded-xl ${visual.className}`}><SkillIcon size={30} /></span><div className="min-w-0"><strong className="block text-xl font-semibold">{skill.name}</strong><div className="mt-2 flex flex-wrap items-center gap-2"><span className="status-badge status-neutral">{skill.category || "其他"}</span><SourceBadge source={demo ? "demo" : "live"} /></div></div></div>
    <p className="mt-5 text-sm leading-6 text-text-secondary">{skill.description}</p>
    <section className="mt-5 border-t border-border pt-5"><h3 className="font-semibold">能力说明</h3>{skill.config_doc ? <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-text-secondary">{skill.config_doc}</p> : properties.length ? <ul className="mt-3 space-y-2 text-sm text-text-secondary">{properties.slice(0, 4).map(([key, schema]) => <li key={key} className="flex gap-2"><CheckCircle className="mt-0.5 shrink-0 text-primary" size={17} weight="fill" /><span>{schema.description || key}</span></li>)}</ul> : <p className="mt-3 text-sm leading-6 text-text-secondary">该技能按当前契约提供 {skill.implementation_type} 能力。</p>}</section>
    <dl className="mt-5 grid grid-cols-2 gap-4 border-y border-border py-4 text-sm"><div><dt className="text-xs text-text-muted">运行阶段</dt><dd className={`mt-2 inline-flex items-center gap-2 text-xs font-medium before:size-1.5 before:rounded-full ${stage.className}`}>{stage.label}</dd></div><div><dt className="text-xs text-text-muted">权限范围</dt><dd className="mt-2 flex items-center gap-2 text-xs text-text-secondary"><GlobeHemisphereWest size={16} />按 Agent 配置</dd></div></dl>
    {ownedSkill && <div className="mt-5 flex items-center gap-2 text-sm text-primary"><CheckCircle size={18} weight="fill" />已添加到工作空间</div>}
    {!ownedSkill && <button type="button" onClick={onAdd} disabled={busy} className="button-secondary mt-5 w-full">{busy ? "添加中…" : "添加到工作空间"}</button>}
    <button type="button" onClick={onAttach} disabled={busy} className="button-primary mt-3 w-full">{busy ? "处理中…" : "添加到 Agent"}</button>
    {ownedSkill && <button type="button" onClick={() => onManage(ownedSkill)} className="button-secondary mt-3 w-full"><GearSix size={17} />管理技能</button>}
  </aside>;
}
