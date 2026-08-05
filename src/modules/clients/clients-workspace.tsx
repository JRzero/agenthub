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
import { Select } from "@/shared/ui/select";
import { SourceBadge } from "@/shared/ui/source-badge";
import { ClientIcon } from "./client-icon";
import {
  clientEnvironmentLabel,
  clientSyncLabel,
  clientTypeLabel,
  filterWorkspaceAgentClients,
  formatClientDate,
  maskClientKey,
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
  const attention = data.rows.filter(
    (row) => row.syncStatus === "pending" || row.syncStatus === "unconfirmed",
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

      <div className="panel grid divide-y divide-border overflow-hidden sm:grid-cols-4 sm:divide-x sm:divide-y-0">
        <Summary label="接入记录" value={data.rows.length} hint="每条对应一个 Agent" />
        <Summary label="已启用" value={enabled} hint="正在跟随平台当前版本" />
        <Summary label="已同步" value={synced} hint="最近确认版本一致" />
        <Summary label="待确认" value={attention} hint="等待 Client 回报版本" warning={attention > 0} />
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
              className="control-field w-full pl-9"
            />
          </label>
          <Select
            ariaLabel="按 Agent 筛选"
            value={String(filters.agentId)}
            onValueChange={(value) =>
              setFilters((current) => ({
                ...current,
                agentId: value === "all" ? "all" : Number(value),
              }))
            }
            options={[
              { value: "all", label: "全部 Agent" },
              ...data.agents.map((agent) => ({
                value: String(agent.id),
                label: agent.name,
              })),
            ]}
          />
          <Select
            ariaLabel="按 Client 类型筛选"
            value={filters.clientType}
            onValueChange={(value) =>
              setFilters((current) => ({ ...current, clientType: value }))
            }
            options={[
              { value: "all", label: "全部类型" },
              ...clientTypes.map((type) => ({
                value: type,
                label: clientTypeLabel(type),
              })),
            ]}
          />
          <Select
            ariaLabel="按启用状态筛选"
            value={filters.status}
            onValueChange={(value) =>
              setFilters((current) => ({
                ...current,
                status: value as ClientFilters["status"],
              }))
            }
            options={[
              { value: "all", label: "全部状态" },
              { value: "enabled", label: "已启用" },
              { value: "disabled", label: "已停用" },
            ]}
          />
          <Select
            ariaLabel="按同步状态筛选"
            value={filters.syncStatus}
            onValueChange={(value) =>
              setFilters((current) => ({
                ...current,
                syncStatus: value as ClientFilters["syncStatus"],
              }))
            }
            options={[
              { value: "all", label: "全部同步状态" },
              { value: "synced", label: "已同步" },
              { value: "pending", label: "等待同步" },
              { value: "unconfirmed", label: "尚未确认" },
              { value: "disabled", label: "已停用" },
            ]}
          />
        </div>

        <div className="hidden grid-cols-[minmax(250px,1.2fr)_110px_minmax(150px,.8fr)_120px_130px_130px_28px] gap-3 border-b border-border bg-subtle/70 px-5 py-2.5 text-xs font-semibold text-text-muted lg:grid">
          <span>Client 接入</span>
          <span>环境</span>
          <span>所属 Agent</span>
          <span>平台当前版本</span>
          <span>同步状态</span>
          <span>最近活动</span>
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
                className="grid gap-3 px-4 py-4 transition hover:bg-subtle/70 lg:grid-cols-[minmax(250px,1.2fr)_110px_minmax(150px,.8fr)_120px_130px_130px_28px] lg:items-center lg:gap-3 lg:px-5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`grid size-10 shrink-0 place-items-center rounded-lg ${
                      row.client.status === "enabled"
                        ? "bg-primary text-canvas"
                        : "bg-slate-200 text-slate-500 dark:bg-slate-700"
                    }`}
                  >
                    <ClientIcon type={row.client.client_type} />
                  </span>
                  <span className="min-w-0">
                    <strong className="block truncate">{row.client.name}</strong>
                    <span className="mt-0.5 block truncate text-xs text-text-muted">
                      {clientTypeLabel(row.client.client_type)} · {maskClientKey(row.client.client_key)}
                    </span>
                  </span>
                </div>
                <div className="text-sm text-text-secondary">
                  {clientEnvironmentLabel(row.client)}
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
            <div className="flex max-w-md flex-col items-center">
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
          <h1 className="text-3xl font-bold tracking-tight">接入管理</h1>
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
  warning = false,
}: {
  label: string;
  value: number;
  hint: string;
  warning?: boolean;
}) {
  return (
    <div className="px-4 py-3.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium">{label}</span>
        <strong className={`text-2xl tracking-tight ${warning ? "text-warning" : ""}`}>{value}</strong>
      </div>
      <p className="mt-1 text-xs text-text-muted">{hint}</p>
    </div>
  );
}
