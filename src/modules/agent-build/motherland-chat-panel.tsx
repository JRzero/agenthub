"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowCounterClockwise, PaperPlaneTilt, Robot } from "@phosphor-icons/react";
import { DATA_MODE } from "@/config/capabilities";
import { useAuth } from "@/modules/auth/auth-provider";
import { autoTalkRound, generateMotherlandTopic, getMotherlandHistory, getMotherlandStatus, resetMotherlandHistory, talkToMotherland, type MotherlandMessage } from "./co-creation-api";
import { NarrativeOptimizerPanel } from "./narrative-optimizer-panel";
import type { AgentBuildDraft } from "./types";

const DEMO_HISTORY: MotherlandMessage[] = [
  { role: "user", content: "我希望在保持温柔的同时，让边界表达更明确。" },
  { role: "assistant", content: "可以把安抚、澄清边界和可行动建议拆成固定顺序。" },
];

export function MotherlandChatPanel({ agentId, draft, onPatch }: { agentId: number; draft: AgentBuildDraft; onPatch: (patch: Partial<AgentBuildDraft>) => void }) {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const demo = DATA_MODE === "demo";
  const [input, setInput] = useState("");
  const [topic, setTopic] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const status = useQuery({ queryKey: ["motherland-status", demo], queryFn: () => demo ? Promise.resolve({ configured: true, agent_id: 1 }) : getMotherlandStatus() });
  const history = useQuery({ queryKey: ["motherland-history", agentId, demo], queryFn: () => demo ? Promise.resolve({ messages: DEMO_HISTORY }) : getMotherlandHistory(session?.apiKey || "", agentId), enabled: Boolean(session?.apiKey) && status.data?.configured });
  const messages = history.data?.messages || [];
  const setMessages = (next: MotherlandMessage[]) => queryClient.setQueryData(["motherland-history", agentId, demo], { messages: next });

  const send = async () => {
    const value = input.trim();
    if (!value || !session?.apiKey) return;
    setBusy(true); setMessage(""); setInput("");
    try {
      const reply = demo ? { content: "我建议把这条要求写成可执行的角色准则，并补一个反例。" } : await talkToMotherland(session.apiKey, agentId, value);
      setMessages([...messages, { role: "user", content: value }, { role: "assistant", content: reply.content }]);
    } catch (error) { setMessage(error instanceof Error ? error.message : "对话失败"); }
    finally { setBusy(false); }
  };
  const generateTopic = async () => {
    if (!session?.apiKey) return;
    setBusy(true); setMessage("");
    try { setTopic((demo ? { topic: "如何让角色边界表达更自然" } : await generateMotherlandTopic(session.apiKey, agentId)).topic); }
    catch (error) { setMessage(error instanceof Error ? error.message : "主题生成失败"); }
    finally { setBusy(false); }
  };
  const autoRound = async () => {
    if (!session?.apiKey || !topic.trim()) return;
    setBusy(true); setMessage("");
    try {
      const result = demo ? { agent_message: `我想讨论：${topic}`, motherland_reply: "先明确目标用户、允许的亲密程度和必须拒绝的场景。" } : await autoTalkRound(session.apiKey, agentId, topic.trim());
      setMessages([...messages, { role: "user", content: result.agent_message }, { role: "assistant", content: result.motherland_reply }]);
    } catch (error) { setMessage(error instanceof Error ? error.message : "自动对话失败"); }
    finally { setBusy(false); }
  };
  const reset = async () => {
    if (!session?.apiKey || !window.confirm("确定清空当前 Agent 与 Motherland 的对话记录？")) return;
    setBusy(true);
    try { if (!demo) await resetMotherlandHistory(session.apiKey, agentId); setMessages([]); setTopic(""); }
    catch (error) { setMessage(error instanceof Error ? error.message : "重置失败"); }
    finally { setBusy(false); }
  };

  if (status.isLoading) return <p className="text-sm text-text-muted">检查 Motherland 配置…</p>;
  if (!status.data?.configured) return <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">Motherland 尚未配置，请联系管理员配置系统 Motherland Agent。</div>;
  return <div className="space-y-6"><section className="rounded-xl border border-border"><header className="flex items-center justify-between border-b border-border px-5 py-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-primary-soft text-primary"><Robot size={21} /></span><div><h3 className="font-semibold">Talk To Motherland</h3><p className="text-xs text-text-muted">讨论角色设定与边界</p></div></div><button type="button" onClick={() => void reset()} disabled={busy} className="rounded p-2 text-text-muted hover:bg-subtle" aria-label="重置 Motherland 对话"><ArrowCounterClockwise size={18} /></button></header><div className="max-h-80 space-y-3 overflow-y-auto p-5">{messages.map((item, index) => <div key={`${item.role}-${index}`} className={`max-w-[86%] rounded-xl px-4 py-3 text-sm leading-6 ${item.role === "user" ? "ml-auto bg-primary-soft" : "bg-subtle"}`}><strong className="mb-1 block text-xs text-text-muted">{item.role === "user" ? "Agent" : "Motherland"}</strong>{item.content}</div>)}{!messages.length && <p className="py-8 text-center text-sm text-text-muted">开始一段角色共创对话</p>}</div><div className="border-t border-border p-4"><div className="flex gap-2"><textarea value={input} onChange={(event) => setInput(event.target.value)} rows={2} placeholder="输入想与 Motherland 讨论的内容" className="min-w-0 flex-1 resize-none rounded-lg border border-border p-3" /><button type="button" onClick={() => void send()} disabled={!input.trim() || busy} className="button-primary self-end"><PaperPlaneTilt size={17} />发送</button></div><div className="mt-3 flex flex-wrap gap-2"><input value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="自动对话主题" className="h-10 min-w-64 flex-1 rounded-md border border-border px-3" /><button type="button" onClick={() => void generateTopic()} disabled={busy} className="button-secondary">生成主题</button><button type="button" onClick={() => void autoRound()} disabled={!topic.trim() || busy} className="button-secondary">自动对话一轮</button></div></div></section><NarrativeOptimizerPanel agentId={agentId} draft={draft} onPatch={onPatch} />{message && <p className="text-sm text-danger">{message}</p>}</div>;
}
