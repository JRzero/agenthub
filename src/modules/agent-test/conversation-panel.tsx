"use client";

import { useState } from "react";
import { PaperPlaneRight, Trash, User } from "@phosphor-icons/react";
import { AgentAvatar } from "@/modules/agents/agent-avatar";
import type { Agent } from "@/modules/agents/types";
import type { TestMessage, TestScenario } from "./types";

export function ConversationPanel({
  agent,
  scenario,
  messages,
  sending,
  error,
  demo,
  onSend,
  onClear,
}: {
  agent: Agent;
  scenario: TestScenario;
  messages: TestMessage[];
  sending: boolean;
  error: string;
  demo: boolean;
  onSend: (content: string) => Promise<boolean>;
  onClear: () => void;
}) {
  const [input, setInput] = useState("");

  const submit = async () => {
    const value = input.trim();
    if (!value || sending) return;
    setInput("");
    const sent = await onSend(value);
    if (!sent) setInput(value);
  };

  return (
    <section className="flex min-h-[680px] min-w-0 flex-col bg-surface">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="font-semibold">对话模拟</h2>
          <p className="mt-1 text-xs text-text-muted">{scenario.name} · {scenario.goal}</p>
        </div>
        <button type="button" onClick={onClear} disabled={!messages.length || sending} className="button-secondary min-h-9 px-3"><Trash size={15} />清空对话</button>
      </div>

      <div className="flex items-center gap-3 border-b border-border px-5 py-3">
        <AgentAvatar agent={agent} size={38} className="rounded-full" />
        <div className="min-w-0">
          <strong className="block truncate text-sm">{agent.name}</strong>
          <span className="text-xs text-text-muted">测试用户 · 18–24 岁 · {demo ? "演示回答" : "实时模拟"}</span>
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto bg-canvas/40 p-5" aria-live="polite">
        {messages.length === 0 && (
          <div className="mx-auto flex max-w-md flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-primary-soft p-3 text-primary"><PaperPlaneRight size={24} /></div>
            <h3 className="mt-4 font-semibold">从场景起始语开始</h3>
            <p className="mt-2 text-sm leading-6 text-text-muted">当前对话不会创建或保存正式会话。</p>
            <button type="button" onClick={() => void onSend(scenario.starter)} className="mt-5 rounded-lg border border-primary/30 bg-surface px-4 py-3 text-left text-sm leading-6 text-primary hover:bg-primary-soft">
              {scenario.starter}
            </button>
          </div>
        )}
        {messages.map((message) => (
          <div key={message.id} className={`flex items-start gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            {message.role === "assistant" && <AgentAvatar agent={agent} size={34} className="rounded-full" />}
            <div className={`max-w-[78%] rounded-xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "bg-primary text-white" : "border border-border bg-surface text-text-strong"}`}>
              <p className="whitespace-pre-wrap">{message.content}</p>
              {message.role === "assistant" && (
                <span className="mt-2 block text-[11px] text-text-muted">
                  {demo ? "演示数据" : message.model || "实时模拟"}
                  {message.usage ? ` · ${message.usage.total_tokens} tokens` : ""}
                </span>
              )}
            </div>
            {message.role === "user" && <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"><User size={18} weight="fill" /></span>}
          </div>
        ))}
        {sending && (
          <div className="flex items-center gap-3 text-sm text-text-muted">
            <AgentAvatar agent={agent} size={34} className="rounded-full" />
            <span className="rounded-xl border border-border bg-surface px-4 py-3">正在生成模拟回答…</span>
          </div>
        )}
      </div>

      {error && <p className="border-t border-danger/20 bg-red-50 px-5 py-2 text-sm text-danger dark:bg-red-400/10 dark:text-red-200">{error}</p>}
      <form className="border-t border-border p-4" onSubmit={(event) => { event.preventDefault(); void submit(); }}>
        <textarea
          aria-label="测试消息"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void submit();
            }
          }}
          placeholder="输入消息，按 Shift + Enter 换行"
          rows={3}
          className="w-full resize-none rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
        <div className="mt-2 flex items-center justify-between text-xs text-text-muted">
          <span>{input.length} / 2000</span>
          <button type="submit" disabled={!input.trim() || sending} className="button-primary min-h-9 px-4"><PaperPlaneRight size={16} />{sending ? "发送中…" : "发送"}</button>
        </div>
      </form>
    </section>
  );
}
