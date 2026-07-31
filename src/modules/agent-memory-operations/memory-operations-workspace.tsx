"use client";

import React, { useState } from "react";
import {
  ArrowClockwise,
  ChartBar,
  CheckCircle,
  Database,
  Heart,
  Info,
  Pulse,
  Smiley,
  WarningCircle,
  WaveSine,
} from "@phosphor-icons/react";
import { DATA_MODE } from "@/config/capabilities";
import {
  formatMetric,
  formatPercentage,
  isStaleMemorySnapshot,
  resolveMemoryAnalyticsError,
} from "./model";
import { useAgentMemoryAnalytics } from "./queries";
import type {
  AgentMemoryOperationsModel,
  MemoryAnalyticsErrorState,
  MemoryDiagnosticTone,
  MemoryDistributionItem,
  MemoryScoreItem,
} from "./types";

const relationshipColors = [
  "bg-rose-500",
  "bg-rose-400",
  "bg-orange-400",
  "bg-pink-300",
];
const emotionColors = [
  "bg-emerald-500",
  "bg-emerald-400",
  "bg-lime-500",
  "bg-teal-400",
];
function formatRetrievedAt(timestamp: number): string {
  if (!timestamp) return "等待首次获取";
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(timestamp));
}

function scaleDescription(score: MemoryScoreItem): string {
  if (score.key === "milestone_count") return "累计数量";
  if (!score.scale || typeof score.scale !== "object") return "服务未返回量纲";
  const scale = score.scale as Record<string, unknown>;
  if (typeof scale.description === "string") return scale.description;
  const min = typeof scale.min === "number" ? scale.min : null;
  const max = typeof scale.max === "number" ? scale.max : null;
  const unit = typeof scale.unit === "string" ? ` ${scale.unit}` : "";
  if (min !== null && max !== null) return `量纲 ${min} 至 ${max}${unit}`;
  return "按服务返回量纲解释";
}

function SummaryCard({
  icon,
  iconClass,
  label,
  value,
  emphasis,
  helper,
}: {
  icon: React.ReactNode;
  iconClass: string;
  label: string;
  value: string;
  emphasis?: string;
  helper: string;
}) {
  return (
    <div className="flex min-h-[132px] min-w-0 gap-3 px-5 py-5">
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconClass}`}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-text-strong">{label}</p>
        <p className="mt-1 flex flex-wrap items-baseline gap-2">
          <span className="text-[26px] font-semibold leading-none tracking-tight">
            {value}
          </span>
          {emphasis && (
            <span className="text-sm font-semibold text-primary">{emphasis}</span>
          )}
        </p>
        <p className="mt-2 text-xs leading-5 text-text-muted">{helper}</p>
      </div>
    </div>
  );
}

export function MemoryRefreshButton({
  refreshing,
  onRefresh,
}: {
  refreshing: boolean;
  onRefresh: () => void;
}) {
  return (
    <button
      type="button"
      className="button-primary control-compact"
      onClick={onRefresh}
      disabled={refreshing}
    >
      <ArrowClockwise
        size={16}
        className={refreshing ? "loading-spin" : undefined}
      />
      {refreshing ? "正在刷新" : "刷新"}
    </button>
  );
}

function DistributionStrip({
  title,
  items,
  colors,
  emptyText,
  mismatch,
}: {
  title: string;
  items: MemoryDistributionItem[] | null;
  colors: string[];
  emptyText: string;
  mismatch?: boolean;
}) {
  if (!items) {
    return (
      <div className="rounded-md border border-dashed border-border bg-subtle/50 px-4 py-4">
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-xs text-text-muted">{emptyText}</p>
      </div>
    );
  }
  if (items.length === 0) {
    return (
      <div className="rounded-md bg-subtle px-4 py-3 text-xs text-text-muted">
        {title}：暂无样本
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold">{title}</p>
        {mismatch && (
          <span className="status-badge status-warning">上游阶段口径待确认</span>
        )}
      </div>
      <div className="mt-3 flex h-1.5 overflow-hidden rounded-full bg-subtle">
        {items.map((item, index) => (
          <span
            key={item.key}
            className={colors[index % colors.length]}
            style={{ width: `${Math.max((item.share || 0) * 100, 1)}%` }}
          />
        ))}
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => (
          <div key={item.key} className="flex items-center gap-2 text-xs">
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${colors[index % colors.length]}`}
            />
            <span className="font-medium text-text-strong">{item.label}</span>
            <span className="text-text-muted">
              {item.count} · {formatPercentage(item.share)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CoverageLane({
  title,
  available,
  unavailable,
  total,
  coverage,
  tone,
  children,
}: {
  title: string;
  available: number;
  unavailable: number;
  total: number;
  coverage: number | null;
  tone: "relationship" | "emotion";
  children: React.ReactNode;
}) {
  const availableClass = tone === "relationship" ? "bg-rose-500" : "bg-emerald-500";
  const iconClass =
    tone === "relationship"
      ? "bg-rose-50 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300"
      : "bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300";

  return (
    <section className="px-5 py-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-full ${iconClass}`}
          >
            {tone === "relationship" ? <Heart size={17} /> : <Pulse size={17} />}
          </span>
          <h2 className="text-base font-semibold">{title}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
          <span>已获取：{available}</span>
          <span>暂未获取：{unavailable}</span>
          <span>单位：份记忆关系</span>
        </div>
      </div>
      {total === 0 ? (
        <div className="mt-4 rounded-md bg-subtle px-4 py-4 text-sm text-text-muted">
          暂无样本，形成真实记忆关系后会在这里显示完整度。
        </div>
      ) : (
        <>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-8 min-w-0 flex-1 overflow-hidden rounded-md bg-slate-200 dark:bg-slate-700">
              <span
                className={`${availableClass} flex items-center justify-center text-xs font-semibold text-white`}
                style={{ width: `${(coverage || 0) * 100}%` }}
              >
                {available > 0 ? `${available}（${formatPercentage(coverage)}）` : ""}
              </span>
              {unavailable > 0 && (
                <span className="flex flex-1 items-center justify-center text-xs font-semibold text-slate-600 dark:text-slate-200">
                  {unavailable}
                </span>
              )}
            </div>
            <span className="w-12 text-right text-sm font-semibold">/ {total}</span>
          </div>
          <div className="mt-5">{children}</div>
        </>
      )}
    </section>
  );
}

const diagnosticToneClass: Record<MemoryDiagnosticTone, string> = {
  complete: "status-success",
  partial: "status-warning",
  accumulating: "status-info",
  empty: "status-neutral",
};

function DiagnosticPanel({ model }: { model: AgentMemoryOperationsModel }) {
  return (
    <aside className="panel p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold">当前情况</h2>
        <span className={`status-badge ${diagnosticToneClass[model.diagnostic.tone]}`}>
          {model.diagnostic.badge}
        </span>
      </div>
      <p className="mt-6 text-sm font-medium leading-6">{model.diagnostic.summary}</p>
      <div className="my-5 h-px bg-border" />
      <h3 className="text-sm font-semibold">建议</h3>
      <p className="mt-2 text-sm leading-6 text-text-muted">
        {model.diagnostic.advice}
      </p>
      <div className="mt-6 rounded-md bg-subtle px-3 py-3 text-xs leading-5 text-text-muted">
        本页面只展示当前 Agent 的匿名聚合，不包含用户或单份记忆内容。
      </div>
    </aside>
  );
}

function DistributionPanel({
  title,
  subtitle,
  items,
  colors,
  unavailable,
}: {
  title: string;
  subtitle: string;
  items: MemoryDistributionItem[] | null;
  colors: string[];
  unavailable: string;
}) {
  return (
    <section className="panel p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="mt-1 text-xs text-text-muted">{subtitle}</p>
        </div>
        <span className="text-xs text-text-muted">份记忆关系</span>
      </div>
      {!items ? (
        <div className="mt-5 rounded-md border border-dashed border-border bg-subtle/50 px-4 py-8 text-center">
          <p className="text-sm font-semibold">暂未获取</p>
          <p className="mt-1 text-xs text-text-muted">{unavailable}</p>
        </div>
      ) : items.length === 0 ? (
        <div className="mt-5 rounded-md bg-subtle px-4 py-8 text-center text-sm text-text-muted">
          尚未积累
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {items.map((item, index) => (
            <div
              key={item.key}
              className="grid grid-cols-[72px_minmax(0,1fr)_74px] items-center gap-3 text-sm"
            >
              <span className="flex items-center gap-2 font-medium">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${colors[index % colors.length]}`}
                />
                {item.label}
              </span>
              <div className="h-1.5 overflow-hidden rounded-full bg-subtle">
                <div
                  className={`h-full rounded-full ${colors[index % colors.length]}`}
                  style={{ width: `${Math.min((item.share || 0) * 100, 100)}%` }}
                />
              </div>
              <span className="text-right text-xs text-text-muted">
                {item.count} · {formatPercentage(item.share)}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function ScorePanel({
  title,
  helper,
  scores,
  sampleCount,
}: {
  title: string;
  helper: string;
  scores: MemoryScoreItem[] | null;
  sampleCount?: number | null;
}) {
  return (
    <section className="panel p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="mt-1 text-xs text-text-muted">{helper}</p>
        </div>
        {sampleCount !== undefined && sampleCount !== null && (
          <span className="status-badge status-neutral">
            共 {sampleCount} 条情绪记录
          </span>
        )}
      </div>
      {!scores ? (
        <div className="mt-5 rounded-md border border-dashed border-border bg-subtle/50 px-4 py-8 text-center">
          <p className="text-sm font-semibold">暂未获取</p>
          <p className="mt-1 text-xs text-text-muted">对应服务信号当前不可用</p>
        </div>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {scores.map((score) => (
            <div key={score.key} className="rounded-md border border-border px-4 py-3">
              <p className="text-xs text-text-muted">{score.label}</p>
              <p className="mt-1 text-xl font-semibold">
                {formatMetric(score.value)}
              </p>
              <p className="mt-1 text-[11px] text-text-muted">
                {score.value === null
                  ? "暂无可计算样本"
                  : scaleDescription(score)}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function EmptyMemoryState() {
  return (
    <section className="panel flex min-h-[300px] flex-col items-center justify-center px-6 py-12 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
        <Database size={28} weight="duotone" />
      </span>
      <h2 className="mt-4 text-lg font-semibold">记忆关系尚未积累</h2>
      <p className="mt-2 max-w-lg text-sm leading-6 text-text-muted">
        当前没有可分析的匿名样本。真实用户与 Agent 互动并形成记忆关系后，这里会显示数据完整度和信号分布。
      </p>
    </section>
  );
}

function MemoryAnalyticsErrorPanel({
  state,
  onRetry,
}: {
  state: MemoryAnalyticsErrorState;
  onRetry: () => void;
}) {
  return (
    <section className="panel flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
      <WarningCircle size={34} className="text-warning" />
      <h1 className="mt-4 text-lg font-semibold">{state.title}</h1>
      <p className="mt-2 max-w-md text-sm leading-6 text-text-muted">{state.message}</p>
      {state.retryable && (
        <button type="button" className="button-secondary mt-5" onClick={onRetry}>
          <ArrowClockwise size={17} />
          重试
        </button>
      )}
    </section>
  );
}

export function OperationsContent({ model }: { model: AgentMemoryOperationsModel }) {
  return (
    <>
      <section className="panel grid divide-y divide-border lg:grid-cols-4 lg:divide-x lg:divide-y-0">
        <SummaryCard
          icon={<Database size={22} weight="duotone" />}
          iconClass="bg-primary-soft text-primary"
          label="记忆关系"
          value={String(model.totalMemories)}
          helper="每位用户与 Agent 对应一份独立记忆关系"
        />
        <SummaryCard
          icon={<Heart size={22} weight="duotone" />}
          iconClass="bg-rose-50 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300"
          label="关系数据完整度"
          value={`${model.relationshipAvailable} / ${model.totalMemories}`}
          emphasis={formatPercentage(model.relationshipCoverage)}
          helper="已获取 / 记忆关系总数"
        />
        <SummaryCard
          icon={<Pulse size={22} weight="duotone" />}
          iconClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300"
          label="情绪数据完整度"
          value={`${model.emotionAvailable} / ${model.totalMemories}`}
          emphasis={formatPercentage(model.emotionCoverage)}
          helper="已获取 / 记忆关系总数"
        />
        <SummaryCard
          icon={<WaveSine size={22} weight="duotone" />}
          iconClass="bg-orange-50 text-orange-600 dark:bg-orange-400/10 dark:text-orange-300"
          label="情绪记录"
          value={model.emotionSampleCount === null ? "—" : String(model.emotionSampleCount)}
          helper={
            model.emotionSampleCount === null
              ? model.totalMemories === 0
                ? "尚未积累情绪记录"
                : "对应数据暂未获取"
              : "已形成的匿名情绪记录总数"
          }
        />
      </section>

      {model.totalMemories === 0 ? (
        <EmptyMemoryState />
      ) : (
        <>
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.65fr)]">
            <div className="panel divide-y divide-border">
              <CoverageLane
                title="关系数据"
                available={model.relationshipAvailable}
                unavailable={model.relationshipUnavailable}
                total={model.totalMemories}
                coverage={model.relationshipCoverage}
                tone="relationship"
              >
                <DistributionStrip
                  title="关系阶段"
                  items={model.relationshipStages}
                  colors={relationshipColors}
                  emptyText="关系数据当前暂未获取，不能显示为零。"
                  mismatch={model.relationshipStageCountsMatch === false}
                />
              </CoverageLane>
              <CoverageLane
                title="情绪数据"
                available={model.emotionAvailable}
                unavailable={model.emotionUnavailable}
                total={model.totalMemories}
                coverage={model.emotionCoverage}
                tone="emotion"
              >
                <DistributionStrip
                  title="情绪记录形成情况"
                  items={model.emotionFormation}
                  colors={emotionColors}
                  emptyText="情绪数据当前暂未获取，不能显示为零。"
                />
              </CoverageLane>
            </div>
            <DiagnosticPanel model={model} />
          </div>

          <section>
            <div className="mb-3 flex items-center gap-2">
              <Smiley size={20} className="text-primary" />
              <h2 className="text-lg font-semibold">当前互动感受</h2>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <DistributionPanel
                title="近期状态"
                subtitle="可多选、可共存，各项比例不要求合计为 100%"
                items={model.recentStates}
                colors={relationshipColors}
                unavailable="情绪服务信号恢复后会显示近期状态"
              />
              <DistributionPanel
                title="整体心境"
                subtitle="当前匿名样本中的心境标签分布"
                items={model.moods}
                colors={emotionColors}
                unavailable="情绪服务信号恢复后会显示整体心境"
              />
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2">
              <ChartBar size={20} className="text-primary" />
              <h2 className="text-lg font-semibold">聚合体验信号</h2>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <ScorePanel
                title="记忆关系信号"
                helper="仅用于理解当前匿名样本，不代表好坏评分"
                scores={model.relationshipScores}
              />
              <ScorePanel
                title="情绪记录信号"
                helper="服务端按情绪记录数加权，不与其他量纲横向比较"
                scores={model.emotionScores}
                sampleCount={model.emotionSampleCount}
              />
            </div>
          </section>
        </>
      )}

      <details className="panel group p-5">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold">
          <Info size={18} className="text-primary" />
          指标说明与隐私边界
          <span className="ml-auto text-xs font-normal text-text-muted group-open:hidden">
            展开查看
          </span>
        </summary>
        <div className="mt-4 grid gap-4 border-t border-border pt-4 text-xs leading-6 text-text-muted md:grid-cols-2">
          <ul className="space-y-1 pl-4">
            <li>数据完整度以当前全部记忆关系为分母。</li>
            <li>关系阶段以已获取关系数据为分母。</li>
            <li>情绪记录形成与近期状态以已获取情绪数据为分母。</li>
            <li>分母为 0 时显示“暂无样本”，不会显示 0%。</li>
          </ul>
          <ul className="space-y-1 pl-4">
            <li>同一份记忆关系可能同时出现多个近期状态，合计可超过 100%。</li>
            <li>“—”表示暂无可计算样本，不代表数值为 0。</li>
            <li>本页面不展示用户身份、消息、事实内容或单份记忆分数。</li>
            <li>这里只描述当前匿名快照，不提供趋势、效果归因或高风险判断。</li>
          </ul>
        </div>
      </details>
    </>
  );
}

export function MemoryOperationsWorkspace({ agentId }: { agentId: number }) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const query = useAgentMemoryAnalytics(agentId);
  const stale = isStaleMemorySnapshot(Boolean(query.data), query.error);

  async function handleRefresh() {
    setFeedback(null);
    const result = await query.refetch();
    setFeedback(result.isSuccess ? "数据已刷新" : "刷新失败，已保留上次获取的数据");
  }

  if (query.isPending) {
    return (
      <div className="panel flex min-h-[360px] items-center justify-center">
        <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        <span className="text-sm text-text-muted">正在获取记忆服务状态…</span>
      </div>
    );
  }

  if (!query.data && query.error) {
    return (
      <MemoryAnalyticsErrorPanel
        state={resolveMemoryAnalyticsError(query.error)}
        onRetry={() => void query.refetch()}
      />
    );
  }

  if (!query.data) return null;

  return (
    <div className="space-y-4 pb-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">记忆服务状态</h1>
            <span
              className={`status-badge ${DATA_MODE === "demo" ? "status-info" : "status-success"}`}
            >
              {DATA_MODE === "demo" ? "Demo 演示数据" : "实时匿名聚合"}
            </span>
          </div>
          <p className="mt-1 text-sm text-text-muted">
            查看这个 Agent 已形成多少份记忆关系，以及数据是否完整
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 lg:items-end">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted">
            <span>
              {stale ? "上次获取时间" : "本次获取时间"}：
              {formatRetrievedAt(query.dataUpdatedAt)}
            </span>
            {feedback && (
              <span className={feedback.startsWith("数据已") ? "text-success" : "text-warning"}>
                {feedback}
              </span>
            )}
          </div>
          <MemoryRefreshButton
            refreshing={query.isFetching}
            onRefresh={() => void handleRefresh()}
          />
        </div>
      </header>

      {stale && (
        <div
          role="status"
          className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200"
        >
          <WarningCircle size={18} className="mt-0.5 shrink-0" />
          <span>
            本次刷新失败，下面保留的是上次成功获取的匿名快照。稍后可再次刷新。
          </span>
        </div>
      )}

      {query.data.partial && !stale && (
        <div
          role="status"
          className="flex items-start gap-2 rounded-md border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800 dark:border-orange-400/20 dark:bg-orange-400/10 dark:text-orange-200"
        >
          <Info size={18} className="mt-0.5 shrink-0" />
          <span>本次部分数据暂未获取，已获取的匿名聚合仍可正常查看。</span>
        </div>
      )}

      {!query.data.partial && query.data.totalMemories > 0 && !stale && (
        <div className="sr-only" role="status">
          <CheckCircle size={16} />
          本次数据完整
        </div>
      )}

      <OperationsContent model={query.data} />
    </div>
  );
}
