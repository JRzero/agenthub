"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDots } from "@phosphor-icons/react";
import { DATA_MODE } from "@/config/capabilities";
import { useAuth } from "@/modules/auth/auth-provider";
import { deleteMomentSchedule, generateMomentSchedule, getMomentSchedule, type MomentScheduleResult } from "./moments-api";

const DEMO_SCHEDULE: MomentScheduleResult = { config: { agent_id: 32, enabled: true, weekdays: [2, 4, 6], daily_times: ["10:30"], timezone: "Asia/Shanghai", week_start: "2026-07-06" }, schedules: [{ id: 1, scheduled_at: "2026-07-11T10:30:00+08:00", status: "pending" }], reasoning: "根据角色活跃时段安排每周三次发布。" };

export function MomentSchedulePanel({ agentId }: { agentId: number }) {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const demo = DATA_MODE === "demo";
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const query = useQuery({ queryKey: ["moment-schedule", agentId, demo], queryFn: () => demo ? Promise.resolve(DEMO_SCHEDULE) : getMomentSchedule(session?.apiKey || "", agentId), enabled: Boolean(session?.apiKey) });
  const generate = async () => {
    if (!session?.apiKey) return;
    setBusy(true); setMessage("");
    try { queryClient.setQueryData(["moment-schedule", agentId, demo], demo ? DEMO_SCHEDULE : await generateMomentSchedule(session.apiKey, agentId)); setMessage("自动排期已生成"); }
    catch (error) { setMessage(error instanceof Error ? error.message : "排期生成失败"); }
    finally { setBusy(false); }
  };
  const remove = async () => {
    if (!session?.apiKey || !window.confirm("确定关闭自动发朋友圈？")) return;
    setBusy(true); setMessage("");
    try { if (!demo) await deleteMomentSchedule(session.apiKey, agentId); queryClient.setQueryData(["moment-schedule", agentId, demo], { config: null, schedules: [] }); setMessage("自动排期已关闭"); }
    catch (error) { setMessage(error instanceof Error ? error.message : "关闭排期失败"); }
    finally { setBusy(false); }
  };
  const data = query.data;
  return <section className="rounded-xl border border-border p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-semibold">自动发朋友圈</h3><p className="mt-1 text-xs text-text-muted">由 AI 根据角色人设生成一周排期。</p></div><div className="flex gap-2"><button type="button" onClick={() => void generate()} disabled={busy} className="button-secondary"><CalendarDots size={17} />AI 一键排期</button>{data?.config && <button type="button" onClick={() => void remove()} disabled={busy} className="button-secondary text-danger">关闭自动排期</button>}</div></div>{data?.config ? <div className="mt-4 rounded-lg bg-subtle p-4"><p className="text-sm">每周 {data.config.weekdays.join("、")} · {data.config.daily_times.join("、")} · {data.config.timezone}</p>{data.reasoning && <p className="mt-2 text-xs text-text-muted">{data.reasoning}</p>}<div className="mt-3 flex flex-wrap gap-2">{data.schedules.map((item) => <span key={item.id} className="status-badge status-neutral">{new Date(item.scheduled_at).toLocaleString("zh-CN")} · {item.status}</span>)}</div></div> : <p className="mt-4 rounded-lg border border-dashed border-border p-5 text-sm text-text-muted">尚未启用自动排期。</p>}{message && <p className="mt-3 text-sm text-text-muted">{message}</p>}</section>;
}
