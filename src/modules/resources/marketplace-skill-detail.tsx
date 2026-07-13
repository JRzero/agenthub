import { GearSix } from "@phosphor-icons/react";
import { SourceBadge } from "@/shared/ui/source-badge";
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
  if (!skill) return <aside className="p-5 text-sm text-text-muted">选择一个技能查看详情</aside>;
  return <aside className="p-5">
    <div className="flex items-center gap-3"><strong className="text-lg">{skill.name}</strong><SourceBadge source={demo ? "demo" : "live"} /></div>
    <p className="mt-2 text-sm leading-6 text-text-muted">{skill.description}</p>
    <dl className="mt-5 grid grid-cols-2 gap-4 border-y border-border py-4 text-sm"><div><dt className="text-xs text-text-muted">阶段</dt><dd className="mt-1 font-medium">{skill.stage}</dd></div><div><dt className="text-xs text-text-muted">实现</dt><dd className="mt-1 font-medium">{skill.implementation_type}</dd></div></dl>
    {skill.config_doc && <div className="mt-5 rounded-md bg-subtle p-3 text-xs leading-5 text-text-muted whitespace-pre-wrap"><strong className="mb-1 block text-text">参数说明</strong>{skill.config_doc}</div>}
    <h3 className="mt-5 font-semibold">输入参数</h3>
    <div className="mt-3 space-y-2">{Object.entries(skill.config_schema?.properties || {}).map(([key, schema]) => <div key={key} className="rounded-md bg-subtle px-3 py-2 text-xs"><strong>{key}</strong><span className="ml-2 text-text-muted">{schema.type} · {schema.description}</span>{schema.default !== undefined && <span className="mt-1 block text-text-muted">默认：{String(schema.default)}</span>}</div>)}{!skill.config_schema?.properties && <p className="text-sm text-text-muted">该技能没有公开配置参数。</p>}</div>
    <button type="button" onClick={onAdd} disabled={!!ownedSkill || busy} className="button-primary mt-5 w-full">{ownedSkill ? "已添加到工作空间" : "添加到工作空间"}</button>
    {ownedSkill && <button type="button" onClick={() => onManage(ownedSkill)} className="button-secondary mt-3 w-full"><GearSix size={17} />管理工作空间技能</button>}
    <button type="button" onClick={onAttach} className="button-secondary mt-3 w-full">添加到 Agent</button>
  </aside>;
}
