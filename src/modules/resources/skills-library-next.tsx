"use client";

import { MagnifyingGlass, Plus } from "@phosphor-icons/react";
import { MarketplaceSkillDetail } from "./marketplace-skill-detail";
import { SkillCatalogue } from "./skill-catalogue";
import { AttachSkillDialog, CreatorSkillDialog } from "./skill-dialogs";
import { getSkillCategoryLabel } from "./skill-presentation";
import { useSkillsLibrary } from "./use-skills-library";

export function SkillsLibraryNext() {
  const library = useSkillsLibrary();
  if (library.loading) return <div className="py-24 text-center text-text-muted">正在加载技能库…</div>;
  return <div>
    <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-4 sm:px-6"><label className="relative w-full max-w-sm"><MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} /><input value={library.search} onChange={(event) => library.setSearch(event.target.value)} placeholder="搜索技能名称或能力" className="h-10 w-full rounded-md border border-border bg-surface pl-10 pr-3 outline-none focus:border-primary" /></label><label><span className="sr-only">技能分类</span><select aria-label="技能分类" value={library.category} onChange={(event) => library.setCategory(event.target.value)} className="h-10 min-w-[148px] rounded-md border border-border bg-surface pl-3 text-sm outline-none transition hover:border-primary/40 focus:border-primary">{library.categories.map((item) => <option key={item} value={item}>{getSkillCategoryLabel(item)}</option>)}</select></label><button type="button" onClick={() => library.selected && library.setAttachOpen(true)} disabled={!library.selected} className="button-primary ml-auto"><Plus size={17} />添加到 Agent</button></div>
    {library.error && <div className="mx-4 mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-danger sm:mx-6">{library.error}</div>}
    <div className="grid min-h-[600px] min-[1400px]:grid-cols-[150px_minmax(0,1fr)_310px]"><aside className="hidden border-r border-border p-4 min-[1400px]:block"><div className="flex flex-col gap-1">{library.categories.map((item) => <button key={item} type="button" onClick={() => library.setCategory(item)} className={`block w-full whitespace-nowrap rounded-md px-3 py-2 text-left text-sm ${library.category === item ? "bg-primary-soft font-medium text-primary" : "text-text-muted hover:bg-subtle"}`}>{getSkillCategoryLabel(item)}</button>)}</div></aside><SkillCatalogue skills={library.filtered} selectedId={library.selected?.id} creatorSkills={library.creatorSkills} onSelect={library.setSelectedId} /><MarketplaceSkillDetail skill={library.selected} ownedSkill={library.ownedSkill} demo={library.demo} busy={library.busy} onAdd={() => void library.addToWorkspace()} onAttach={() => library.setAttachOpen(true)} onManage={library.setManageSkill} /></div>
    {library.notice && <div role="status" className="fixed bottom-6 right-6 z-50 rounded-lg bg-slate-950 px-4 py-3 text-sm text-white">{library.notice}</div>}
    {library.attachOpen && library.selected && <AttachSkillDialog skill={library.selected} agents={library.agents} agentId={library.agentId} busy={library.busy} onAgentId={library.setAgentId} onClose={() => library.setAttachOpen(false)} onSubmit={() => void library.addToAgent()} />}
    {library.manageSkill && <CreatorSkillDialog key={library.manageSkill.id} skill={library.manageSkill} busy={library.busy} error={library.error} onClose={() => library.setManageSkill(null)} onSave={(input) => void library.saveOwnedSkill(input)} onDelete={() => void library.removeOwnedSkill()} />}
  </div>;
}
