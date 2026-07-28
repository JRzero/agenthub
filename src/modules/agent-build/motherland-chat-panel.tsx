"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowCounterClockwise,
  ChatCircleDots,
  Lightbulb,
  MagicWand,
  PaperPlaneTilt,
  Robot,
} from "@phosphor-icons/react";
import { DATA_MODE } from "@/config/capabilities";
import { useAuth } from "@/modules/auth/auth-provider";
import {
  autoTalkRound,
  generateMotherlandTopic,
  getMotherlandHistory,
  getMotherlandStatus,
  resetMotherlandHistory,
  talkToMotherland,
  type MotherlandMessage,
} from "./co-creation-api";
import { NarrativeOptimizerPanel } from "./narrative-optimizer-panel";
import type { AgentBuildDraft } from "./types";

const DEMO_HISTORY: MotherlandMessage[] = [
  { role: "user", content: "我希望在保持温柔的同时，让边界表达更明确。" },
  { role: "assistant", content: "可以把安抚、澄清边界和可行动建议拆成固定顺序。" },
];

const SUGGESTED_PROMPTS = [
  "帮我检查角色边界是否清晰",
  "优化角色的语气和表达方式",
  "补充敏感场景下的回应原则",
];

type ComposerMode = "chat" | "guided";
type BusyAction = "" | "send" | "topic" | "auto" | "reset";
type MotherlandHistory = { messages: MotherlandMessage[] };

export function MotherlandChatPanel({ agentId, draft, onPatch }: { agentId: number; draft: AgentBuildDraft; onPatch: (patch: Partial<AgentBuildDraft>) => void }) {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const demo = DATA_MODE === "demo";
  const [mode, setMode] = useState<ComposerMode>("chat");
  const [input, setInput] = useState("");
  const [topic, setTopic] = useState("");
  const [busy, setBusy] = useState<BusyAction>("");
  const [message, setMessage] = useState("");
  const historyViewport = useRef<HTMLDivElement>(null);
  const historyKey = ["motherland-history", agentId, demo] as const;

  const status = useQuery({
    queryKey: ["motherland-status", demo],
    queryFn: () => demo ? Promise.resolve({ configured: true, agent_id: 1 }) : getMotherlandStatus(),
  });
  const history = useQuery({
    queryKey: historyKey,
    queryFn: () => demo ? Promise.resolve({ messages: DEMO_HISTORY }) : getMotherlandHistory(session?.apiKey || "", agentId),
    enabled: Boolean(session?.apiKey) && status.data?.configured,
  });
  const messages = history.data?.messages || [];

  const setMessages = (next: MotherlandMessage[]) => {
    queryClient.setQueryData<MotherlandHistory>(historyKey, { messages: next });
  };
  const appendMessages = (next: MotherlandMessage[]) => {
    queryClient.setQueryData<MotherlandHistory>(historyKey, (current) => ({
      messages: [...(current?.messages || []), ...next],
    }));
  };

  useEffect(() => {
    const viewport = historyViewport.current;
    if (viewport) viewport.scrollTop = viewport.scrollHeight;
  }, [messages.length, busy]);

  const send = async () => {
    const value = input.trim();
    if (!value || !session?.apiKey) return;
    setBusy("send");
    setMessage("");
    setInput("");
    try {
      const reply = demo
        ? { content: "我建议把这条要求写成可执行的角色准则，并补一个反例。" }
        : await talkToMotherland(session.apiKey, agentId, value);
      appendMessages([
        { role: "user", content: value },
        { role: "assistant", content: reply.content },
      ]);
    } catch (error) {
      setInput(value);
      setMessage(error instanceof Error ? error.message : "对话失败");
    } finally {
      setBusy("");
    }
  };

  const generateTopic = async () => {
    if (!session?.apiKey) return;
    setBusy("topic");
    setMessage("");
    try {
      const result = demo
        ? { topic: "如何让角色边界表达更自然" }
        : await generateMotherlandTopic(session.apiKey, agentId);
      setTopic(result.topic);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "主题生成失败");
    } finally {
      setBusy("");
    }
  };

  const autoRound = async () => {
    const value = topic.trim();
    if (!session?.apiKey || !value) return;
    setBusy("auto");
    setMessage("");
    try {
      const result = demo
        ? { agent_message: `我想讨论：${value}`, motherland_reply: "先明确目标用户、允许的亲密程度和必须拒绝的场景。" }
        : await autoTalkRound(session.apiKey, agentId, value);
      appendMessages([
        { role: "user", content: result.agent_message },
        { role: "assistant", content: result.motherland_reply },
      ]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "主题共创失败");
    } finally {
      setBusy("");
    }
  };

  const reset = async () => {
    if (!session?.apiKey || !window.confirm("确定清空当前 Agent 与 Motherland 的对话记录？")) return;
    setBusy("reset");
    setMessage("");
    try {
      if (!demo) await resetMotherlandHistory(session.apiKey, agentId);
      setMessages([]);
      setTopic("");
      setInput("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "重置失败");
    } finally {
      setBusy("");
    }
  };

  if (status.isLoading) {
    return <div className="rounded-xl border border-border p-6"><div className="h-5 w-40 animate-pulse rounded bg-slate-200/70 dark:bg-slate-700/60" /><div className="mt-3 h-4 w-72 max-w-full animate-pulse rounded bg-slate-200/70 dark:bg-slate-700/60" /></div>;
  }
  if (status.isError) {
    return <div className="rounded-xl border border-danger/20 bg-red-50 p-5 dark:bg-red-400/10"><h3 className="font-semibold text-danger dark:text-red-200">Motherland 暂时无法连接</h3><p className="mt-1 text-sm text-danger/80 dark:text-red-200/80">请检查服务状态后重试。</p><button type="button" onClick={() => void status.refetch()} className="button-secondary mt-4">重新检查</button></div>;
  }
  if (!status.data?.configured) {
    return <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200">Motherland 尚未配置，请联系管理员配置系统 Motherland Agent。</div>;
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-xl border border-border bg-surface">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-soft text-primary"><Robot size={21} /></span>
            <div className="min-w-0">
              <div className="flex items-center gap-2"><span className="status-badge bg-primary-soft text-primary">第 1 步</span><h3 className="font-semibold">与 Motherland 共创</h3></div>
              <p className="mt-1 text-sm leading-6 text-text-muted">讨论角色设定、表达方式和安全边界，结果会保留在当前 Agent 的共创记录中。</p>
            </div>
          </div>
          <button type="button" onClick={() => void reset()} disabled={!messages.length || Boolean(busy)} className="button-secondary min-h-9 shrink-0 px-3" aria-label="清空 Motherland 对话">
            <ArrowCounterClockwise size={16} />{busy === "reset" ? "清空中…" : "清空对话"}
          </button>
        </header>

        <div ref={historyViewport} className="min-h-64 max-h-[420px] space-y-4 overflow-y-auto bg-canvas/35 p-5 sm:p-6" aria-live="polite">
          {history.isLoading && <div className="space-y-3"><div className="h-16 w-3/4 animate-pulse rounded-xl bg-slate-200/70 dark:bg-slate-700/60" /><div className="ml-auto h-16 w-2/3 animate-pulse rounded-xl bg-primary-soft" /></div>}
          {history.isError && <div className="mx-auto max-w-sm py-10 text-center"><p className="text-sm text-danger">共创记录加载失败</p><button type="button" onClick={() => void history.refetch()} className="button-secondary mt-4">重新加载</button></div>}
          {!history.isLoading && !history.isError && !messages.length && (
            <div className="mx-auto flex max-w-xl flex-col items-center py-7 text-center">
              <span className="grid size-12 place-items-center rounded-full bg-primary-soft text-primary"><ChatCircleDots size={24} /></span>
              <h4 className="mt-4 font-semibold">从一个明确的问题开始</h4>
              <p className="mt-2 text-sm leading-6 text-text-muted">你可以自由提问，也可以让 Agent 和 Motherland 围绕一个主题自动共创。</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {SUGGESTED_PROMPTS.map((prompt) => <button key={prompt} type="button" onClick={() => { setMode("chat"); setInput(prompt); }} className="rounded-full border border-border bg-surface px-3 py-2 text-xs text-text-muted transition hover:border-primary/40 hover:text-primary">{prompt}</button>)}
              </div>
            </div>
          )}
          {messages.map((item, index) => (
            <div key={`${item.role}-${index}`} className={`max-w-[88%] rounded-xl px-4 py-3 text-sm leading-6 ${item.role === "user" ? "ml-auto bg-primary-soft text-text-strong" : "border border-border bg-surface text-text-strong"}`}>
              <strong className="mb-1 block text-xs font-medium text-text-muted">{item.role === "user" ? "当前 Agent" : "Motherland"}</strong>
              <p className="whitespace-pre-wrap">{item.content}</p>
            </div>
          ))}
          {(busy === "send" || busy === "auto") && <div className="max-w-[88%] rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-muted"><strong className="mb-1 block text-xs font-medium">Motherland</strong>正在整理回应…</div>}
        </div>

        <div className="border-t border-border p-4 sm:p-5">
          <div className="inline-flex rounded-lg bg-subtle p-1" aria-label="共创方式">
            <button type="button" aria-pressed={mode === "chat"} onClick={() => setMode("chat")} className={`inline-flex min-h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition ${mode === "chat" ? "bg-surface text-primary shadow-sm" : "text-text-muted hover:text-text-strong"}`}><ChatCircleDots size={16} />自由对话</button>
            <button type="button" aria-pressed={mode === "guided"} onClick={() => setMode("guided")} className={`inline-flex min-h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition ${mode === "guided" ? "bg-surface text-primary shadow-sm" : "text-text-muted hover:text-text-strong"}`}><Lightbulb size={16} />主题共创</button>
          </div>

          {mode === "chat" ? (
            <div className="mt-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <label className="min-w-0 flex-1"><span className="sr-only">输入想与 Motherland 讨论的内容</span><textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); void send(); } }} rows={3} placeholder="例如：怎样让角色在拒绝用户时仍然保持温和？" className="w-full resize-none rounded-lg border border-border p-3 leading-6 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" /></label>
                <button type="button" onClick={() => void send()} disabled={!input.trim() || Boolean(busy)} className="button-primary shrink-0 sm:min-w-28"><PaperPlaneTilt size={17} />{busy === "send" ? "发送中…" : "发送"}</button>
              </div>
              <p className="mt-2 text-xs text-text-muted">按 Enter 发送，Shift + Enter 换行</p>
            </div>
          ) : (
            <div className="mt-4 rounded-lg border border-border bg-canvas/35 p-4">
              <div className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-soft text-primary"><Lightbulb size={18} /></span><div><h4 className="text-sm font-semibold">围绕一个主题自动共创</h4><p className="mt-1 text-xs leading-5 text-text-muted">Agent 会先表达观点，Motherland 再给出建议，双方内容都会加入上方记录。</p></div></div>
              <label className="mt-4 block"><span className="text-sm font-medium">讨论主题</span><div className="mt-2 flex flex-col gap-2 sm:flex-row"><input value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="输入主题，或让 AI 推荐一个主题" className="control-field min-w-0 flex-1" /><button type="button" onClick={() => void generateTopic()} disabled={Boolean(busy)} className="button-secondary shrink-0 whitespace-nowrap"><MagicWand size={16} />{busy === "topic" ? "生成中…" : topic ? "换个主题" : "AI 推荐主题"}</button></div></label>
              <button type="button" onClick={() => void autoRound()} disabled={!topic.trim() || Boolean(busy)} className="button-primary mt-3 w-full"><ChatCircleDots size={17} />{busy === "auto" ? "共创中…" : "开始一轮主题共创"}</button>
            </div>
          )}

          {message && <p className="mt-3 rounded-md border border-danger/20 bg-red-50 px-4 py-3 text-sm text-danger dark:bg-red-400/10 dark:text-red-200">{message}</p>}
        </div>
      </section>

      <NarrativeOptimizerPanel agentId={agentId} draft={draft} onPatch={onPatch} />
    </div>
  );
}
