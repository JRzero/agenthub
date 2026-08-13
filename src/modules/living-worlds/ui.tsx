"use client";

import Link from "next/link";
import { WarningCircle } from "@phosphor-icons/react";
import { classifyWorldError, WORLD_READINESS } from "./state";
import type { WorldStatus } from "./types";

const STATUS: Record<WorldStatus, string> = { draft: "草稿", published: "已发布 · 待开演", running: "运行中", paused: "已暂停", blocked: "运行受阻", takedown: "已下架", archived: "已归档" };
export function WorldStatusBadge({ status }: { status: WorldStatus }) { return <span className={`status-badge status-${status === "running" ? "success" : status === "paused" ? "warning" : "neutral"}`}>{STATUS[status]}</span>; }
export function WorldErrorNotice({ error, onRetry, conflictCopy }: { error: unknown; onRetry?: () => void; conflictCopy?: () => void }) {
  const state = classifyWorldError(error);
  return <div role={state.kind === "conflict" || state.kind === "not-found" ? "alert" : "status"} className="w-full min-w-0 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm dark:border-rose-400/20 dark:bg-rose-400/10"><div className="flex min-w-0 gap-2"><WarningCircle className="mt-0.5 shrink-0 text-danger" size={18} /><div className="min-w-0 flex-1"><strong>{state.kind === "not-found" ? "无法访问" : "操作未完成"}</strong><p className="mt-1 break-words text-text-muted">{state.message}</p>{state.missing.length > 0 && <ul className="mt-2 list-disc pl-5">{state.missing.map((item) => <li className="break-words" key={item}>{item}</li>)}</ul>}<div className="mt-3 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">{onRetry && <button type="button" className="button-secondary min-h-11 w-full sm:w-auto" onClick={onRetry}>刷新真源</button>}{state.kind === "conflict" && conflictCopy && <button type="button" className="button-secondary min-h-11 w-full sm:w-auto" onClick={conflictCopy}>复制我的修改</button>}</div></div></div></div>;
}
export function PendingBackendPanel({ slice, title }: { slice: "bootstrap" | "actions" | "projection" | "governance"; title: string }) {
  const readiness = WORLD_READINESS[slice];
  return <section className="rounded-xl border border-dashed border-border bg-subtle p-5"><div className="flex items-center justify-between gap-3"><h3 className="font-semibold">{title}</h3><span className="status-badge status-warning">等待服务接入</span></div><p className="mt-2 text-sm leading-6 text-text-muted">这是 Living World P0 固定能力，当前 live 模式不使用 mock。阻塞：{readiness.blockers.join("、")}。</p></section>;
}
export function WorldPageHeader({ title, description, back }: { title: string; description: string; back?: string }) { return <header className="mb-6 flex w-full min-w-0 flex-wrap items-start justify-between gap-4"><div className="w-full min-w-0">{back && <Link href={back} className="mb-2 inline-flex min-h-11 items-center text-sm text-primary">← 返回</Link>}<h1 className="break-words text-2xl font-semibold text-text-strong">{title}</h1><p className="mt-2 max-w-3xl break-words text-sm text-text-muted">{description}</p></div></header>; }
