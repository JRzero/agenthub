"use client";

import { useState } from "react";
import { CaretLeft, CaretRight, PaperPlaneRight } from "@phosphor-icons/react";
import { AgentAvatar } from "@/modules/agents/agent-avatar";
import { useRuntimeChat } from "@/modules/agent-runtime/use-runtime-chat";
import type { Agent } from "@/modules/agents/types";
import { latestRuntimeExchange } from "./media-assets";
import type { AgentBuildDraft } from "./types";

const PREVIEW_TITLE = "实时预览";
const PREVIEW_EXPAND_LABEL = "展开实时预览";
const PREVIEW_COLLAPSE_LABEL = "收起实时预览";

interface BuildPreviewProps {
  agent: Agent;
  draft: AgentBuildDraft;
  dirty: boolean;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

export function BuildPreview({
  agent,
  dirty,
  collapsed,
  onToggleCollapsed,
}: BuildPreviewProps) {
  const [input, setInput] = useState("");
  const runtime = useRuntimeChat(agent.id);
  const messages = latestRuntimeExchange(runtime.messages);
  const savedGreeting =
    agent.config?.examples?.find(
      (message) => message.role === "assistant" && message.content.trim(),
    )?.content ||
    agent.description ||
    "你好，我会按照当前已保存的角色配置与你交流。";
  const interactionDisabled = dirty || runtime.loading || runtime.sending;

  const send = async () => {
    const value = input.trim();
    if (!value || interactionDisabled) return;
    const sent = await runtime.send(value);
    if (sent) setInput("");
  };

  return (
    <aside className="flex min-w-0 flex-col border-t border-border bg-surface lg:col-span-2 xl:col-span-1 xl:border-l xl:border-t-0">
      {collapsed && (
        <div className="hidden min-h-[420px] flex-col items-center py-3 xl:flex">
          <button
            type="button"
            aria-label={PREVIEW_EXPAND_LABEL}
            aria-controls="build-preview-content"
            aria-expanded={false}
            title={PREVIEW_EXPAND_LABEL}
            onClick={onToggleCollapsed}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-text-muted transition hover:bg-subtle hover:text-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <CaretLeft size={18} />
          </button>
          <span className="mt-4 text-sm font-semibold tracking-[0.18em] text-text-muted [writing-mode:vertical-rl]">
            {PREVIEW_TITLE}
          </span>
        </div>
      )}

      <div
        id="build-preview-content"
        className={
          collapsed
            ? "flex min-h-0 flex-col xl:hidden"
            : "flex min-h-0 flex-col"
        }
      >
        <header className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
          <div>
            <h2 className="font-semibold">{PREVIEW_TITLE}</h2>
            <p className="mt-0.5 text-xs text-text-muted">
              {runtime.demo ? "演示 Runtime · 不调用模型" : "使用已保存配置"}
            </p>
          </div>
          <button
            type="button"
            aria-label={PREVIEW_COLLAPSE_LABEL}
            aria-controls="build-preview-content"
            aria-expanded={true}
            title={PREVIEW_COLLAPSE_LABEL}
            onClick={onToggleCollapsed}
            className="hidden h-9 w-9 items-center justify-center rounded-md border border-border text-text-muted transition hover:bg-subtle hover:text-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 xl:inline-flex"
          >
            <CaretRight size={18} />
          </button>
        </header>

        <div className="p-4">
          <div className="mx-auto flex max-w-sm flex-col items-center text-center">
            <AgentAvatar agent={agent} size={72} className="rounded-xl" />
            <h3 className="mt-3 text-lg font-semibold">
              {agent.name || "未命名 Agent"}
            </h3>
            <p className="mt-3 w-full rounded-xl bg-subtle px-4 py-3 text-left text-sm leading-6 text-text-muted">
              {savedGreeting}
            </p>
          </div>

          {dirty && (
            <div
              role="status"
              className="mx-auto mt-4 max-w-sm rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-xs leading-5 text-warning"
            >
              当前有未保存更改。请先保存，再预览最新配置。
            </div>
          )}

          {runtime.error && (
            <div
              role="alert"
              className="mx-auto mt-4 max-w-sm rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-xs leading-5 text-danger"
            >
              {runtime.error}
            </div>
          )}

          {(runtime.edgeStatus || (runtime.sending && !messages.length)) && (
            <p
              className="mx-auto mt-4 max-w-sm text-center text-xs text-text-muted"
              aria-live="polite"
            >
              {runtime.edgeStatus || "正在生成回复…"}
            </p>
          )}

          {messages.length > 0 && (
            <div className="mx-auto mt-5 max-w-sm space-y-3" aria-live="polite">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "ml-8 bg-primary text-white" : "mr-8 bg-subtle text-text-strong"}`}
                >
                  {message.content ||
                    (runtime.sending ? "正在生成…" : "暂未收到回复内容")}
                </div>
              ))}
            </div>
          )}
        </div>

        <form
          className="border-t border-border p-4"
          onSubmit={(event) => {
            event.preventDefault();
            void send();
          }}
        >
          <div className="flex items-center gap-2 rounded-lg border border-border bg-surface p-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
            <input
              aria-label="预览消息"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={
                dirty
                  ? "请先保存当前更改"
                  : runtime.loading
                    ? "正在准备 Runtime…"
                    : "输入消息…"
              }
              disabled={interactionDisabled}
              className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm outline-none disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              aria-label="发送预览消息"
              className="rounded-md bg-primary p-2.5 text-white disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!input.trim() || interactionDisabled}
            >
              <PaperPlaneRight size={18} />
            </button>
          </div>
          <p className="mt-3 text-center text-xs text-text-muted">
            {runtime.demo
              ? "演示回复仅保存在当前页面"
              : "回复由当前 Agent 的已保存配置实时生成"}
          </p>
        </form>
      </div>
    </aside>
  );
}
