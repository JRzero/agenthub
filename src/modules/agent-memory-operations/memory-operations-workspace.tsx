"use client";

import React, { useState } from "react";
import {
  ArrowClockwise,
  ChartBar,
  CheckCircle,
  Clock,
  Database,
  Heart,
  Info,
  Pulse,
  ShieldCheck,
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
  "bg-indigo-600 dark:bg-indigo-400",
  "bg-violet-500 dark:bg-violet-400",
  "bg-blue-500 dark:bg-blue-400",
  "bg-fuchsia-500 dark:bg-fuchsia-400",
];
const emotionColors = [
  "bg-cyan-600 dark:bg-cyan-400",
  "bg-teal-500 dark:bg-teal-400",
  "bg-sky-500 dark:bg-sky-400",
  "bg-emerald-500 dark:bg-emerald-400",
];

type VisualTone = "neutral" | "relationship" | "emotion" | "activity";

const summaryToneClass: Record<
  VisualTone,
  { accent: string; icon: string; emphasis: string }
> = {
  neutral: {
    accent: "bg-primary",
    icon: "bg-primary-soft text-primary",
    emphasis: "text-primary",
  },
  relationship: {
    accent: "bg-indigo-600 dark:bg-indigo-400",
    icon: "bg-indigo-400/10 text-indigo-300 ring-1 ring-inset ring-indigo-400",
    emphasis: "text-indigo-300",
  },
  emotion: {
    accent: "bg-cyan-600 dark:bg-cyan-400",
    icon: "bg-cyan-400/10 text-cyan-300 ring-1 ring-inset ring-cyan-400",
    emphasis: "text-cyan-300",
  },
  activity: {
    accent: "bg-amber-500 dark:bg-amber-400",
    icon: "bg-amber-400/10 text-amber-300 ring-1 ring-inset ring-amber-400",
    emphasis: "text-amber-300",
  },
};
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
  label,
  value,
  emphasis,
  helper,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  emphasis?: string;
  helper: string;
  tone: VisualTone;
}) {
  const toneClass = summaryToneClass[tone];

  return (
    <article
      data-summary-tone={tone}
      className="panel relative min-h-[132px] min-w-0 overflow-hidden p-4"
    >
      <span className={`absolute inset-x-0 top-0 h-0.5 ${toneClass.accent}`} />
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-text-strong">{label}</p>
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${toneClass.icon}`}
        >
          {icon}
        </span>
      </div>
      <div className="mt-2.5 min-w-0">
        <p className="flex flex-wrap items-baseline gap-2">
          <span className="text-2xl font-semibold leading-none tracking-tight tabular-nums">
            {value}
          </span>
          {emphasis && (
            <span className={`text-sm font-semibold tabular-nums ${toneClass.emphasis}`}>
              {emphasis}
            </span>
          )}
        </p>
        <p className="mt-2.5 text-xs leading-5 text-text-muted">{helper}</p>
      </div>
    </article>
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
      className="button-primary h-11 min-h-11 rounded-lg px-4 shadow-sm shadow-primary/20"
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
      <div className="rounded-lg border border-dashed border-border bg-subtle/50 px-4 py-4">
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-xs leading-5 text-text-muted">{emptyText}</p>
      </div>
    );
  }
  if (items.length === 0) {
    return (
      <div className="rounded-lg bg-subtle px-4 py-3 text-xs text-text-muted">
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
      <div
        className="mt-3 flex h-2 overflow-hidden rounded-full bg-subtle"
        aria-label={`${title}分布`}
      >
        {items.map((item, index) => (
          <span
            key={item.key}
            className={colors[index % colors.length]}
            style={{ width: `${Math.max((item.share || 0) * 100, 1)}%` }}
          />
        ))}
      </div>
      <div className="mt-2.5 grid gap-2 sm:grid-cols-2 2xl:grid-cols-3">
        {items.map((item, index) => (
          <div
            key={item.key}
            className="flex min-w-0 items-center gap-2 rounded-lg bg-subtle/65 px-3 py-2 text-xs"
          >
            <span
              className={`h-2.5 w-2.5 shrink-0 rounded-full ${colors[index % colors.length]}`}
            />
            <span className="min-w-0 flex-1 font-medium text-text-strong">
              {item.label}
            </span>
            <span className="shrink-0 text-text-muted tabular-nums">
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
  const availableClass =
    tone === "relationship"
      ? "bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400"
      : "bg-gradient-to-r from-cyan-600 to-teal-500 dark:from-cyan-400 dark:to-teal-400";
  const iconClass =
    tone === "relationship"
      ? "bg-indigo-400/10 text-indigo-300 ring-1 ring-inset ring-indigo-400"
      : "bg-cyan-400/10 text-cyan-300 ring-1 ring-inset ring-cyan-400";
  const availablePill =
    tone === "relationship"
      ? "bg-indigo-400/10 text-indigo-300 ring-1 ring-inset ring-indigo-400"
      : "bg-cyan-400/10 text-cyan-300 ring-1 ring-inset ring-cyan-400";

  return (
    <section
      data-memory-channel={tone}
      data-density="compact"
      className="px-4 py-4 sm:px-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconClass}`}
          >
            {tone === "relationship" ? (
              <Heart size={18} weight="duotone" />
            ) : (
              <Pulse size={18} weight="duotone" />
            )}
          </span>
          <h2 className="text-base font-semibold">{title}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className={`rounded-full px-2.5 py-1 font-medium ${availablePill}`}>
            已获取 {available}
          </span>
          <span className="rounded-full bg-slate-400/10 px-2.5 py-1 font-medium text-slate-300 ring-1 ring-inset ring-slate-500">
            暂未获取 {unavailable}
          </span>
        </div>
      </div>
      {total === 0 ? (
        <div className="mt-3 rounded-lg bg-subtle px-3.5 py-3 text-sm text-text-muted">
          暂无样本，形成真实记忆关系后会在这里显示完整度。
        </div>
      ) : (
        <>
          <div className="mt-3 rounded-lg border border-border bg-subtle/40 px-3.5 py-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="flex items-baseline gap-2">
                <span className="text-xs font-medium text-text-muted">数据完整度</span>
                <span className="text-lg font-semibold leading-none tracking-tight tabular-nums">
                  {formatPercentage(coverage)}
                </span>
              </p>
              <p className="text-xs font-medium text-text-muted tabular-nums">
                {available} / {total} 份记忆关系
              </p>
            </div>
            <div
              role="progressbar"
              aria-label={`${title}完整度`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round((coverage || 0) * 100)}
              className="mt-2.5 flex h-2 min-w-0 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
            >
              <span
                className={availableClass}
                style={{ width: `${(coverage || 0) * 100}%` }}
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between gap-3 text-xs text-text-muted">
              <span>已获取 {available}</span>
              <span>暂未获取 {unavailable}</span>
            </div>
          </div>
          <div className="mt-4">{children}</div>
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

const diagnosticAccentClass: Record<MemoryDiagnosticTone, string> = {
  complete: "bg-success",
  partial: "bg-warning",
  accumulating: "bg-primary",
  empty: "bg-slate-400 dark:bg-slate-500",
};

function DiagnosticIcon({ tone }: { tone: MemoryDiagnosticTone }) {
  if (tone === "complete") return <CheckCircle size={20} weight="duotone" />;
  if (tone === "partial") return <WarningCircle size={20} weight="duotone" />;
  if (tone === "accumulating") return <Pulse size={20} weight="duotone" />;
  return <Database size={20} weight="duotone" />;
}

function DiagnosticPanel({ model }: { model: AgentMemoryOperationsModel }) {
  return (
    <aside
      data-diagnostic-tone={model.diagnostic.tone}
      className="panel relative h-fit overflow-hidden p-5"
    >
      <span
        className={`absolute inset-x-0 top-0 h-0.5 ${diagnosticAccentClass[model.diagnostic.tone]}`}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
            <DiagnosticIcon tone={model.diagnostic.tone} />
          </span>
          <h2 className="text-base font-semibold">当前情况</h2>
        </div>
        <span className={`status-badge ${diagnosticToneClass[model.diagnostic.tone]}`}>
          {model.diagnostic.badge}
        </span>
      </div>
      <p className="mt-4 text-sm font-medium leading-6">{model.diagnostic.summary}</p>
      <div className="mt-4 rounded-lg border border-primary/10 bg-primary-soft/55 p-3.5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-primary">
          建议
        </h3>
        <p className="mt-2 text-sm leading-6 text-text-muted">
          {model.diagnostic.advice}
        </p>
      </div>
      <div className="mt-4 flex items-start gap-2.5 rounded-lg bg-subtle px-3.5 py-3 text-xs leading-5 text-text-muted">
        <ShieldCheck size={18} weight="duotone" className="mt-0.5 shrink-0 text-primary" />
        <p>
          本页面只展示当前 Agent 的匿名聚合，不包含用户或单份记忆内容。
        </p>
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
  tone,
}: {
  title: string;
  subtitle: string;
  items: MemoryDistributionItem[] | null;
  colors: string[];
  unavailable: string;
  tone: "relationship" | "emotion";
}) {
  const accentClass =
    tone === "relationship"
      ? "bg-indigo-600 dark:bg-indigo-400"
      : "bg-cyan-600 dark:bg-cyan-400";

  return (
    <section className="panel relative overflow-hidden p-5">
      <span className={`absolute inset-x-0 top-0 h-0.5 ${accentClass}`} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="mt-1 text-xs leading-5 text-text-muted">{subtitle}</p>
        </div>
        <span className="status-badge status-neutral shrink-0">
          份记忆关系
        </span>
      </div>
      {!items ? (
        <div className="mt-4 rounded-lg border border-dashed border-border bg-subtle/50 px-4 py-7 text-center">
          <p className="text-sm font-semibold">暂未获取</p>
          <p className="mt-1 text-xs text-text-muted">{unavailable}</p>
        </div>
      ) : items.length === 0 ? (
        <div className="mt-4 rounded-lg bg-subtle px-4 py-7 text-center text-sm text-text-muted">
          尚未积累
        </div>
      ) : (
        <div className="mt-4 space-y-3.5" aria-label={`${title}分布`}>
          {items.map((item, index) => (
            <div
              key={item.key}
              className="grid grid-cols-[minmax(72px,0.8fr)_minmax(80px,2fr)_auto] items-center gap-3 text-sm"
            >
              <span className="flex items-center gap-2 font-medium">
                <span
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${colors[index % colors.length]}`}
                />
                {item.label}
              </span>
              <div className="h-2 overflow-hidden rounded-full bg-subtle">
                <div
                  className={`h-full rounded-full ${colors[index % colors.length]}`}
                  style={{ width: `${Math.min((item.share || 0) * 100, 100)}%` }}
                />
              </div>
              <span className="text-right text-xs text-text-muted tabular-nums">
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
  tone,
}: {
  title: string;
  helper: string;
  scores: MemoryScoreItem[] | null;
  sampleCount?: number | null;
  tone: "relationship" | "emotion";
}) {
  const accentClass =
    tone === "relationship"
      ? "bg-indigo-600 dark:bg-indigo-400"
      : "bg-cyan-600 dark:bg-cyan-400";
  const iconClass =
    tone === "relationship"
      ? "bg-indigo-400/10 text-indigo-300 ring-1 ring-inset ring-indigo-400"
      : "bg-cyan-400/10 text-cyan-300 ring-1 ring-inset ring-cyan-400";

  return (
    <section className="panel relative overflow-hidden p-5">
      <span className={`absolute inset-x-0 top-0 h-0.5 ${accentClass}`} />
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
            {tone === "relationship" ? (
              <Heart size={18} weight="duotone" />
            ) : (
              <WaveSine size={18} weight="duotone" />
            )}
          </span>
          <div>
            <h3 className="text-base font-semibold">{title}</h3>
            <p className="mt-1 text-xs leading-5 text-text-muted">{helper}</p>
          </div>
        </div>
        {sampleCount !== undefined && sampleCount !== null && (
          <span className="status-badge status-neutral">
            共 {sampleCount} 条情绪记录
          </span>
        )}
      </div>
      {!scores ? (
        <div className="mt-4 rounded-lg border border-dashed border-border bg-subtle/50 px-4 py-7 text-center">
          <p className="text-sm font-semibold">暂未获取</p>
          <p className="mt-1 text-xs text-text-muted">对应服务信号当前不可用</p>
        </div>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {scores.map((score) => (
            <div
              key={score.key}
              className="rounded-xl border border-border bg-subtle/35 px-4 py-3.5"
            >
              <p className="text-xs text-text-muted">{score.label}</p>
              <p className="mt-1 text-xl font-semibold tracking-tight tabular-nums">
                {formatMetric(score.value)}
              </p>
              <p className="mt-1 text-xs leading-5 text-text-muted">
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
    <section className="panel relative flex min-h-[320px] overflow-hidden px-6 py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-soft/70 via-transparent to-cyan-50/70 dark:to-cyan-400/5" />
      <div className="relative m-auto flex max-w-xl flex-col items-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/10 bg-surface text-primary shadow-sm">
          <Database size={30} weight="duotone" />
        </span>
        <h2 className="mt-5 text-xl font-semibold">记忆关系尚未积累</h2>
        <p className="mt-2 text-sm leading-6 text-text-muted">
          当前没有可分析的匿名样本。真实用户与 Agent 互动并形成记忆关系后，这里会显示数据完整度和信号分布。
        </p>
        <div className="mt-5 flex items-center gap-2 rounded-full bg-surface/80 px-3 py-1.5 text-xs text-text-muted ring-1 ring-inset ring-border">
          <ShieldCheck size={16} weight="duotone" className="text-primary" />
          仅展示匿名聚合数据
        </div>
      </div>
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
    <section className="panel relative flex min-h-[360px] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="absolute inset-x-0 top-0 h-1 bg-warning" />
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-warning dark:bg-amber-400/10">
        <WarningCircle size={30} weight="duotone" />
      </span>
      <h2 className="mt-5 text-xl font-semibold">{state.title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-text-muted">{state.message}</p>
      {state.retryable && (
        <button
          type="button"
          className="button-secondary mt-6 h-11 min-h-11 rounded-lg"
          onClick={onRetry}
        >
          <ArrowClockwise size={17} />
          重试
        </button>
      )}
    </section>
  );
}

function SectionHeading({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-3 flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
        {icon}
      </span>
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <p className="mt-0.5 text-xs leading-5 text-text-muted">{description}</p>
      </div>
    </div>
  );
}

function MemoryOperationsSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-busy="true">
      <span className="sr-only">正在获取记忆服务状态…</span>
      <div className="panel h-[116px] animate-pulse bg-gradient-to-br from-surface to-primary-soft/50 p-5">
        <div className="skeleton h-5 w-40" />
        <div className="skeleton mt-3 h-4 w-72 max-w-full" />
        <div className="skeleton mt-5 h-4 w-52 max-w-full" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="panel min-h-[132px] p-4">
            <div className="flex items-center justify-between">
              <div className="skeleton h-4 w-24" />
              <div className="skeleton h-9 w-9 rounded-lg" />
            </div>
            <div className="skeleton mt-4 h-7 w-28" />
            <div className="skeleton mt-4 h-3 w-36 max-w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function OperationsContent({ model }: { model: AgentMemoryOperationsModel }) {
  return (
    <>
      <section
        aria-label="记忆服务摘要"
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        <SummaryCard
          icon={<Database size={22} weight="duotone" />}
          label="记忆关系"
          value={String(model.totalMemories)}
          helper="每位用户与 Agent 对应一份独立记忆关系"
          tone="neutral"
        />
        <SummaryCard
          icon={<Heart size={22} weight="duotone" />}
          label="关系数据完整度"
          value={`${model.relationshipAvailable} / ${model.totalMemories}`}
          emphasis={formatPercentage(model.relationshipCoverage)}
          helper="已获取 / 记忆关系总数"
          tone="relationship"
        />
        <SummaryCard
          icon={<Pulse size={22} weight="duotone" />}
          label="情绪数据完整度"
          value={`${model.emotionAvailable} / ${model.totalMemories}`}
          emphasis={formatPercentage(model.emotionCoverage)}
          helper="已获取 / 记忆关系总数"
          tone="emotion"
        />
        <SummaryCard
          icon={<WaveSine size={22} weight="duotone" />}
          label="情绪记录"
          value={model.emotionSampleCount === null ? "—" : String(model.emotionSampleCount)}
          helper={
            model.emotionSampleCount === null
              ? model.totalMemories === 0
                ? "尚未积累情绪记录"
                : "对应数据暂未获取"
              : "已形成的匿名情绪记录总数"
          }
          tone="activity"
        />
      </section>

      {model.totalMemories === 0 ? (
        <EmptyMemoryState />
      ) : (
        <>
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.65fr)]">
            <div className="panel overflow-hidden divide-y divide-border">
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
            <SectionHeading
              icon={<Smiley size={20} weight="duotone" />}
              title="当前互动感受"
              description="按已获取的匿名情绪数据展示当前状态，不代表价值判断"
            />
            <div className="grid gap-4 lg:grid-cols-2">
              <DistributionPanel
                title="近期状态"
                subtitle="可多选、可共存，各项比例不要求合计为 100%"
                items={model.recentStates}
                colors={relationshipColors}
                unavailable="情绪服务信号恢复后会显示近期状态"
                tone="relationship"
              />
              <DistributionPanel
                title="整体心境"
                subtitle="当前匿名样本中的心境标签分布"
                items={model.moods}
                colors={emotionColors}
                unavailable="情绪服务信号恢复后会显示整体心境"
                tone="emotion"
              />
            </div>
          </section>

          <section>
            <SectionHeading
              icon={<ChartBar size={20} weight="duotone" />}
              title="聚合体验信号"
              description="不同量纲分别解释，仅用于理解当前匿名样本"
            />
            <div className="grid gap-4 lg:grid-cols-2">
              <ScorePanel
                title="记忆关系信号"
                helper="仅用于理解当前匿名样本，不代表好坏评分"
                scores={model.relationshipScores}
                tone="relationship"
              />
              <ScorePanel
                title="情绪记录信号"
                helper="服务端按情绪记录数加权，不与其他量纲横向比较"
                scores={model.emotionScores}
                sampleCount={model.emotionSampleCount}
                tone="emotion"
              />
            </div>
          </section>
        </>
      )}

      <details className="panel group overflow-hidden">
        <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 px-5 py-3 text-sm font-semibold transition-colors hover:bg-subtle/70 sm:px-6">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-primary">
            <Info size={18} weight="duotone" />
          </span>
          指标说明与隐私边界
          <span className="ml-auto text-xs font-normal text-text-muted group-open:hidden">
            展开查看
          </span>
        </summary>
        <div className="grid gap-4 border-t border-border bg-subtle/30 px-5 py-5 text-xs leading-6 text-text-muted md:grid-cols-2 sm:px-6">
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
    return <MemoryOperationsSkeleton />;
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
      <header className="panel relative overflow-hidden bg-gradient-to-br from-surface via-surface to-primary-soft/60 p-4 sm:p-5">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-primary/5 blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/10 bg-primary-soft text-primary">
              <Database size={22} weight="duotone" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">记忆服务状态</h2>
                <span
                  className={`status-badge ${DATA_MODE === "demo" ? "status-info" : "status-success"}`}
                >
                  {DATA_MODE === "demo" ? "Demo 演示数据" : "实时匿名聚合"}
                </span>
              </div>
              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-text-muted">
                查看这个 Agent 已形成多少份记忆关系，以及关系与情绪数据是否完整
              </p>
            </div>
          </div>
          <div className="flex flex-col items-stretch gap-3 rounded-xl border border-border bg-surface/80 p-3 shadow-sm sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-center gap-2.5 px-1 text-xs text-text-muted">
              <Clock size={17} weight="duotone" className="shrink-0 text-primary" />
              <span className="min-w-0">
                {stale ? "上次获取时间" : "本次获取时间"}
                <span className="ml-1 font-medium text-text-strong tabular-nums">
                  {formatRetrievedAt(query.dataUpdatedAt)}
                </span>
              </span>
            </div>
            {feedback && (
              <span
                role="status"
                className={`text-xs font-medium ${
                  feedback.startsWith("数据已") ? "text-success" : "text-warning"
                }`}
              >
                {feedback}
              </span>
            )}
            <MemoryRefreshButton
              refreshing={query.isFetching}
              onRefresh={() => void handleRefresh()}
            />
          </div>
        </div>
      </header>

      {stale && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-warning bg-[var(--color-status-warning-bg)] px-4 py-3.5 text-sm text-[var(--color-status-warning-text)]"
        >
          <WarningCircle size={19} weight="duotone" className="mt-0.5 shrink-0" />
          <span>
            本次刷新失败，下面保留的是上次成功获取的匿名快照。稍后可再次刷新。
          </span>
        </div>
      )}

      {query.data.partial && !stale && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-warning bg-[var(--color-status-warning-bg)] px-4 py-3.5 text-sm text-[var(--color-status-warning-text)]"
        >
          <Info size={19} weight="duotone" className="mt-0.5 shrink-0" />
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
