"use client";

import { useState } from "react";
import { CaretLeft, CaretRight, PaperPlaneRight } from "@phosphor-icons/react";
import { DATA_MODE } from "@/config/capabilities";
import { RuntimeMessageContent } from "@/modules/agent-runtime/runtime-message-content";
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
import { BuildPublishCheck } from "./build-publish-check";
import {
  buildDraftSimulationPayload,
  createPreviewAssistantMessage,
  latestPreviewExchange,
} from "./build-preview-model";
import type {
  PublishCheckAction,
  PublishCheckResult,
} from "./publish-check-model";

const PREVIEW_TITLE = "预览当前草稿";
const PREVIEW_EXPAND_LABEL = "展开实时预览";
const PREVIEW_COLLAPSE_LABEL = "收起实时预览";

interface BuildPreviewProps {
  agent: Agent;
  draft: AgentBuildDraft;
  dirty: boolean;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  panelMode: "preview" | "publish-check";
  publishCheckEnabled: boolean;
  publishCheck: PublishCheckResult;
  onPanelModeChange: (mode: "preview" | "publish-check") => void;
  onPublishCheckAction: (action: PublishCheckAction) => void;
}

export function BuildPreview({
  agent,
  draft,
  dirty,
  collapsed,
  onToggleCollapsed,
  panelMode,
  publishCheckEnabled,
  publishCheck,
  onPanelModeChange,
  onPublishCheckAction,
}: BuildPreviewProps) {
  const { session } = useAuth();
  const { workspaceCode } = useWorkspace();
  const demo = DATA_MODE === "demo";
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<TestMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const savedGreeting =
    draft.openingMessage ||
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
        createPreviewAssistantMessage(
          response,
          `preview-assistant-${Date.now()}`,
        ),
      ]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "预览失败，请重试");
    } finally {
      setSending(false);
    }
  };

  return (
    <aside className="flex min-h-0 min-w-0 max-w-full flex-col overflow-hidden border-t border-border bg-surface-elevated lg:col-span-1 lg:h-full lg:border-l lg:border-t-0">
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
            {panelMode === "publish-check" ? "发布检查" : PREVIEW_TITLE}
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
        <header className="flex min-w-0 items-start justify-between gap-3 border-b border-border pl-4 pr-5">
          {publishCheckEnabled ? (
            <div
              role="tablist"
              aria-label="构建侧栏模式"
              className="flex min-w-0 items-center gap-6"
            >
              {[
                { id: "preview" as const, label: "实时预览" },
                { id: "publish-check" as const, label: "发布检查" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={panelMode === item.id}
                  onClick={() => onPanelModeChange(item.id)}
                  className={`border-b-2 py-3 text-sm font-medium transition ${
                    panelMode === item.id
                      ? "border-primary text-primary"
                      : "border-transparent text-text-muted hover:text-text-strong"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="min-w-0 py-3">
              <h2 className="font-semibold">{PREVIEW_TITLE}</h2>
              <p className="mt-0.5 break-words text-xs text-text-muted">
                {demo ? "演示模式" : "使用已保存的当前草稿"}
              </p>
            </div>
          )}
          <button
            type="button"
            aria-label={PREVIEW_COLLAPSE_LABEL}
            aria-controls="build-preview-content"
            aria-expanded={true}
            title={PREVIEW_COLLAPSE_LABEL}
            onClick={onToggleCollapsed}
            className="my-2 hidden h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-text-muted transition hover:bg-subtle hover:text-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 lg:inline-flex"
          >
            <CaretRight size={18} />
          </button>
        </header>

        {panelMode === "publish-check" ? (
          <BuildPublishCheck
            result={publishCheck}
            onAction={onPublishCheckAction}
          />
        ) : (
          <>
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
                <div
                  className="mx-auto mt-5 max-w-sm space-y-3"
                  aria-live="polite"
                >
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`rounded-xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "ml-8 bg-primary text-canvas" : "mr-8 bg-subtle text-text-strong"}`}
                    >
                      <RuntimeMessageContent
                        content={
                          message.content ||
                          (sending
                            ? "正在生成…"
                            : message.image_url || message.attachments?.length
                              ? ""
                              : "暂未收到回复内容")
                        }
                        attachments={message.attachments}
                        audioUrl={message.audio_url}
                        docxUrl={message.docx_url}
                        imageUrl={message.image_url}
                      />
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
                  placeholder={dirty ? "请先保存当前更改" : "输入消息…"}
                  disabled={interactionDisabled}
                  className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm outline-none disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  aria-label="发送预览消息"
                  className="rounded-md border border-transparent bg-primary p-2.5 text-canvas transition enabled:hover:brightness-105 enabled:active:brightness-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:border-text-muted disabled:bg-surface-elevated disabled:text-text-muted"
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
          </>
        )}
      </div>
    </aside>
  );
}
