"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CaretDown,
  CaretUp,
  Funnel,
  MagnifyingGlass,
  Plus,
} from "@phosphor-icons/react";
import { AssetActions } from "@/modules/agent-assets/asset-actions";
import { AgentAvatar } from "@/modules/agents/agent-avatar";
import { useAgents } from "@/modules/agents/queries";
import type { Agent } from "@/modules/agents/types";
import { ErrorState, LoadingState } from "@/shared/ui/request-state";

type StatusFilter = "all" | "active" | "draft" | "archived";

function versionLabel(version: number | undefined, currentVersionId: number | null | undefined): string {
  if (typeof version !== "number" || (!currentVersionId && version <= 0)) return "-";
  return `v${version}`;
}

function assetHref(agent: Agent): string {
  return agent.creation_completed === false ? `/assets/create?agentId=${agent.id}` : `/assets/${agent.id}/overview`;
}

function statusPresentation(agent: Agent): { label: string; className: string } {
  if (agent.creation_completed === false) return { label: "创建中", className: "status-info" };
  if (agent.status === "active") return { label: "已发布", className: "status-success" };
  if (agent.status === "archived") return { label: "已归档", className: "status-neutral" };
  return { label: "草稿", className: "status-warning" };
}

export default function AssetLibraryPage() {
  const query = useAgents();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const agents = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return (query.data || []).filter((agent) => {
      const matchesSearch = !keyword || `${agent.name} ${agent.code} ${agent.description}`.toLowerCase().includes(keyword);
      const matchesStatus = status === "all" || agent.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [query.data, search, status]);
  const hasActiveFilters = search.trim().length > 0 || status !== "all";

  if (query.isLoading) return <LoadingState label="正在加载 Agent 资产…" />;
  if (query.isError) return <ErrorState message={query.error.message} onRetry={() => void query.refetch()} />;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-text-muted">工作空间 / Agent 资产库</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Agent 资产库</h1>
          <p className="mt-2 text-sm text-text-muted">管理可构建、测试和发行的 Agent 源资产。</p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <span className="text-sm text-text-muted">共 {agents.length} 项</span>
          <button
            type="button"
            className="button-secondary"
            aria-expanded={filtersOpen}
            aria-controls="agent-asset-filters"
            onClick={() => setFiltersOpen((open) => !open)}
          >
            <Funnel size={17} />
            {filtersOpen ? "收起筛选" : hasActiveFilters ? "筛选已启用" : "筛选"}
            {filtersOpen ? <CaretUp size={15} /> : <CaretDown size={15} />}
          </button>
          <button type="button" className="button-primary" onClick={() => router.push("/assets/create")}>
            <Plus size={17} />新建 Agent
          </button>
        </div>
      </div>

      {filtersOpen ? (
        <section id="agent-asset-filters" className="panel px-5 py-4">
          <div className="flex w-full flex-wrap gap-3 sm:w-auto">
            <label className="relative w-full sm:w-80">
              <span className="sr-only">搜索 Agent</span>
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索 Agent 名称或编码" className="h-10 w-full rounded-md border border-border bg-surface pl-10 pr-3 outline-none transition focus:border-primary" />
            </label>
            <select value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)} aria-label="Agent 状态" className="h-10 rounded-md border border-border bg-surface px-3">
              <option value="all">全部状态</option><option value="active">已发布</option><option value="draft">草稿</option><option value="archived">已归档</option>
            </select>
          </div>
        </section>
      ) : null}

      {agents.length === 0 ? (
        <section className="panel mt-5">
          <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
            <h2 className="font-semibold">没有匹配的 Agent 资产</h2>
            <p className="mt-2 text-sm text-text-muted">清除搜索条件或切换工作空间后重试。</p>
          </div>
        </section>
      ) : (
        <section className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {agents.map((agent) => {
            const presentation = statusPresentation(agent);
            return (
              <article
                key={agent.id}
                className="group relative flex min-h-[244px] flex-col rounded-xl border border-border bg-surface shadow-panel transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
              >
                <Link
                  href={assetHref(agent)}
                  aria-label={`查看 ${agent.name}`}
                  className="absolute inset-0 z-0 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                />
                <div className="pointer-events-none relative z-[1] flex flex-1 gap-4 p-5 pr-12">
                  <AgentAvatar agent={agent} size={96} className="shrink-0 rounded-lg" />
                  <div className="min-w-0 pt-1">
                    <h2 className="truncate text-base font-semibold text-text">{agent.name}</h2>
                    <p className="mt-2 line-clamp-4 text-sm leading-6 text-text-muted">
                      {agent.description || agent.code}
                    </p>
                  </div>
                </div>
                <div className="pointer-events-auto absolute right-2 top-2 z-10">
                  <AssetActions agent={agent} />
                </div>
                <footer className="pointer-events-none relative z-[1] grid grid-cols-[auto_auto_minmax(0,1fr)] items-center gap-4 border-t border-border px-5 py-4">
                  <span className={`status-badge ${presentation.className}`}>{presentation.label}</span>
                  <span className="text-sm text-text-muted">{versionLabel(agent.version, agent.current_version_id)}</span>
                  <span className="truncate text-right text-sm text-text-muted">
                    {agent.llm_model_name || agent.model || "-"}
                  </span>
                </footer>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
