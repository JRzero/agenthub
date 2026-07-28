"use client";

import { useMemo, useState } from "react";
import { FileArrowUp, ImageSquare, PaperPlaneRight, X } from "@phosphor-icons/react";
import { Select } from "@/shared/ui/select";
import type { PendingRuntimeAttachment, RuntimeMessageOptions, RuntimeWidgetSpec } from "./types";

export function RuntimeInputBar({ widgets, disabled, placeholder = "输入消息，按 Shift + Enter 换行", onSubmit }: {
  widgets: RuntimeWidgetSpec[];
  disabled: boolean;
  placeholder?: string;
  onSubmit: (content: string, attachments: PendingRuntimeAttachment[], metadata: RuntimeMessageOptions["metadata"]) => Promise<boolean>;
}) {
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<PendingRuntimeAttachment[]>([]);
  const [metadata, setMetadata] = useState<Record<string, unknown>>({});
  const [error, setError] = useState("");
  const metadataWidgets = useMemo(() => widgets.filter((widget) => !["file_upload", "image_upload", "document_upload"].includes(widget.type)), [widgets]);

  function addFile(file: File, type: "image" | "file", widget?: RuntimeWidgetSpec) {
    if (file.size > 20 * 1024 * 1024) { setError("附件不能超过 20MB"); return; }
    if (type === "image" && !file.type.startsWith("image/")) { setError("请选择图片文件"); return; }
    setError("");
    setAttachments((current) => [...current, { type, file, name: file.name, size: file.size, mime_type: file.type || undefined, widget_id: widget?.id, skill_id: widget?.skill_id }]);
  }

  async function submit() {
    if (disabled || (!input.trim() && !attachments.length)) return;
    const content = input.trim() || "请分析以上附件";
    setInput("");
    const sent = await onSubmit(content, attachments, Object.keys(metadata).length ? { custom_fields: metadata } : undefined);
    if (sent) { setAttachments([]); setMetadata({}); } else setInput(content);
  }

  const imageWidget = widgets.find((widget) => widget.type === "image_upload");
  const documentWidget = widgets.find((widget) => widget.type === "document_upload" || widget.type === "file_upload");
  return <form className="border-t border-border p-4" onSubmit={(event) => { event.preventDefault(); void submit(); }}>
    {!!metadataWidgets.length && <div className="mb-3 grid gap-3 sm:grid-cols-2">{metadataWidgets.map((widget) => <RuntimeWidgetField key={widget.id} widget={widget} value={metadata[widget.id]} onChange={(value) => setMetadata((current) => ({ ...current, [widget.id]: value }))} disabled={disabled} />)}</div>}
    {!!attachments.length && <div className="mb-3 flex flex-wrap gap-2">{attachments.map((attachment, index) => <span key={`${attachment.name}-${index}`} className="inline-flex items-center gap-2 rounded-md border border-border bg-subtle px-2.5 py-1.5 text-xs"><span className="max-w-40 truncate">{attachment.name}</span><button type="button" onClick={() => setAttachments((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label={`移除 ${attachment.name}`}><X size={13} /></button></span>)}</div>}
    {error && <p className="mb-2 text-xs text-danger">{error}</p>}
    <textarea aria-label="运行时消息" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void submit(); } }} placeholder={placeholder} rows={3} disabled={disabled} className="w-full resize-none rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-text-muted"><label className="button-secondary min-h-9 cursor-pointer px-3"><ImageSquare size={16} />图片<input type="file" accept="image/*" disabled={disabled} className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) addFile(file, "image", imageWidget); event.currentTarget.value = ""; }} /></label><label className="button-secondary min-h-9 cursor-pointer px-3"><FileArrowUp size={16} />文档<input type="file" accept=".pdf,.doc,.docx,.txt" disabled={disabled} className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) addFile(file, "file", documentWidget); event.currentTarget.value = ""; }} /></label><span className="ml-auto">{input.length} / 2000</span><button type="submit" disabled={disabled || (!input.trim() && !attachments.length)} className="button-primary min-h-9 px-4"><PaperPlaneRight size={16} />{disabled ? "发送中…" : "发送"}</button></div>
  </form>;
}

function RuntimeWidgetField({ widget, value, onChange, disabled }: { widget: RuntimeWidgetSpec; value: unknown; onChange: (value: unknown) => void; disabled: boolean }) {
  const options = Array.isArray(widget.config.options) ? widget.config.options : [];
  const placeholder = typeof widget.config.placeholder === "string" ? widget.config.placeholder : "";
  if (widget.type === "select") return <div className="text-xs font-medium">{widget.label}<Select ariaLabel={widget.label} value={String(value ?? widget.config.default ?? "")} onValueChange={onChange} disabled={disabled} className="mt-1 w-full" options={[{ value: "", label: "请选择" }, ...options.map((option) => { const item = typeof option === "string" ? { value: option, label: option } : option as { value?: unknown; label?: unknown }; return { value: String(item.value), label: String(item.label ?? item.value) }; })]} /></div>;
  if (widget.type === "checkbox" || widget.type === "switch") return <label className="flex items-center gap-2 self-end rounded-md border border-border px-3 py-2 text-xs font-medium"><input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} disabled={disabled} />{widget.label}</label>;
  if (widget.type === "custom") return <div className="rounded-md border border-dashed border-border px-3 py-2 text-xs text-text-muted">{widget.label}：暂不支持的自定义 widget</div>;
  if (widget.type === "textarea") return <label className="text-xs font-medium sm:col-span-2">{widget.label}<textarea value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} disabled={disabled} placeholder={placeholder} rows={2} className="mt-1 w-full rounded-md border border-border px-2 py-1.5 text-sm" /></label>;
  return <label className="text-xs font-medium">{widget.label}<input type={widget.type === "number" ? "number" : widget.type === "date_picker" ? "date" : "text"} value={String(value ?? "")} onChange={(event) => onChange(widget.type === "number" ? Number(event.target.value) : event.target.value)} disabled={disabled} placeholder={placeholder} className="mt-1 h-9 w-full rounded-md border border-border px-2 text-sm" /></label>;
}
