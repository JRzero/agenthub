"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Select } from "@/shared/ui/select";
import { worldApi, type WorldApiContext } from "./api";
import { buildLiveEventRequest, DEFAULT_LIVE_EVENT_DRAFT, findReconciledLiveEvent, LIVE_EVENT_EFFECT_LABELS, LIVE_EVENT_STATUS_LABELS, liveEventDraftErrors, liveEventEligibility, liveEventErrorMessage } from "./live-events";
import { createOperationKey, worldQueryKeys } from "./state";
import type { WorldLiveEvent, WorldLiveEventCreateRequest, WorldLiveEventDraft, WorldLiveEventMaxEffect, WorldLocation, WorldProjectionResident, WorldRuntimeFence, WorldStatus } from "./types";

interface LiveEventWorkspaceProps {
  ctx: WorldApiContext;
  worldCode: string;
  worldStatus: WorldStatus;
  role: string;
  runtimeHealth?: string;
  fence?: WorldRuntimeFence;
  locations: WorldLocation[];
  residents: WorldProjectionResident[];
}

export function LiveEventWorkspace({ ctx, worldCode, worldStatus, role, runtimeHealth, fence, locations, residents }: LiveEventWorkspaceProps) {
  const client = useQueryClient();
  const operationKey = useMemo(() => createOperationKey("world-live-event"), []);
  const authorizedRole = ["owner", "world_owner", "operator"].includes(role);
  const listKey = worldQueryKeys.liveEvents(ctx.workspaceCode, worldCode);
  const events = useQuery({ queryKey: listKey, queryFn: () => worldApi.liveEvents(ctx, worldCode), enabled: Boolean(ctx.apiKey && authorizedRole && !["draft", "published"].includes(worldStatus)) });
  const [draft, setDraft] = useState<WorldLiveEventDraft>({ ...DEFAULT_LIVE_EVENT_DRAFT });
  const [preview, setPreview] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [unknown, setUnknown] = useState<{ request: WorldLiveEventCreateRequest; submittedAt: number }>();
  const previewTriggerRef = useRef<HTMLButtonElement>(null);
  const previewConfirmRef = useRef<HTMLButtonElement>(null);
  const eligibility = liveEventEligibility({ worldStatus, role, runtimeHealth, fence });
  const errors = liveEventDraftErrors(draft, locations.map((location) => location.code), residents);
  const selectedResidents = draft.participant_codes.map((code) => residents.find((resident) => resident.participant_code === code)).filter((resident): resident is WorldProjectionResident => Boolean(resident));
  useEffect(() => { if (preview) previewConfirmRef.current?.focus(); }, [preview]);

  function upsertEvent(event: WorldLiveEvent) {
    client.setQueryData<{ items: WorldLiveEvent[] }>(listKey, (current) => ({ items: [event, ...(current?.items || []).filter((item) => item.event_code !== event.event_code)] }));
    client.setQueryData(worldQueryKeys.liveEvent(ctx.workspaceCode, worldCode, event.event_code), event);
  }

  async function reconcileUnknown(current = unknown) {
    if (!current || busy) return;
    setBusy(true);
    setMessage("正在通过 GET 对账，不会再次提交现场事件…");
    try {
      const page = await worldApi.liveEvents(ctx, worldCode);
      client.setQueryData(listKey, page);
      const matched = findReconciledLiveEvent(page.items, current.request, current.submittedAt);
      if (matched) {
        upsertEvent(matched);
        operationKey.reset();
        setUnknown(undefined);
        setMessage(`已通过 GET 对账：${matched.event_code} · ${LIVE_EVENT_STATUS_LABELS[matched.status]}。`);
      } else {
        setMessage("GET 尚未找到唯一匹配结果；幂等键和表单已保留，POST 仍禁用。请稍后继续 GET 对账。");
      }
    } catch {
      setMessage("GET 对账暂时失败；幂等键和表单已保留，POST 仍禁用。请稍后继续对账。");
    } finally {
      setBusy(false);
    }
  }

  function openPreview() {
    setAttempted(true);
    setMessage("");
    if (!eligibility.allowed || errors.length) return;
    setPreview(true);
  }

  function closePreview() {
    setPreview(false);
    window.setTimeout(() => previewTriggerRef.current?.focus(), 0);
  }

  async function confirmSubmit() {
    if (!fence || !eligibility.allowed || errors.length || unknown || busy) return;
    const request = buildLiveEventRequest(draft, fence, operationKey.current());
    const submittedAt = Date.now();
    closePreview();
    setBusy(true);
    setMessage("正在提交一次现场事件候选；不会自动触发 Tick…");
    try {
      const event = await worldApi.createLiveEvent(ctx, worldCode, request);
      upsertEvent(event);
      operationKey.reset();
      setDraft({ ...DEFAULT_LIVE_EVENT_DRAFT });
      setAttempted(false);
      setMessage(`现场事件已进入候选链：${LIVE_EVENT_STATUS_LABELS[event.status]}。这不保证居民响应。`);
    } catch (error) {
      const mapped = liveEventErrorMessage(error, draft);
      setMessage(mapped.message);
      if (mapped.unknown) {
        const nextUnknown = { request, submittedAt };
        setUnknown(nextUnknown);
        setBusy(false);
        await reconcileUnknown(nextUnknown);
        return;
      }
      operationKey.reset();
      await Promise.all([events.refetch(), client.invalidateQueries({ queryKey: worldQueryKeys.projection(ctx.workspaceCode, worldCode) })]);
    } finally {
      setBusy(false);
    }
  }

  async function reconcileEvent(eventCode: string) {
    if (busy) return;
    setBusy(true);
    setMessage("正在读取单项候选真源…");
    try {
      const event = await worldApi.liveEvent(ctx, worldCode, eventCode);
      upsertEvent(event);
      setMessage(`${event.event_code} 已对账：${LIVE_EVENT_STATUS_LABELS[event.status]}。`);
    } catch (error) {
      setMessage(liveEventErrorMessage(error).message);
    } finally {
      setBusy(false);
    }
  }

  function toggleParticipant(code: string) {
    setDraft((current) => ({ ...current, participant_codes: current.participant_codes.includes(code) ? current.participant_codes.filter((item) => item !== code) : current.participant_codes.length < 4 ? [...current.participant_codes, code] : current.participant_codes }));
  }

  return <section className="panel min-w-0 p-5 lg:col-span-2" aria-busy={busy || undefined}>
    <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-semibold">投放现场事件</h2><p className="mt-1 text-sm text-text-muted">一次性事件只进入候选链，不保证居民响应，不自动触发 Tick，也不会由前端写入时间线。</p></div><span className={`rounded-full px-3 py-1 text-xs ${eligibility.allowed ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}`}>{eligibility.allowed ? "可投放" : "当前禁用"}</span></div>
    <p role="status" className={`mt-3 rounded-lg p-3 text-sm ${eligibility.allowed ? "bg-subtle text-text-muted" : "bg-amber-50 text-amber-900"}`}>{eligibility.reason}</p>
    {events.isError && <p role="alert" className="mt-3 text-sm text-danger">现场事件列表读取失败。表单不会伪造历史；请手动刷新。</p>}
    {authorizedRole && <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
      <div className="min-w-0">
        <label className="block text-sm font-medium">标题<input maxLength={120} value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} className="control-field mt-2 w-full" /></label>
        <label className="mt-4 block text-sm font-medium">地点<Select ariaLabel="现场事件地点" value={draft.location_code} onValueChange={(value) => setDraft((current) => ({ ...current, location_code: value }))} options={[{ value: "", label: "请选择当前地点" }, ...locations.map((location) => ({ value: location.code, label: location.name || location.code }))]} className="mt-2 w-full" /></label>
        <label className="mt-4 block text-sm font-medium">公开可观察开端<textarea maxLength={1000} value={draft.observable_start} onChange={(event) => setDraft((current) => ({ ...current, observable_start: event.target.value }))} className="area mt-2" /></label>
        <fieldset className="mt-4"><legend className="text-sm font-medium">当前活跃参与者（0–4 位）</legend><div className="mt-2 grid gap-2 sm:grid-cols-2">{residents.map((resident) => { const checked = draft.participant_codes.includes(resident.participant_code); return <label key={resident.participant_code} className="flex min-h-11 min-w-0 items-center gap-3 rounded-lg border border-border px-3 py-2"><input type="checkbox" checked={checked} disabled={!checked && draft.participant_codes.length >= 4} onChange={() => toggleParticipant(resident.participant_code)} /><span className="min-w-0 break-words">{resident.public_identity}</span></label>; })}{residents.length === 0 && <p className="text-sm text-text-muted">当前没有可选的活跃居民；允许提交 0 位参与者的环境事件。</p>}</div></fieldset>
        <div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium">最大影响<Select ariaLabel="最大影响" value={draft.max_effect} onValueChange={(value) => setDraft((current) => ({ ...current, max_effect: value as WorldLiveEventMaxEffect }))} options={(Object.keys(LIVE_EVENT_EFFECT_LABELS) as WorldLiveEventMaxEffect[]).map((value) => ({ value, label: LIVE_EVENT_EFFECT_LABELS[value] }))} className="mt-2 w-full" /></label><label className="block text-sm font-medium">有效期（秒）<input type="number" min={60} max={86400} step={60} value={draft.ttl_seconds} onChange={(event) => setDraft((current) => ({ ...current, ttl_seconds: Number(event.target.value) }))} className="control-field mt-2 w-full" /></label></div>
        {attempted && errors.length > 0 && <ul role="alert" className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-danger">{errors.map((error) => <li key={error}>{error}</li>)}</ul>}
        <div className="mt-5 flex flex-wrap gap-3"><button ref={previewTriggerRef} type="button" className="button-primary min-h-11" disabled={!eligibility.allowed || busy || Boolean(unknown)} onClick={openPreview}>预览影响</button>{unknown && <button type="button" className="button-secondary min-h-11" disabled={busy} onClick={() => void reconcileUnknown()}>继续 GET 对账</button>}</div>
        {message && <p role={unknown ? "alert" : "status"} className="mt-4 rounded-lg bg-subtle p-3 text-sm">{message}</p>}
      </div>
      <div className="min-w-0"><h3 className="font-semibold">现场事件状态</h3>{events.isLoading && <p role="status" className="mt-3 text-sm">正在读取候选真源…</p>}<div className="mt-3 space-y-3">{events.data?.items.map((event) => <article key={event.event_code} className="min-w-0 rounded-lg border border-border p-4"><div className="flex flex-wrap items-start justify-between gap-2"><strong className="break-words">{event.title}</strong><span className="rounded-full bg-subtle px-2 py-1 text-xs">{LIVE_EVENT_STATUS_LABELS[event.status]}</span></div><p className="mt-2 text-sm">{event.observable_start}</p><p className="mt-2 text-xs text-text-muted">{event.location_code} · {LIVE_EVENT_EFFECT_LABELS[event.max_effect]} · TTL {event.ttl_seconds}s</p><p className="mt-1 break-all font-mono text-xs text-text-muted">{event.event_code}</p><button type="button" className="button-secondary mt-3 min-h-11" disabled={busy} onClick={() => void reconcileEvent(event.event_code)}>GET 对账状态</button></article>)}{!events.isLoading && !events.data?.items.length && <p className="text-sm text-text-muted">还没有现场事件候选。</p>}</div></div>
    </div>}
    {preview && <div role="dialog" aria-modal="true" aria-labelledby="live-event-preview-title" className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"><div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-surface p-6 shadow-xl"><h3 id="live-event-preview-title" className="text-lg font-semibold">确认现场事件影响</h3><p className="mt-2 text-sm text-warning">确认后只创建一次候选，不保证居民响应，不自动触发 Tick。</p><dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><div><dt className="text-text-muted">标题</dt><dd>{draft.title.trim()}</dd></div><div><dt className="text-text-muted">地点</dt><dd>{locations.find((location) => location.code === draft.location_code)?.name || draft.location_code}</dd></div><div className="sm:col-span-2"><dt className="text-text-muted">可观察开端</dt><dd>{draft.observable_start.trim()}</dd></div><div><dt className="text-text-muted">参与者</dt><dd>{selectedResidents.length ? selectedResidents.map((resident) => resident.public_identity).join("、") : "无指定居民"}</dd></div><div><dt className="text-text-muted">最大影响 / TTL</dt><dd>{LIVE_EVENT_EFFECT_LABELS[draft.max_effect]} / {draft.ttl_seconds} 秒</dd></div></dl><div className="mt-6 flex flex-wrap justify-end gap-3"><button type="button" className="button-secondary min-h-11" onClick={closePreview}>返回修改</button><button ref={previewConfirmRef} type="button" className="button-primary min-h-11" disabled={busy} onClick={() => void confirmSubmit()}>确认投放一次</button></div></div></div>}
  </section>;
}
