"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowClockwise,
  CalendarDots,
  CheckCircle,
  SpinnerGap,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import { DATA_MODE } from "@/config/capabilities";
import type { Agent } from "@/modules/agents/types";
import { Select } from "@/shared/ui/select";
import {
  deleteMomentSchedule,
  generateMomentSchedule,
  getMomentSchedule,
} from "./api";
import type { MomentAuth, MomentScheduleResult } from "./types";

const WEEKDAY_LABELS: Record<number, string> = {
  1: "周一",
  2: "周二",
  3: "周三",
  4: "周四",
  5: "周五",
  6: "周六",
  7: "周日",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "待发布",
  published: "已发布",
  failed: "发布失败",
  cancelled: "已取消",
};

export function getDefaultAutoPublishAgentId(
  agents: Pick<Agent, "id" | "current_version_id">[],
  initialAgentId: number | null,
) {
  const initial = agents.find(
    (agent) => agent.id === initialAgentId && agent.current_version_id,
  );
  return (
    initial?.id ??
    agents.find((agent) => agent.current_version_id)?.id ??
    null
  );
}

function demoSchedule(agentId: number): MomentScheduleResult {
  return {
    config: {
      agent_id: agentId,
      enabled: true,
      weekdays: [2, 4, 6],
      daily_times: ["10:30"],
      timezone: "Asia/Shanghai",
      week_start: "2026-07-27",
    },
    schedules: [
      {
        id: 1,
        scheduled_at: "2026-07-28T10:30:00+08:00",
        status: "pending",
      },
      {
        id: 2,
        scheduled_at: "2026-07-30T10:30:00+08:00",
        status: "pending",
      },
      {
        id: 3,
        scheduled_at: "2026-08-01T10:30:00+08:00",
        status: "pending",
      },
    ],
    reasoning: "根据角色人设和活跃时段安排每周三次发布。",
  };
}

function formatScheduleTime(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function AutoPublishDialog({
  open,
  agents,
  initialAgentId,
  auth,
  onClose,
}: {
  open: boolean;
  agents: Agent[];
  initialAgentId: number | null;
  auth: MomentAuth;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const availableAgents = useMemo(
    () => agents.filter((agent) => agent.current_version_id),
    [agents],
  );
  const [agentId, setAgentId] = useState<number | null>(() =>
    getDefaultAutoPublishAgentId(agents, initialAgentId),
  );
  const [busy, setBusy] = useState<"generate" | "delete" | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setAgentId(getDefaultAutoPublishAgentId(agents, initialAgentId));
    setMessage("");
    setError("");
  }, [agents, initialAgentId, open]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [busy, onClose, open]);

  const queryKey = [
    "oyiioyii-moment-schedule",
    agentId,
    auth.workspaceCode,
    DATA_MODE,
  ];
  const scheduleQuery = useQuery({
    queryKey,
    queryFn: () =>
      DATA_MODE === "demo"
        ? Promise.resolve(demoSchedule(agentId || 0))
        : getMomentSchedule(auth, agentId || 0),
    enabled: Boolean(open && agentId && auth.apiKey),
  });
  const schedule = scheduleQuery.data;
  const enabled = Boolean(schedule?.config?.enabled);

  async function generate() {
    if (!agentId) return;
    setBusy("generate");
    setMessage("");
    setError("");
    try {
      const result =
        DATA_MODE === "demo"
          ? demoSchedule(agentId)
          : await generateMomentSchedule(auth, agentId);
      queryClient.setQueryData(queryKey, result);
      setMessage(enabled ? "自动排期已重新生成" : "自动发布已开启并生成排期");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "自动排期生成失败");
    } finally {
      setBusy(null);
    }
  }

  async function disable() {
    if (
      !agentId ||
      !window.confirm("确定关闭这个 Agent 的自动发朋友圈？已发布动态不会受影响。")
    ) {
      return;
    }
    setBusy("delete");
    setMessage("");
    setError("");
    try {
      if (DATA_MODE !== "demo") {
        await deleteMomentSchedule(auth, agentId);
      }
      queryClient.setQueryData<MomentScheduleResult>(queryKey, {
        config: null,
        schedules: [],
      });
      setMessage("自动发布已关闭");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "关闭自动发布失败");
    } finally {
      setBusy(null);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="auto-publish-title"
        className="flex max-h-[calc(100dvh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-2xl"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div>
            <h2 id="auto-publish-title" className="text-lg font-semibold">
              自动发布设置
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              AI 根据 Agent 人设生成未来一周的朋友圈排期
            </p>
          </div>
          <button
            type="button"
            aria-label="关闭自动发布设置"
            className="rounded-md p-2 text-text-muted transition hover:bg-subtle hover:text-text-strong"
            onClick={onClose}
            disabled={Boolean(busy)}
          >
            <X size={18} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div>
            <span className="text-sm font-medium">发布 Agent</span>
            <Select
              ariaLabel="自动发布 Agent"
              value={String(agentId || "")}
              onValueChange={(value) => {
                setAgentId(Number(value));
                setMessage("");
                setError("");
              }}
              className="mt-2 w-full"
              options={availableAgents.map((agent) => ({
                value: String(agent.id),
                label: `${agent.name} · 平台当前版本 v${agent.version}`,
              }))}
            />
          </div>

          {!availableAgents.length ? (
            <div className="mt-5 rounded-xl border border-dashed border-border p-8 text-center">
              <WarningCircle
                size={30}
                className="mx-auto text-text-muted"
              />
              <h3 className="mt-3 font-semibold">暂无可用于自动发布的 Agent</h3>
              <p className="mt-1 text-sm text-text-muted">
                请先为 Agent 发布一个平台当前版本。
              </p>
            </div>
          ) : scheduleQuery.isLoading ? (
            <div className="grid min-h-64 place-items-center">
              <div className="text-center text-sm text-text-muted">
                <SpinnerGap
                  size={28}
                  className="loading-spin mx-auto text-primary"
                />
                <p className="mt-3">正在读取自动发布设置…</p>
              </div>
            </div>
          ) : scheduleQuery.isError ? (
            <div className="mt-5 rounded-xl border border-danger/20 bg-danger/5 p-6 text-center">
              <WarningCircle size={28} className="mx-auto text-danger" />
              <h3 className="mt-3 font-semibold">自动发布设置加载失败</h3>
              <p className="mt-1 text-sm text-text-muted">
                {scheduleQuery.error instanceof Error
                  ? scheduleQuery.error.message
                  : "请稍后重试"}
              </p>
              <button
                type="button"
                className="button-secondary mt-4"
                onClick={() => void scheduleQuery.refetch()}
              >
                <ArrowClockwise size={17} />
                重新加载
              </button>
            </div>
          ) : (
            <>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-canvas px-4 py-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`grid size-9 place-items-center rounded-full ${
                      enabled
                        ? "bg-success/10 text-success"
                        : "bg-subtle text-text-muted"
                    }`}
                  >
                    {enabled ? (
                      <CheckCircle size={20} weight="fill" />
                    ) : (
                      <CalendarDots size={20} />
                    )}
                  </span>
                  <div>
                    <p className="font-medium">
                      {enabled ? "自动发布已开启" : "自动发布未开启"}
                    </p>
                    <p className="mt-0.5 text-xs text-text-muted">
                      {enabled
                        ? "后端将按以下排期自动创建朋友圈"
                        : "生成排期后才会启用自动发布"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="button-primary"
                  disabled={Boolean(busy)}
                  onClick={() => void generate()}
                >
                  {busy === "generate" ? (
                    <SpinnerGap size={17} className="loading-spin" />
                  ) : (
                    <CalendarDots size={17} />
                  )}
                  {enabled ? "重新生成排期" : "AI 一键排期"}
                </button>
              </div>

              {schedule?.config && (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border p-4">
                    <p className="text-xs font-medium text-text-muted">
                      发布频率
                    </p>
                    <p className="mt-2 font-medium">
                      {schedule.config.weekdays
                        .map((day) => WEEKDAY_LABELS[day] || `第 ${day} 天`)
                        .join("、") || "由后端排期"}
                    </p>
                    <p className="mt-1 text-sm text-text-muted">
                      {schedule.config.daily_times.join("、") || "时间待生成"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border p-4">
                    <p className="text-xs font-medium text-text-muted">
                      时区与周期
                    </p>
                    <p className="mt-2 font-medium">
                      {schedule.config.timezone}
                    </p>
                    <p className="mt-1 text-sm text-text-muted">
                      周期开始于 {schedule.config.week_start}
                    </p>
                  </div>
                </div>
              )}

              {schedule?.reasoning && (
                <p className="mt-4 rounded-lg bg-primary-soft px-4 py-3 text-sm leading-6 text-text-muted">
                  {schedule.reasoning}
                </p>
              )}

              {enabled && (
                <section className="mt-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">待执行排期</h3>
                    <span className="text-xs text-text-muted">
                      共 {schedule?.schedules.length || 0} 条
                    </span>
                  </div>
                  {schedule?.schedules.length ? (
                    <div className="mt-3 divide-y divide-border overflow-hidden rounded-xl border border-border">
                      {schedule.schedules.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
                        >
                          <span>{formatScheduleTime(item.scheduled_at)}</span>
                          <span
                            className={`status-badge ${
                              item.status === "failed"
                                ? "status-danger"
                                : item.status === "published"
                                  ? "status-success"
                                  : "status-neutral"
                            }`}
                          >
                            {STATUS_LABELS[item.status] || item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 rounded-xl border border-dashed border-border p-6 text-center text-sm text-text-muted">
                      当前周期还没有待执行记录，可重新生成排期。
                    </p>
                  )}
                </section>
              )}
            </>
          )}

          {error && (
            <p className="mt-4 flex items-start gap-2 rounded-lg border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
              <WarningCircle size={18} className="mt-0.5 shrink-0" />
              {error}
            </p>
          )}
          {message && (
            <p className="mt-4 flex items-center gap-2 rounded-lg border border-success/20 bg-success/5 px-4 py-3 text-sm text-success">
              <CheckCircle size={18} weight="fill" />
              {message}
            </p>
          )}
        </div>

        <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4">
          <p className="text-xs text-text-muted">
            关闭自动发布不会删除已经发布的朋友圈。
          </p>
          <div className="flex gap-2">
            {enabled && (
              <button
                type="button"
                className="button-secondary text-danger"
                disabled={Boolean(busy)}
                onClick={() => void disable()}
              >
                {busy === "delete" && (
                  <SpinnerGap size={17} className="loading-spin" />
                )}
                关闭自动发布
              </button>
            )}
            <button
              type="button"
              className="button-secondary"
              onClick={onClose}
              disabled={Boolean(busy)}
            >
              完成
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}
