"use client";

import { Broom, PaperPlaneRight, Trash, User } from "@phosphor-icons/react";
import { AgentAvatar } from "@/modules/agents/agent-avatar";
import type { Agent } from "@/modules/agents/types";
import { RuntimeInputBar } from "@/modules/agent-runtime/runtime-input-bar";
import { RuntimeMessageContent } from "@/modules/agent-runtime/runtime-message-content";
import type { PendingRuntimeAttachment, RuntimeMessageOptions, RuntimeWidgetSpec } from "@/modules/agent-runtime/types";
import type { TestMessage, TestScenario } from "./types";

export function AdvancedConversationPanel({ agent, scenario, messages, widgets, sending, error, demo, memoryBusy, memoryNotice, onSend, onClear, onClearMemory }: {
  agent: Agent;
  scenario: TestScenario;
  messages: TestMessage[];
  widgets: RuntimeWidgetSpec[];
  sending: boolean;
  error: string;
  demo: boolean;
  memoryBusy: boolean;
  memoryNotice: string;
  onSend: (content: string, attachments?: PendingRuntimeAttachment[], metadata?: RuntimeMessageOptions["metadata"]) => Promise<boolean>;
  onClear: () => void;
  onClearMemory: () => void;
}) {
  return <section className="flex min-h-[680px] min-w-0 flex-col bg-surface xl:h-full xl:min-h-0 xl:overflow-hidden">
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4"><div><h2 className="font-semibold">对话模拟</h2><p className="mt-1 text-xs text-text-muted">{scenario.name} · {scenario.goal}</p></div><div className="flex gap-2"><button type="button" onClick={onClearMemory} disabled={memoryBusy || sending} className="button-secondary min-h-9 px-3"><Broom size={15} />{memoryBusy ? "清除中…" : "清测试记忆"}</button><button type="button" onClick={onClear} disabled={!messages.length || sending} className="button-secondary min-h-9 px-3"><Trash size={15} />清空对话</button></div></div>
    <div className="flex shrink-0 items-center gap-3 border-b border-border px-5 py-3"><AgentAvatar agent={agent} size={38} className="rounded-full" /><div className="min-w-0"><strong className="block truncate text-sm">{agent.name}</strong><span className="text-xs text-text-muted">测试用户 · {demo ? "演示回答" : "实时模拟"} · {widgets.length} 个输入 Widget</span></div></div>
    <div className="min-h-0 flex-1 space-y-5 overflow-y-auto bg-canvas/40 p-5" aria-live="polite">
      {!messages.length && <div className="mx-auto flex max-w-md flex-col items-center justify-center py-16 text-center"><div className="rounded-full bg-primary-soft p-3 text-primary"><PaperPlaneRight size={24} /></div><h3 className="mt-4 font-semibold">从场景起始语开始</h3><p className="mt-2 text-sm leading-6 text-text-muted">模拟不会创建正式会话，可附加图片、文档和 Widget 输入。</p><button type="button" onClick={() => void onSend(scenario.starter)} className="mt-5 rounded-lg border border-primary/30 bg-surface px-4 py-3 text-left text-sm leading-6 text-primary hover:bg-primary-soft">{scenario.starter}</button></div>}
      {messages.map((message) => <div key={message.id} className={`flex items-start gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>{message.role === "assistant" && <AgentAvatar agent={agent} size={34} className="rounded-full" />}<div className={`max-w-[78%] rounded-xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "bg-primary text-canvas" : "border border-border bg-surface text-text-strong"}`}><RuntimeMessageContent content={message.content} attachments={message.attachments} audioUrl={message.audio_url} docxUrl={message.docx_url} imageUrl={message.image_url} />{message.role === "assistant" && <span className="mt-2 block text-[11px] text-text-muted">{demo ? "演示数据" : message.model || "实时模拟"}{message.usage ? ` · ${message.usage.total_tokens} tokens` : ""}</span>}</div>{message.role === "user" && <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"><User size={18} weight="fill" /></span>}</div>)}
      {sending && <div className="flex items-center gap-3 text-sm text-text-muted"><AgentAvatar agent={agent} size={34} className="rounded-full" /><span className="rounded-xl border border-border bg-surface px-4 py-3">正在生成模拟回答…</span></div>}
    </div>
    {(error || memoryNotice) && <p className={`shrink-0 border-t px-5 py-2 text-sm ${error ? "border-danger/20 bg-red-50 text-danger dark:bg-red-400/10 dark:text-red-200" : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200"}`}>{error || memoryNotice}</p>}
    <div className="shrink-0"><RuntimeInputBar widgets={widgets} disabled={sending} placeholder="输入测试消息，或添加图片/文档" onSubmit={onSend} /></div>
  </section>;
}
