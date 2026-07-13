"use client";

import { useMemo, useState } from "react";
import {
  ArrowCounterClockwise,
  CheckCircle,
  ClockCounterClockwise,
  GitDiff,
  GitFork,
  LockKey,
} from "@phosphor-icons/react";
import { capabilitySource } from "@/config/capabilities";
import type { Agent } from "@/modules/agents/types";
import { SourceBadge } from "@/shared/ui/source-badge";
import {
  buildCurrentVersion,
  buildDemoVersionHistory,
  compareVersions,
  createDemoDraft,
} from "./model";
import type { VersionStatus } from "./types";

const statusCopy: Record<VersionStatus, { label: string; className: string }> = {
  current: { label: "当前版本", className: "bg-emerald-50 text-emerald-700" },
  published: { label: "已发布", className: "bg-indigo-50 text-indigo-700" },
  archived: { label: "已归档", className: "bg-slate-100 text-slate-600" },
  draft: { label: "演示草稿", className: "bg-amber-50 text-amber-700" },
};

export function VersionsWorkspace({ agent }: { agent: Agent }) {
  const source = capabilitySource("versionHistory");
  const demo = source === "demo";
  const initial = useMemo(
    () => (demo ? buildDemoVersionHistory(agent) : [buildCurrentVersion(agent)]),
    [agent, demo],
  );
  const [versions, setVersions] = useState(initial);
  const [selectedId, setSelectedId] = useState(initial[0].id);
  const [baselineId, setBaselineId] = useState(initial[1]?.id || initial[0].id);
  const selected = versions.find((item) => item.id === selectedId) || versions[0];
  const baseline = versions.find((item) => item.id === baselineId) || versions.at(-1) || versions[0];
  const differences = compareVersions(baseline, selected);
  const changedCount = differences.filter((item) => item.changed).length;

  function createDraft() {
    const nextVersion = Math.max(...versions.map((item) => item.version)) + 1;
    const draft = createDemoDraft(selected, nextVersion);
    setVersions((current) => [draft, ...current]);
    setBaselineId(selected.id);
    setSelectedId(draft.id);
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-text-strong">版本管理</h2>
            <SourceBadge source={source} />
          </div>
          <p className="mt-1 text-sm text-text-muted">查看资产快照、比较配置差异，并从稳定版本创建下一份草稿。</p>
        </div>
        <button
          type="button"
          className="button-primary"
          disabled={!demo}
          onClick={createDraft}
          title={demo ? "创建仅保存在当前演示会话的草稿" : "等待后端版本创建接口"}
        >
          <GitFork size={17} />从所选版本创建草稿
        </button>
      </div>

      {!demo && (
        <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <LockKey className="mt-0.5 shrink-0" size={19} />
          <div>
            <p className="font-semibold">历史版本和回滚 API 尚未接入</p>
            <p className="mt-1 leading-6 text-amber-800">当前仅展示后端返回的真实 Agent 当前版本；创建、发布和回滚保持不可写。</p>
          </div>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <ClockCounterClockwise size={19} className="text-primary" />
              <h3 className="font-semibold">版本时间线</h3>
            </div>
            <span className="text-xs text-text-muted">{versions.length} 个快照</span>
          </div>
          <div className="divide-y divide-border">
            {versions.map((version) => {
              const active = version.id === selected.id;
              const status = statusCopy[version.status];
              return (
                <button
                  key={version.id}
                  type="button"
                  onClick={() => setSelectedId(version.id)}
                  className={`w-full px-4 py-4 text-left transition ${active ? "bg-primary-soft" : "hover:bg-subtle"}`}
                  aria-pressed={active}
                >
                  <div className="flex items-center justify-between gap-3">
                    <strong className="text-base text-text-strong">{version.label}</strong>
                    <span className={`status-badge ${status.className}`}>{status.label}</span>
                  </div>
                  <p className="mt-2 text-sm leading-5 text-text-strong">{version.summary}</p>
                  <p className="mt-2 text-xs text-text-muted">{version.createdBy} · {version.createdAt}</p>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="space-y-5">
          <div className="panel p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">Selected snapshot</p>
                <h3 className="mt-2 text-2xl font-bold">{selected.label}</h3>
                <p className="mt-1 text-sm text-text-muted">{selected.summary}</p>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-subtle px-3 py-2 text-sm">
                <CheckCircle size={18} className="text-success" weight="fill" />
                {selected.snapshot.model}
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <SnapshotMetric label="Memory" value={selected.snapshot.memoryEnabled ? "开启" : "关闭"} />
              <SnapshotMetric label="知识库" value={selected.snapshot.knowledgeBaseId ? `#${selected.snapshot.knowledgeBaseId}` : "未绑定"} />
              <SnapshotMetric label="技能" value={`${selected.snapshot.skills.length} 项`} />
              <SnapshotMetric label="温度" value={String(selected.snapshot.temperature)} />
            </div>
          </div>

          <div className="panel overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <GitDiff size={19} className="text-primary" />
                <div>
                  <h3 className="font-semibold">版本差异</h3>
                  <p className="text-xs text-text-muted">{changedCount} 个字段发生变化</p>
                </div>
              </div>
              <label className="flex items-center gap-2 text-xs text-text-muted">
                对比基线
                <select
                  value={baseline.id}
                  onChange={(event) => setBaselineId(event.target.value)}
                  className="h-9 rounded-md border border-border bg-surface px-3 text-sm text-text-strong"
                >
                  {versions.filter((item) => item.id !== selected.id).map((version) => (
                    <option key={version.id} value={version.id}>{version.label}</option>
                  ))}
                  {versions.length === 1 && <option value={selected.id}>{selected.label}</option>}
                </select>
              </label>
            </div>

            <div className="divide-y divide-border">
              {differences.map((difference) => (
                <div key={difference.field} className={`grid gap-3 px-5 py-4 md:grid-cols-[120px_1fr_24px_1fr] ${difference.changed ? "bg-amber-50/40" : ""}`}>
                  <strong className="text-sm">{difference.label}</strong>
                  <p className="break-words text-sm leading-6 text-text-muted">{difference.before}</p>
                  <span className="hidden text-center text-text-muted md:block">→</span>
                  <p className={`break-words text-sm leading-6 ${difference.changed ? "font-medium text-text-strong" : "text-text-muted"}`}>{difference.after}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3">
            <p className="text-xs leading-5 text-text-muted">
              {demo ? "演示草稿只保存在当前页面状态，不会写入后端。" : "真实回滚需要后端版本历史与恢复接口。"}
            </p>
            <button type="button" className="button-secondary min-h-9 px-3" disabled title="等待后端回滚接口">
              <ArrowCounterClockwise size={16} />回滚到此版本
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function SnapshotMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-subtle/60 px-3 py-3">
      <p className="text-xs text-text-muted">{label}</p>
      <strong className="mt-1 block text-sm text-text-strong">{value}</strong>
    </div>
  );
}


