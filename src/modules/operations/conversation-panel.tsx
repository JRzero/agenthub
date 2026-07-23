"use client";

import { CheckCircle, PaperPlaneRight, ShieldCheck } from "@phosphor-icons/react";
import { useState } from "react";
import { RuntimeMessageContent } from "@/modules/agent-runtime/runtime-message-content";
import { humanLabel, sessionLabel } from "./model";
import type { SessionMessage, SharedSessionRow } from "./types";

export function ConversationPanel({ row, messages, loading, sending, onVerify, onComment }: { row: SharedSessionRow | null; messages: SessionMessage[]; loading: boolean; sending: boolean; onVerify: () => void; onComment: (content: string) => void }) {
  const [comment, setComment] = useState("");
  if (!row) return <section className="flex min-h-[520px] items-center justify-center text-sm text-text-muted">选择会话查看对话详情</section>;
  const visible = messages.filter((message) => !["system", "tool"].includes(message.role));
  return (
    <section className="flex min-h-0 flex-col bg-surface">
      <header className="border-b border-border px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-semibold">{sessionLabel(row)}{row.session.is_group && <span className="ml-2 rounded bg-primary-soft px-1.5 py-0.5 text-[11px] text-primary">群聊</span>}</h2>
            <p className="mt-1 text-xs text-text-muted">会话 #{row.session.id} · {humanLabel(row)} · {row.agent.name}</p>
          </div>
          <button type="button" onClick={onVerify} className={`min-h-8 rounded-md px-3 text-xs font-medium ${row.session.verified ? "status-success" : "border border-border text-text-muted hover:bg-subtle"}`}>{row.session.verified ? <span className="flex items-center gap-1"><CheckCircle size={15} weight="fill" />已认证</span> : "标记已认证"}</button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 rounded-lg bg-subtle px-3 py-2 text-xs sm:grid-cols-4"><span><b className="block text-text-muted">用户</b>{humanLabel(row)}</span><span><b className="block text-text-muted">应用端</b>{row.session.source}</span><span><b className="block text-text-muted">Agent</b>{row.agent.name}</span><span><b className="block text-text-muted">开始时间</b>{new Date(row.session.created_at).toLocaleString("zh-CN", { hour12: false })}</span></div>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto bg-canvas/35 px-4 py-5">
        {loading ? <p className="py-20 text-center text-sm text-text-muted">正在读取消息…</p> : visible.length ? <div className="mx-auto max-w-2xl space-y-4">{visible.map((message) => {
          const user = message.role === "user";
          const docxUrl = typeof message.metadata?.docx_url === "string" ? message.metadata.docx_url : undefined;
          const imageUrl = typeof message.metadata?.image_url === "string" ? message.metadata.image_url : undefined;
          return <div key={message.id} className={`flex ${user ? "justify-end" : "justify-start"}`}><div className={`max-w-[82%] ${user ? "text-right" : "text-left"}`}><p className="mb-1 text-[11px] text-text-muted">{new Date(message.created_at).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })} · {user ? humanLabel(row) : message.sender_name || row.agent.name}</p><div className={`inline-block rounded-xl border px-3 py-2 text-left text-sm leading-6 ${user ? "border-primary/20 bg-primary-soft" : "border-border bg-surface"}`}><RuntimeMessageContent content={message.content} attachments={message.attachments} audioUrl={message.audio_url} docxUrl={docxUrl} imageUrl={imageUrl} /></div></div></div>;
        })}<div className="flex gap-2 rounded-lg border border-orange-200 bg-orange-50 px-3 py-3 text-xs text-orange-900 dark:border-orange-400/20 dark:bg-orange-400/10 dark:text-orange-200"><ShieldCheck size={18} className="shrink-0" /><span>完整对话仅对已授权角色可见；Prompt 修改和创作者评论会形成后端变更或推送记录。</span></div></div> : <p className="py-20 text-center text-sm text-text-muted">暂无消息</p>}
      </div>
      <footer className="border-t border-border p-3"><label className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3"><input value={comment} onChange={(e) => setComment(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && comment.trim() && !sending) { onComment(comment); setComment(""); } }} placeholder="输入创作者评论，将推送给用户" className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none" /><button type="button" disabled={!comment.trim() || sending} onClick={() => { onComment(comment); setComment(""); }} className="rounded-md bg-primary p-2 text-white disabled:opacity-40" aria-label="发送创作者评论"><PaperPlaneRight size={17} /></button></label></footer>
    </section>
  );
}
