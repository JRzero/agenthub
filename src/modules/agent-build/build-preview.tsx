"use client";

import { useMemo, useState } from "react";
import { CaretLeft, CaretRight, PaperPlaneRight, Trash } from "@phosphor-icons/react";
import { AgentAvatar } from "@/modules/agents/agent-avatar";
import type { Agent } from "@/modules/agents/types";
import type { AgentBuildDraft } from "./types";

interface PreviewMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
}

interface BuildPreviewProps {
  agent: Agent;
  draft: AgentBuildDraft;
  collapsed: boolean;
  onToggle: () => void;
}

export function BuildPreview({ agent, draft, collapsed, onToggle }: BuildPreviewProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<PreviewMessage[]>([]);
  const starters = useMemo(() => {
    const fromExamples = draft.examples
      .filter((item) => item.role === "user" && item.content.trim())
      .map((item) => item.content.trim());
    return [...fromExamples, "你擅长哪些方面的帮助？", "如何更好地与你沟通？", "遇到情绪低落时怎么办？"].slice(0, 3);
  }, [draft.examples]);

  const send = (content: string) => {
    const value = content.trim();
    if (!value) return;
    const now = Date.now();
    setMessages((current) => [
      ...current,
      { id: now, role: "user", content: value },
      {
        id: now + 1,
        role: "assistant",
        content: draft.description || "这是根据当前构建草稿生成的本地预览，真实回答请前往测试评估。",
      },
    ]);
    setInput("");
  };

  return (
    <>
      <aside className={`flex min-h-[620px] min-w-0 flex-col border-t border-border bg-surface lg:col-span-2 xl:col-span-1 xl:border-l xl:border-t-0 ${collapsed ? "xl:hidden" : ""}`}>
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <h2 className="font-semibold">实时预览</h2>
            <p className="mt-0.5 text-xs text-text-muted">本地草稿，不调用模型</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button type="button" onClick={() => setMessages([])} className="button-secondary min-h-9 px-3">
              <Trash size={15} />
              清空
            </button>
            <button type="button" onClick={onToggle} aria-label="收起实时预览" title="收起实时预览" className="hidden min-h-9 w-9 items-center justify-center rounded-lg border border-border text-text-muted transition hover:border-primary/40 hover:bg-primary-soft hover:text-primary xl:inline-flex">
              <CaretRight size={17} />
            </button>
          </div>
        </div>

        <div className="flex-1 p-4">
          <div className="mx-auto flex max-w-md flex-col items-center text-center">
            <AgentAvatar agent={agent} size={68} className="rounded-full" />
            <h3 className="mt-2.5 text-lg font-semibold">{draft.name || "未命名 Agent"}</h3>
            <p className="mt-2.5 rounded-xl bg-subtle px-4 py-3 text-left text-sm leading-6 text-text-muted">
              {draft.description || "为 Agent 添加简介后，这里会立即显示构建草稿预览。"}
            </p>
          </div>

          {messages.length === 0 ? (
            <div className="mx-auto mt-6 max-w-md space-y-2">
              {starters.map((starter) => (
                <button key={starter} type="button" onClick={() => send(starter)} className="flex w-full items-center justify-between rounded-lg border border-border px-4 py-3 text-left text-sm transition hover:border-primary/40 hover:bg-primary-soft">
                  <span>{starter}</span>
                  <CaretRight size={16} className="shrink-0 text-text-muted" />
                </button>
              ))}
            </div>
          ) : (
            <div className="mx-auto mt-5 max-w-md space-y-3" aria-live="polite">
              {messages.map((message) => (
                <div key={message.id} className={`rounded-xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "ml-10 bg-primary text-white" : "mr-10 bg-subtle text-text-strong"}`}>
                  {message.content}
                  {message.role === "assistant" && <span className="mt-1 block text-[11px] text-text-muted">本地预览</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        <form className="border-t border-border p-4" onSubmit={(event) => { event.preventDefault(); send(input); }}>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-surface p-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
            <input aria-label="预览消息" value={input} onChange={(event) => setInput(event.target.value)} placeholder="输入消息…" className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm outline-none" />
            <button type="submit" aria-label="发送预览消息" className="rounded-md bg-primary p-2.5 text-white disabled:opacity-40" disabled={!input.trim()}>
              <PaperPlaneRight size={18} />
            </button>
          </div>
          <p className="mt-3 text-center text-xs text-text-muted">内容由当前草稿本地预览，仅供构建参考。</p>
        </form>
      </aside>

      <aside className={`${collapsed ? "hidden xl:flex" : "hidden"} min-h-[620px] flex-col items-center border-l border-border bg-surface py-3`}>
        <button type="button" onClick={onToggle} aria-label="展开实时预览" title="展开实时预览" className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition hover:bg-primary-soft hover:text-primary">
          <CaretLeft size={18} />
        </button>
        <span className="mt-3 text-xs font-medium tracking-[0.2em] text-text-muted [writing-mode:vertical-rl]">实时预览</span>
      </aside>
    </>
  );
}
