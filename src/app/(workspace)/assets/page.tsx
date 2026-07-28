"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarBlank,
  Cpu,
  MagnifyingGlass,
  Plus,
  Stack,
  X,
} from "@phosphor-icons/react";
import { AssetActions } from "@/modules/agent-assets/asset-actions";
import { AgentAvatar } from "@/modules/agents/agent-avatar";
import { useAgents } from "@/modules/agents/queries";
import type { Agent } from "@/modules/agents/types";
import { ErrorState, LoadingState } from "@/shared/ui/request-state";
import { Select } from "@/shared/ui/select";

type StatusFilter = "all" | "active" | "draft" | "creating" | "archived";

function versionLabel(version: number | undefined, currentVersionId: number | null | undefined): string {
  if (typeof version !== "number" || (!currentVersionId && version <= 0)) return "-";
  return `v${version}`;
}

function assetHref(agent: Agent): string {
  return agent.creation_completed === false ? `/assets/create?agentId=${agent.id}` : `/assets/${agent.id}/overview`;
}

function creationProgressLabel(agent: Agent): string {
  const step = agent.creation_step;
  const index = step === "avatar" ? 2 : step === "character_sheet" ? 3 : step === "skills" || step === "complete" ? 4 : 1;
  return `创建中 · 第 ${index}/4 步`;
}

function statusPresentation(agent: Agent): { label: string; className: string } {
  if (agent.creation_completed === false) return { label: creationProgressLabel(agent), className: "status-info" };
  if (agent.status === "active") return { label: "已发布", className: "status-success" };
  if (agent.status === "archived") return { label: "已归档", className: "status-neutral" };
  return { label: "草稿", className: "status-warning" };
}

function updatedLabel(value: string | undefined): string {
  if (!value) return "暂无更新记录";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "暂无更新记录";
  return `${new Intl.DateTimeFormat("zh-CN", { month: "short", day: "numeric" }).format(date)}更新`;
}

export default function AssetLibraryPage() {
  const query = useAgents();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const allAgents = useMemo(() => query.data || [], [query.data]);
  const agents = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return allAgents.filter((agent) => {
      const matchesSearch = !keyword || `${agent.name} ${agent.code} ${agent.description}`.toLowerCase().includes(keyword);
      const matchesStatus =
        status === "all" ||
        (status === "creating" ? agent.creation_completed === false : agent.status === status && agent.creation_completed !== false);
      return matchesSearch && matchesStatus;
    });
  }, [allAgents, search, status]);
  const hasActiveFilters = search.trim().length > 0 || status !== "all";
  const clearFilters = () => {
    setSearch("");
    setStatus("all");
  };

  if (query.isLoading) return <LoadingState label="正在加载 Agent 资产…" />;
  if (query.isError) return <ErrorState message={query.error.message} onRetry={() => void query.refetch()} />;

  return (
    <div className="mx-auto w-full max-w-[1760px]" data-testid="asset-library">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3.5">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
            <Stack size={22} weight="duotone" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium text-text-muted">Workspace Assets</p>
            <h1 className="mt-0.5 text-2xl font-bold tracking-tight">Agent 资产库</h1>
            <p className="mt-1 text-sm text-text-muted">统一管理 Agent 的构建、测试、版本与发行入口。</p>
          </div>
        </div>
        <button type="button" className="button-primary shrink-0" onClick={() => router.push("/assets/create")}>
          <Plus size={17} />新建 Agent
        </button>
      </header>

      <section aria-label="Agent 资产筛选" className="panel mt-5 flex flex-col gap-3 p-3 lg:flex-row lg:items-center">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">搜索 Agent</span>
          <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={17} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="搜索 Agent 名称、编码或描述"
            className="control-field w-full pl-9"
          />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            ariaLabel="Agent 状态"
            value={status}
            onValueChange={(value) => setStatus(value as StatusFilter)}
            className="min-w-[152px] flex-1 sm:flex-none"
            options={[
              { value: "all", label: "全部状态" },
              { value: "active", label: "已发布" },
              { value: "draft", label: "草稿" },
              { value: "creating", label: "创建中" },
              { value: "archived", label: "已归档" },
            ]}
          />
          {hasActiveFilters ? (
            <button type="button" className="button-secondary px-3" onClick={clearFilters}>
              <X size={15} />
              清除
            </button>
          ) : null}
          <span className="min-w-20 text-right text-xs text-text-muted" aria-live="polite">
            显示 {agents.length} / {allAgents.length}
          </span>
        </div>
      </section>

      {agents.length === 0 ? (
        <section className="panel mt-4">
          <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
            <span className="grid size-12 place-items-center rounded-xl bg-primary-soft text-primary">
              <Stack size={24} weight="duotone" />
            </span>
            <h2 className="mt-4 text-base font-semibold">
              {allAgents.length ? "没有匹配的 Agent 资产" : "还没有 Agent 资产"}
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-text-muted">
              {allAgents.length
                ? "调整关键词或状态筛选，或者清除当前筛选条件。"
                : "创建第一个 Agent，从角色设定开始构建、测试并发行你的数字资产。"}
            </p>
            {allAgents.length ? (
              <button type="button" className="button-secondary mt-5" onClick={clearFilters}>
                <X size={16} />
                清除筛选
              </button>
            ) : (
              <button type="button" className="button-primary mt-5" onClick={() => router.push("/assets/create")}>
                <Plus size={17} />
                新建 Agent
              </button>
            )}
          </div>
        </section>
      ) : (
        <section aria-label="Agent 资产列表" className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {agents.map((agent) => {
            const presentation = statusPresentation(agent);
            const creating = agent.creation_completed === false;
            const model = agent.llm_model_name || agent.model || "尚未配置模型";
            return (
              <article
                key={agent.id}
                className="group relative flex min-h-[260px] flex-col rounded-xl border border-border bg-surface shadow-panel transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
              >
                <Link
                  href={assetHref(agent)}
                  aria-label={`查看 ${agent.name}`}
                  className="absolute inset-0 z-0 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                />
                <div className="pointer-events-none relative z-[1] flex flex-1 flex-col p-4">
                  <div className="flex min-w-0 items-start gap-3 pr-9">
                    <AgentAvatar agent={agent} size={58} className="rounded-xl ring-1 ring-border" />
                    <div className="min-w-0 flex-1 pt-0.5">
                      <h2 className="truncate text-base font-semibold">{agent.name}</h2>
                      <p className="mt-1 truncate text-xs text-text-muted">{agent.code || `agent-${agent.id}`}</p>
                      <span className={`status-badge mt-2 ${presentation.className}`}>{presentation.label}</span>
                    </div>
                  </div>
                  <p className="mt-4 line-clamp-3 min-h-[60px] text-sm leading-5 text-text-muted">
                    {agent.description || agent.tagline || "暂无资产描述，进入构建工作区完善 Agent 的角色与能力。"}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-subtle p-3">
                    <AssetMeta icon={<Cpu size={15} />} label="运行模型" value={model} />
                    <AssetMeta icon={<CalendarBlank size={15} />} label="最近更新" value={updatedLabel(agent.updated_at)} />
                  </div>
                </div>
                <div className="pointer-events-auto absolute right-2 top-2 z-10">
                  <AssetActions agent={agent} />
                </div>
                <footer className="pointer-events-none relative z-[1] flex items-center justify-between gap-3 border-t border-border px-4 py-3">
                  <span className="text-xs text-text-muted">
                    {creating ? "尚未发布版本" : `当前版本 ${versionLabel(agent.version, agent.current_version_id)}`}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                    {creating ? "继续创建" : "查看资产"}
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
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

function AssetMeta({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <span className="min-w-0">
      <span className="flex items-center gap-1.5 text-[11px] text-text-muted">
        {icon}
        {label}
      </span>
      <span className="mt-1 block truncate text-xs font-medium text-text-strong" title={value}>
        {value}
      </span>
    </span>
  );
}
