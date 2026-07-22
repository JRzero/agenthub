"use client";

import { useState } from "react";
import { CaretLeft, CaretRight, PaperPlaneRight } from "@phosphor-icons/react";
import { DATA_MODE } from "@/config/capabilities";
import { AgentAvatar } from "@/modules/agents/agent-avatar";
import { useAuth } from "@/modules/auth/auth-provider";
import {
  getDemoSimulationResponse,
  simulateAgent,
} from "@/modules/agent-test/api";
import type { TestMessage } from "@/modules/agent-test/types";
import { useWorkspace } from "@/modules/workspace/workspace-provider";
import type { Agent } from "@/modules/agents/types";
import type { AgentBuildDraft } from "./types";
import {
  buildDraftSimulationPayload,
  latestPreviewExchange,
} from "./build-preview-model";

const PREVIEW_TITLE = "预览当前草稿";
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
  draft,
  dirty,
  collapsed,
  onToggleCollapsed,
}: BuildPreviewProps) {
  const { session } = useAuth();
  const { workspaceCode } = useWorkspace();
  const demo = DATA_MODE === "demo";
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<TestMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const savedGreeting =
    draft.examples.find(
      (message) => message.role === "assistant" && message.content.trim(),
    )?.content ||
    draft.description ||
    "你好，我会按照当前已保存的角色配置与你交流。";
  const interactionDisabled = dirty || sending;

  const send = async () => {
    const value = input.trim();
    if (!value || interactionDisabled) return;
    const userMessage: TestMessage = {
      id: `preview-user-${Date.now()}`,
      role: "user",
      content: value,
    };
    const previousMessages = latestPreviewExchange(messages);
    setMessages([userMessage]);
    setInput("");
    setSending(true);
    setError("");
    try {
      const response = demo
        ? getDemoSimulationResponse(
            {
              id: "draft-preview",
              name: "草稿预览",
              goal: "预览当前草稿",
              starter: value,
              status: "idle",
            },
            value,
          )
        : await simulateAgent(
            session?.apiKey || "",
            workspaceCode,
            agent.id,
            buildDraftSimulationPayload(draft, value, previousMessages),
          );
      setMessages(() => [
        userMessage,
        {
          id: response.message_id || `preview-assistant-${Date.now()}`,
          role: "assistant",
          content: response.content,
          model: response.model,
          usage: response.usage,
        },
      ]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "预览失败，请重试");
    } finally {
      setSending(false);
    }
  };

  return (
    <aside className="flex min-h-0 min-w-0 max-w-full flex-col overflow-hidden border-t border-border bg-surface lg:col-span-1 lg:h-full lg:border-l lg:border-t-0">
      {collapsed && (
        <div className="hidden min-h-[420px] flex-col items-center py-3 lg:flex">
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
            ? "h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden lg:hidden"
            : "flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden"
        }
      >
        <header className="flex min-w-0 items-start justify-between gap-3 border-b border-border py-3 pl-4 pr-5">
          <div className="min-w-0">
            <h2 className="font-semibold">{PREVIEW_TITLE}</h2>
            <p className="mt-0.5 break-words text-xs text-text-muted">
              {demo ? "演示模式" : "使用已保存的当前草稿"}
            </p>
          </div>
          <button
            type="button"
            aria-label={PREVIEW_COLLAPSE_LABEL}
            aria-controls="build-preview-content"
            aria-expanded={true}
            title={PREVIEW_COLLAPSE_LABEL}
            onClick={onToggleCollapsed}
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-text-muted transition hover:bg-subtle hover:text-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 lg:inline-flex"
          >
            <CaretRight size={18} />
          </button>
        </header>

        <div className="scrollbar-hidden min-h-0 w-full min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain py-4 pl-4 pr-5">
          <div className="mx-auto flex w-full min-w-0 max-w-sm flex-col items-center text-center">
            <AgentAvatar agent={agent} size={72} className="rounded-xl" />
            <h3 className="mt-3 text-lg font-semibold">
              {agent.name || "未命名 Agent"}
            </h3>
            <p className="mt-3 w-full break-words rounded-xl bg-subtle px-4 py-3 text-left text-sm leading-6 text-text-muted [overflow-wrap:anywhere]">
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

          {error && (
            <div
              role="alert"
              className="mx-auto mt-4 max-w-sm rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-xs leading-5 text-danger"
            >
              {error}
            </div>
          )}

          {sending && (
            <p
              className="mx-auto mt-4 max-w-sm text-center text-xs text-text-muted"
              aria-live="polite"
            >
              正在生成回复…
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
                    (sending ? "正在生成…" : "暂未收到回复内容")}
                </div>
              ))}
            </div>
          )}
        </div>

        <form
          className="min-w-0 border-t border-border py-4 pl-4 pr-5"
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
            {demo
              ? "演示回复仅保存在当前页面"
              : "仅用于预览，不会创建正式会话"}
          </p>
        </form>
      </div>
    </aside>
  );
}
