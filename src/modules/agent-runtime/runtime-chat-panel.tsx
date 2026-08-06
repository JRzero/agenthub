"use client";

import { useState } from "react";
import { ArrowClockwise, ChatCircleDots, Trash, User } from "@phosphor-icons/react";
import { AgentAvatar } from "@/modules/agents/agent-avatar";
import type { Agent } from "@/modules/agents/types";
import { RuntimeInputBar } from "./runtime-input-bar";
import { RuntimeMessageContent } from "./runtime-message-content";
import { useRuntimeChat } from "./use-runtime-chat";

export function RuntimeChatPanel({ agent }: { agent: Agent }) {
  const runtime = useRuntimeChat(agent.id);
  const [resumeId, setResumeId] = useState("");
  return <section className="flex min-h-[720px] flex-col bg-surface">
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4"><div className="flex items-center gap-3"><AgentAvatar agent={agent} size={40} className="rounded-full" /><div><h2 className="font-semibold">Runtime Chat · {agent.name}</h2><p className="mt-1 text-xs text-text-muted">{runtime.demo ? "本地演示，不写入" : runtime.sessionId ? `Persisted Session #${runtime.sessionId}` : "创建或恢复真实测试会话"}</p></div></div><div className="flex flex-wrap items-center gap-2"><input value={resumeId} onChange={(event) => setResumeId(event.target.value.replace(/\D/g, ""))} inputMode="numeric" placeholder="Session ID" className="h-9 w-28 rounded-md border border-border px-2 text-sm" /><button type="button" onClick={() => void runtime.resumeSession(Number(resumeId))} disabled={!resumeId || runtime.loading || runtime.sending} className="button-secondary min-h-9 px-3"><ArrowClockwise size={15} />恢复</button><button type="button" onClick={() => void runtime.startSession()} disabled={runtime.loading || runtime.sending} className="button-primary min-h-9 px-3"><ChatCircleDots size={15} />新会话</button><button type="button" onClick={runtime.clearLocal} disabled={!runtime.messages.length || runtime.sending} className="button-secondary min-h-9 px-3"><Trash size={15} />清屏</button></div></header>
    {(runtime.notice || runtime.edgeStatus) && <div className="border-b border-primary/20 bg-primary-soft px-5 py-2 text-xs text-primary">{runtime.edgeStatus || runtime.notice}</div>}
    {runtime.error && <div className="border-b border-danger/20 bg-red-50 px-5 py-2 text-sm text-danger dark:bg-red-400/10 dark:text-red-200">{runtime.error}</div>}
    <div className="flex-1 space-y-5 overflow-y-auto bg-canvas/40 p-5" aria-live="polite">
      {!runtime.messages.length && <div className="mx-auto flex max-w-md flex-col items-center justify-center py-20 text-center"><ChatCircleDots size={40} className="text-primary" /><h3 className="mt-4 font-semibold">运行真实会话链路</h3><p className="mt-2 text-sm leading-6 text-text-muted">首次发送会自动创建 Session；也可输入已有 Session ID 恢复历史。</p></div>}
      {runtime.messages.map((message) => { const docxUrl = typeof message.metadata?.docx_url === "string" ? message.metadata.docx_url : undefined; const imageUrl = typeof message.metadata?.image_url === "string" ? message.metadata.image_url : undefined; return <div key={String(message.id)} className={`flex items-start gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>{message.role === "assistant" && <AgentAvatar agent={agent} size={34} className="rounded-full" />}<div className={`max-w-[78%] rounded-xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "bg-primary text-canvas" : "border border-border bg-surface"}`}><RuntimeMessageContent content={message.content || (runtime.sending ? "正在生成…" : "")} attachments={message.attachments} audioUrl={message.audio_url} docxUrl={docxUrl} imageUrl={imageUrl} />{message.usage && <span className="mt-2 block text-[11px] text-text-muted">{message.usage.total_tokens} tokens</span>}</div>{message.role === "user" && <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"><User size={18} weight="fill" /></span>}</div>; })}
    </div>
    <RuntimeInputBar widgets={runtime.widgets} disabled={runtime.sending || runtime.loading} placeholder="发送真实 Runtime 消息，支持图片、文档和 Widget" onSubmit={runtime.send} />
  </section>;
}
