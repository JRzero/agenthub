"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Cards, Clock, Cpu, List, MagnifyingGlass, Plus, Stack, X } from "@phosphor-icons/react";
import { AssetActions } from "@/modules/agent-assets/asset-actions";
import { AgentArtwork, AgentAvatar } from "@/modules/agents/agent-avatar";
import { useAgents } from "@/modules/agents/queries";
import type { Agent } from "@/modules/agents/types";
import { resolveAgentLifecycle } from "@/modules/agents/lifecycle";
import { ErrorState, LoadingState } from "@/shared/ui/request-state";
import { Select } from "@/shared/ui/select";
import { assetHref, filterAndSortAgents, readAssetView, writeAssetView, type AssetSort, type AssetStatus, type AssetView } from "@/modules/agent-assets/library-model";

function versionLabel(agent: Agent): string {
  if (agent.creation_completed === false || !agent.current_version_id) return "尚未发布版本";
  return `v${agent.version}`;
}

function creationProgressLabel(agent: Agent): string {
  const step = agent.creation_step;
  const index = step === "avatar" ? 2 : step === "character_sheet" ? 3 : step === "skills" || step === "complete" ? 4 : 1;
  return `创建中 · 第 ${index}/4 步`;
}

function statusPresentation(agent: Agent) {
  const lifecycle = resolveAgentLifecycle(agent);
  return { label: lifecycle.state === "creating" ? creationProgressLabel(agent) : lifecycle.label, className: lifecycle.badgeClassName };
}

function updatedLabel(value?: string): string {
  if (!value || Number.isNaN(new Date(value).getTime())) return "暂无更新";
  return new Intl.DateTimeFormat("zh-CN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

export default function AssetLibraryPage() {
  const query = useAgents();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<AssetStatus>("all");
  const [sort, setSort] = useState<AssetSort>("updated-desc");
  const [view, setView] = useState<AssetView>("card");
  const allAgents = useMemo(() => query.data || [], [query.data]);

  useEffect(() => setView(readAssetView(window.localStorage)), []);
  const selectView = (next: AssetView) => {
    setView(next);
    writeAssetView(window.localStorage, next);
  };
  const agents = useMemo(() => filterAndSortAgents(allAgents, { search, status, sort }), [allAgents, search, sort, status]);
  const hasActiveFilters = Boolean(search.trim()) || status !== "all";
  const clearFilters = () => { setSearch(""); setStatus("all"); };

  if (query.isLoading) return <LoadingState label="正在加载 Agent 资产…" />;
  if (query.isError) return <ErrorState message={query.error.message} onRetry={() => void query.refetch()} />;

  return (
    <div className="mx-auto w-full max-w-[1760px] pb-8" data-testid="asset-library">
      <header className="flex flex-wrap items-end justify-between gap-4 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agent</h1>
          <p className="mt-1.5 text-sm text-text-secondary">管理你的角色、能力与发布状态</p>
        </div>
        <button type="button" className="button-primary" onClick={() => router.push("/assets/create")}><Plus size={17} />创建 Agent</button>
      </header>

      <section aria-label="Agent 资产筛选" className="flex flex-col gap-3 border-b border-border pb-2 xl:flex-row xl:items-end xl:justify-between">
        <div className="flex flex-wrap gap-1 border-b border-border" role="group" aria-label="按状态筛选">
          {(["all", "active", "draft", "creating", "private", "archived"] as AssetStatus[]).map((value) => {
            const labels: Record<AssetStatus, string> = { all: "全部", active: "已发布", draft: "草稿", creating: "创建中", private: "已下架", archived: "已归档" };
            const count = value === "all" ? allAgents.length : filterAndSortAgents(allAgents, { search: "", status: value, sort: "updated-desc" }).length;
            return <button key={value} type="button" aria-pressed={status === value} onClick={() => setStatus(value)} className={`relative min-h-10 px-3 text-sm transition ${status === value ? "text-primary" : "text-text-muted hover:text-text-strong"}`}>{labels[value]} <span className="ml-1 text-xs">{count}</span>{status === value && <span className="absolute inset-x-2 bottom-0 h-0.5 bg-primary" />}</button>;
          })}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative min-w-[220px] flex-1 sm:flex-none">
            <span className="sr-only">搜索 Agent</span>
            <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={17} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索 Agent 名称、编码或描述" className="control-field w-full pl-9 sm:w-[280px]" />
          </label>
          <Select ariaLabel="Agent 排序" value={sort} onValueChange={(value) => setSort(value as AssetSort)} className="min-w-[148px]" options={[{ value: "updated-desc", label: "最近更新" }, { value: "updated-asc", label: "最早更新" }, { value: "name-asc", label: "名称 A–Z" }]} />
          {hasActiveFilters && <button type="button" className="button-secondary px-3" onClick={clearFilters}><X size={15} />清除</button>}
          <div className="flex rounded-lg border border-border bg-surface p-1" role="group" aria-label="视图切换">
            <button type="button" aria-label="卡片视图" aria-pressed={view === "card"} onClick={() => selectView("card")} className={`grid size-8 place-items-center rounded-md ${view === "card" ? "bg-primary text-canvas" : "text-text-muted hover:bg-subtle"}`}><Cards size={17} /></button>
            <button type="button" aria-label="列表视图" aria-pressed={view === "list"} onClick={() => selectView("list")} className={`grid size-8 place-items-center rounded-md ${view === "list" ? "bg-primary text-canvas" : "text-text-muted hover:bg-subtle"}`}><List size={17} /></button>
          </div>
        </div>
      </section>

      {agents.length === 0 ? <EmptyState hasAgents={allAgents.length > 0} onClear={clearFilters} onCreate={() => router.push("/assets/create")} /> : view === "card" ? <CardView agents={agents} /> : <ListView agents={agents} />}
    </div>
  );
}

function EmptyState({ hasAgents, onClear, onCreate }: { hasAgents: boolean; onClear: () => void; onCreate: () => void }) {
  return <section className="panel mt-5 grid min-h-72 place-items-center px-6 text-center"><div><span className="mx-auto grid size-12 place-items-center rounded-xl bg-primary-soft text-primary"><Stack size={24} /></span><h2 className="mt-4 font-semibold">{hasAgents ? "没有匹配的 Agent 资产" : "还没有 Agent 资产"}</h2><p className="mt-2 text-sm text-text-muted">{hasAgents ? "调整关键词或状态筛选。" : "创建第一个 Agent，开始构建、测试与发行。"}</p><button type="button" className={hasAgents ? "button-secondary mt-5" : "button-primary mt-5"} onClick={hasAgents ? onClear : onCreate}>{hasAgents ? <X size={16} /> : <Plus size={17} />}{hasAgents ? "清除筛选" : "创建 Agent"}</button></div></section>;
}

function CardView({ agents }: { agents: Agent[] }) {
  return <section aria-label="Agent 资产卡片" className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 min-[1180px]:grid-cols-3 min-[1536px]:grid-cols-4">{agents.map((agent) => {
    const presentation = statusPresentation(agent);
    return <article key={agent.id} data-testid="agent-image-card" className="group relative flex h-[420px] flex-col overflow-hidden rounded-xl border border-border bg-surface transition hover:-translate-y-0.5 hover:border-primary/55 hover:shadow-xl focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/35">
      <Link href={assetHref(agent)} aria-label={`查看 ${agent.name}`} className="absolute inset-0 z-10 rounded-xl focus-visible:outline-none" />
      <div className="pointer-events-none relative min-h-0 flex-1 overflow-hidden border-b border-border bg-surface-elevated">
        <AgentArtwork agent={agent} className="transition duration-300 group-hover:scale-[1.02]" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-canvas via-canvas/90 to-transparent px-4 pb-4 pt-20">
          <h2 className="truncate text-xl font-semibold" title={agent.name}>{agent.name}</h2>
          <p className="mt-1 line-clamp-2 min-h-10 text-sm leading-5 text-text-secondary" title={agent.description}>{agent.description || agent.tagline || "暂无描述，进入工作区完善 Agent。"}</p>
        </div>
      </div>
      <span className={`pointer-events-none absolute left-3 top-3 z-20 status-badge ${presentation.className}`}>{presentation.label}</span>
      <div className="pointer-events-auto absolute right-2 top-2 z-30 rounded-md bg-canvas/65 backdrop-blur-sm"><AssetActions agent={agent} /></div>
      <footer className="pointer-events-none grid h-[92px] shrink-0 grid-cols-2 content-center gap-x-4 gap-y-2 px-4 py-3">
        <AssetMeta icon={<Cpu size={15} />} label="运行模型" value={agent.llm_model_name || agent.model || "尚未配置"} />
        <AssetMeta icon={<Clock size={15} />} label="最近更新" value={updatedLabel(agent.updated_at)} />
        <span className="col-span-2 flex min-w-0 items-center justify-between border-t border-border pt-2 text-xs text-text-muted"><span className="truncate">{versionLabel(agent)}</span><span className="font-medium text-primary">{agent.creation_completed === false ? "继续创建" : "打开工作区"}</span></span>
      </footer>
    </article>;
  })}</section>;
}

function ListView({ agents }: { agents: Agent[] }) {
  return <section aria-label="Agent 资产列表" className="panel mt-5 overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead><tr className="border-b border-border text-xs text-text-muted"><th className="px-4 py-3 font-medium">Agent</th><th className="px-4 py-3 font-medium">状态</th><th className="px-4 py-3 font-medium">当前版本</th><th className="px-4 py-3 font-medium">运行模型</th><th className="px-4 py-3 font-medium">最近更新</th><th className="px-4 py-3 text-right font-medium">操作</th></tr></thead><tbody>{agents.map((agent) => { const presentation = statusPresentation(agent); return <tr key={agent.id} className="group relative border-b border-border last:border-0 hover:bg-subtle"><td className="p-0"><Link href={assetHref(agent)} aria-label={`查看 ${agent.name}`} className="flex min-w-0 items-center gap-3 px-4 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"><AgentAvatar agent={agent} size={48} className="shrink-0 rounded-lg" /><span className="min-w-0"><strong className="block max-w-[280px] truncate" title={agent.name}>{agent.name}</strong><span className="mt-1 block max-w-[280px] truncate text-xs text-text-muted" title={agent.description}>{agent.description || agent.code}</span></span></Link></td><td className="px-4 py-3"><span className={`status-badge ${presentation.className}`}>{presentation.label}</span></td><td className="px-4 py-3 text-text-secondary">{versionLabel(agent)}</td><td className="max-w-[180px] truncate px-4 py-3 text-text-secondary">{agent.llm_model_name || agent.model || "尚未配置"}</td><td className="px-4 py-3 text-text-muted">{updatedLabel(agent.updated_at)}</td><td className="px-4 py-3 text-right"><AssetActions agent={agent} /></td></tr>; })}</tbody></table></section>;
}

function AssetMeta({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <span className="flex min-w-0 items-center gap-1.5 text-xs text-text-muted">{icon}<span className="sr-only">{label}</span><span className="truncate" title={value}>{value}</span></span>;
}
