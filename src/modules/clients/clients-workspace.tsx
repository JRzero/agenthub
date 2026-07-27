"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowClockwise,
  CaretRight,
  MagnifyingGlass,
  Plus,
  WarningCircle,
} from "@phosphor-icons/react";
import { DATA_MODE } from "@/config/capabilities";
import { AgentAvatar } from "@/modules/agents/agent-avatar";
import { SourceBadge } from "@/shared/ui/source-badge";
import { ClientIcon } from "./client-icon";
import {
  clientSyncLabel,
  clientTypeLabel,
  filterWorkspaceAgentClients,
  formatClientDate,
  type ClientFilters,
  type ClientSyncStatus,
} from "./model";
import { useWorkspaceAgentClients } from "./queries";

const DEFAULT_FILTERS: ClientFilters = {
  query: "",
  agentId: "all",
  clientType: "all",
  status: "all",
  syncStatus: "all",
};

function SyncBadge({ status }: { status: ClientSyncStatus }) {
  const styles = {
    synced: "status-success",
    pending: "status-warning",
    unconfirmed: "status-neutral",
    disabled: "status-neutral",
  }[status];
  return (
    <span className={`status-badge ${styles}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {clientSyncLabel(status)}
    </span>
  );
}

export function ClientsWorkspace() {
  const data = useWorkspaceAgentClients();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const clientTypes = useMemo(
    () =>
      Array.from(new Set(data.rows.map((row) => row.client.client_type))).sort(),
    [data.rows],
  );
  const rows = useMemo(
    () => filterWorkspaceAgentClients(data.rows, filters),
    [data.rows, filters],
  );
  const enabled = data.rows.filter(
    (row) => row.client.status === "enabled",
  ).length;
  const synced = data.rows.filter(
    (row) => row.syncStatus === "synced",
  ).length;

  if (data.agentsError) {
    return (
      <section className="space-y-5">
        <PageHeader />
        <div className="panel grid min-h-[420px] place-items-center p-8 text-center">
          <div>
            <WarningCircle size={34} className="mx-auto text-danger" />
            <h2 className="mt-3 text-lg font-semibold">无法读取 Agent 列表</h2>
            <p className="mt-2 text-sm text-text-muted">
              {data.agentsError.message}
            </p>
            <button
              type="button"
              className="button-secondary mt-5"
              onClick={() => void data.retryAgents()}
            >
              <ArrowClockwise size={17} />
              重试
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5 pb-8">
      <PageHeader />

      <div className="grid gap-3 sm:grid-cols-3">
        <Summary label="接入记录" value={data.rows.length} hint="每条对应一个 Agent" />
        <Summary label="已启用" value={enabled} hint="正在跟随平台当前版本" />
        <Summary label="已同步" value={synced} hint="最近确认版本一致" />
      </div>

      {data.failures.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50/80 px-4 py-3 dark:border-amber-400/20 dark:bg-amber-400/10">
          <div className="flex items-start gap-3">
            <WarningCircle size={20} className="mt-0.5 shrink-0 text-warning" />
            <div className="min-w-0 flex-1">
              <p className="font-medium">部分接入记录暂时无法加载</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {data.failures.map((failure) => (
                  <button
                    key={failure.agent.id}
                    type="button"
                    onClick={() => void failure.retry()}
                    className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-surface px-2.5 py-1.5 text-xs hover:border-warning"
                    title={failure.message}
                  >
                    <ArrowClockwise size={14} />
                    重试 {failure.agent.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="panel overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3.5">
          <label className="relative min-w-[220px] flex-1 lg:max-w-sm">
            <MagnifyingGlass
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              value={filters.query}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  query: event.target.value,
                }))
              }
              placeholder="搜索 Client、Agent 或 Client Key"
              className="h-10 w-full rounded-md border border-border bg-surface pl-9 pr-3 outline-none transition focus:border-primary"
            />
          </label>
          <select
            aria-label="按 Agent 筛选"
            value={filters.agentId}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                agentId:
                  event.target.value === "all"
                    ? "all"
                    : Number(event.target.value),
              }))
            }
            className="h-10 rounded-md border border-border bg-surface px-3"
          >
            <option value="all">全部 Agent</option>
            {data.agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </select>
          <select
            aria-label="按 Client 类型筛选"
            value={filters.clientType}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                clientType: event.target.value,
              }))
            }
            className="h-10 rounded-md border border-border bg-surface px-3"
          >
            <option value="all">全部类型</option>
            {clientTypes.map((type) => (
              <option key={type} value={type}>
                {clientTypeLabel(type)}
              </option>
            ))}
          </select>
          <select
            aria-label="按启用状态筛选"
            value={filters.status}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                status: event.target.value as ClientFilters["status"],
              }))
            }
            className="h-10 rounded-md border border-border bg-surface px-3"
          >
            <option value="all">全部状态</option>
            <option value="enabled">已启用</option>
            <option value="disabled">已停用</option>
          </select>
          <select
            aria-label="按同步状态筛选"
            value={filters.syncStatus}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                syncStatus: event.target.value as ClientFilters["syncStatus"],
              }))
            }
            className="h-10 rounded-md border border-border bg-surface px-3"
          >
            <option value="all">全部同步状态</option>
            <option value="synced">已同步</option>
            <option value="pending">等待同步</option>
            <option value="unconfirmed">尚未确认</option>
            <option value="disabled">已停用</option>
          </select>
        </div>

        <div className="hidden grid-cols-[minmax(260px,1.3fr)_minmax(180px,.8fr)_140px_150px_150px_36px] gap-4 border-b border-border bg-subtle/70 px-5 py-2.5 text-xs font-semibold text-text-muted lg:grid">
          <span>Client 接入</span>
          <span>所属 Agent</span>
          <span>平台当前版本</span>
          <span>同步状态</span>
          <span>最近连接</span>
          <span />
        </div>

        {data.isLoading && !data.rows.length ? (
          <div className="grid min-h-[360px] place-items-center text-sm text-text-muted">
            <span className="flex items-center gap-3">
              <span className="size-5 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
              正在汇总 Client 接入记录…
            </span>
          </div>
        ) : rows.length ? (
          <div className="divide-y divide-border">
            {rows.map((row) => (
              <Link
                key={row.client.id}
                href={`/clients/${row.client.id}?agentId=${row.agent.id}`}
                className="grid gap-3 px-4 py-4 transition hover:bg-subtle/70 lg:grid-cols-[minmax(260px,1.3fr)_minmax(180px,.8fr)_140px_150px_150px_36px] lg:items-center lg:gap-4 lg:px-5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`grid size-10 shrink-0 place-items-center rounded-lg ${
                      row.client.status === "enabled"
                        ? "bg-primary text-white"
                        : "bg-slate-200 text-slate-500 dark:bg-slate-700"
                    }`}
                  >
                    <ClientIcon type={row.client.client_type} />
                  </span>
                  <span className="min-w-0">
                    <strong className="block truncate">{row.client.name}</strong>
                    <span className="mt-0.5 block truncate text-xs text-text-muted">
                      {clientTypeLabel(row.client.client_type)} ·{" "}
                      {row.client.client_key}
                    </span>
                  </span>
                </div>
                <div className="flex min-w-0 items-center gap-2">
                  <AgentAvatar agent={row.agent} size={30} />
                  <span className="truncate text-sm">{row.agent.name}</span>
                </div>
                <div className="text-sm">
                  {row.agent.current_version_id
                    ? `v${row.agent.version}`
                    : "尚未发布"}
                </div>
                <div>
                  <SyncBadge status={row.syncStatus} />
                </div>
                <div className="text-sm text-text-muted">
                  {formatClientDate(row.client.last_seen_at)}
                </div>
                <CaretRight
                  size={18}
                  className="hidden text-text-muted lg:block"
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid min-h-[360px] place-items-center px-6 text-center">
            <div>
              <ClientIcon type="web_chat" size={34} />
              <h2 className="mt-3 text-base font-semibold">
                {data.rows.length ? "没有符合条件的接入记录" : "尚未接入 Client"}
              </h2>
              <p className="mt-2 text-sm text-text-muted">
                {data.rows.length
                  ? "调整筛选条件后再试。"
                  : "先选择一个 Agent，再为它创建 Client 接入记录。"}
              </p>
              {!data.rows.length && (
                <Link href="/clients/new" className="button-primary mt-5">
                  <Plus size={17} />
                  新建 Client 接入
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function PageHeader() {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
          <SourceBadge source={DATA_MODE === "demo" ? "demo" : "live"} />
        </div>
        <p className="mt-1.5 text-sm text-text-muted">
          跨 Agent 管理每一条真实 Client 接入记录
        </p>
      </div>
      <Link href="/clients/new" className="button-primary">
        <Plus size={17} />
        新建 Client 接入
      </Link>
    </header>
  );
}

function Summary({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <div className="panel px-4 py-3.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium">{label}</span>
        <strong className="text-2xl tracking-tight">{value}</strong>
      </div>
      <p className="mt-1 text-xs text-text-muted">{hint}</p>
    </div>
  );
}
