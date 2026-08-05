"use client";

import { MagnifyingGlass, Plus } from "@phosphor-icons/react";
import { MarketplaceSkillDetail } from "./marketplace-skill-detail";
import { SkillCatalogue } from "./skill-catalogue";
import { AttachSkillDialog, CreatorSkillDialog } from "./skill-dialogs";
import { getSkillCategoryLabel } from "./skill-presentation";
import { useSkillsLibrary } from "./use-skills-library";
import { Select } from "@/shared/ui/select";
import { ResourceErrorFeedback } from "./resource-error-feedback";

export function SkillsLibraryNext() {
  const library = useSkillsLibrary();
  if (library.loading) return <SkillsLoading />;
  return <div>
    <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3 sm:px-6">
      <label className="relative w-full sm:max-w-[344px]">
        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
        <span className="sr-only">搜索技能</span>
        <input type="search" value={library.search} onChange={(event) => library.setSearch(event.target.value)} placeholder="搜索技能名称或能力" className="control-field w-full pl-10" />
      </label>
      <Select
        ariaLabel="技能分类"
        value={library.category}
        onValueChange={library.setCategory}
        options={library.categories.map((item) => ({
          value: item,
          label: getSkillCategoryLabel(item),
        }))}
        className="min-w-[180px]"
      />
      <button type="button" onClick={() => library.selected && library.setAttachOpen(true)} disabled={!library.selected} className="button-primary ml-auto"><Plus size={17} />添加到 Agent</button>
    </div>
    <ResourceErrorFeedback message={library.error} onRetry={library.retry} className="mx-4 mt-4 sm:mx-6" />
    <div className="grid min-h-[600px] lg:grid-cols-[150px_minmax(330px,1fr)_310px]">
      <aside className="hidden border-r border-border p-4 lg:block" aria-label="技能分类"><div className="flex flex-col gap-1">{library.categories.map((item) => <button key={item} type="button" onClick={() => library.setCategory(item)} className={`relative block w-full whitespace-nowrap rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${library.category === item ? "bg-surface-elevated font-medium text-text-strong before:absolute before:inset-y-1 before:left-0 before:w-1 before:rounded-full before:bg-primary" : "text-text-secondary hover:bg-surface-elevated hover:text-text-strong"}`}>{getSkillCategoryLabel(item)}</button>)}</div></aside>
      <SkillCatalogue skills={library.filtered} selectedId={library.selected?.id} creatorSkills={library.creatorSkills} onSelect={library.setSelectedId} />
      <MarketplaceSkillDetail skill={library.selected} ownedSkill={library.ownedSkill} demo={library.demo} busy={library.busy} onAdd={() => void library.addToWorkspace()} onAttach={() => library.setAttachOpen(true)} onManage={library.setManageSkill} />
    </div>
    {library.notice && <div role="status" className="fixed bottom-6 right-6 z-50 rounded-lg bg-slate-950 px-4 py-3 text-sm text-white">{library.notice}</div>}
    {library.attachOpen && library.selected && <AttachSkillDialog skill={library.selected} agents={library.agents} agentId={library.agentId} busy={library.busy} onAgentId={library.setAgentId} onClose={() => library.setAttachOpen(false)} onSubmit={() => void library.addToAgent()} />}
    {library.manageSkill && <CreatorSkillDialog key={library.manageSkill.id} skill={library.manageSkill} busy={library.busy} error={library.error} onClose={() => library.setManageSkill(null)} onSave={(input) => void library.saveOwnedSkill(input)} onDelete={() => void library.removeOwnedSkill()} />}
  </div>;
}

function SkillsLoading() {
  return <div className="grid min-h-[600px] animate-pulse lg:grid-cols-[150px_minmax(330px,1fr)_310px]" aria-label="正在加载技能库"><div className="hidden border-r border-border p-4 lg:block"><div className="h-10 rounded-lg bg-surface-elevated" /></div><div className="space-y-3 border-r border-border p-4">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-16 rounded-xl bg-surface-elevated" />)}</div><div className="hidden p-5 lg:block"><div className="h-52 rounded-xl bg-surface-elevated" /></div></div>;
}
