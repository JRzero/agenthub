"use client";

import { useState } from "react";
import { ChatCircleDots, Flask } from "@phosphor-icons/react";
import { useParams } from "next/navigation";
import { RuntimeChatPanel } from "@/modules/agent-runtime/runtime-chat-panel";
import { ErrorState, LoadingState } from "@/shared/ui/request-state";
import { AdvancedConversationPanel } from "./advanced-conversation-panel";
import { EvaluationPanel } from "./evaluation-panel";
import { ScenarioPanel } from "./scenario-panel";
import { useTestSession } from "./use-test-session";

export function TestWorkspaceNext() {
  const params = useParams<{ agentId: string }>();
  const agentId = Number(params.agentId);
  const session = useTestSession(Number.isFinite(agentId) ? agentId : null);
  const [mode, setMode] = useState<"simulation" | "runtime">("simulation");
  if (session.isLoading) return <LoadingState label="正在打开测试工作区…" />;
  if (session.isError || !session.data || !session.scenario) return <ErrorState message={session.error?.message || "无法打开测试工作区"} onRetry={() => void session.refetch()} />;

  return <div className="-mx-4 border-b border-border sm:-mx-6 lg:-mx-7">
    <div className="flex items-center gap-2 border-b border-border bg-surface px-5 py-3"><button type="button" onClick={() => setMode("simulation")} className={mode === "simulation" ? "button-primary" : "button-secondary"}><Flask size={17} />非持久模拟与评估</button><button type="button" onClick={() => setMode("runtime")} className={mode === "runtime" ? "button-primary" : "button-secondary"}><ChatCircleDots size={17} />真实 Runtime Chat</button><span className="ml-auto text-xs text-text-muted">两种模式的消息状态相互隔离</span></div>
    {mode === "runtime" ? <RuntimeChatPanel agent={session.data} /> : <div className="grid min-h-[760px] grid-cols-1 xl:h-[760px] xl:min-h-0 xl:grid-cols-[210px_minmax(430px,1fr)_370px] xl:overflow-hidden"><ScenarioPanel scenarios={session.scenarios} selectedId={session.scenario.id} onSelect={session.selectScenario} onCreate={session.addScenario} /><AdvancedConversationPanel agent={session.data} scenario={session.scenario} messages={session.messages} widgets={session.widgets} sending={session.sending} error={session.conversationError} demo={session.demo} memoryBusy={session.memoryBusy} memoryNotice={session.memoryNotice} onSend={session.send} onClear={session.resetTranscript} onClearMemory={() => void session.clearMemory()} /><EvaluationPanel result={session.evaluation} messages={session.messages} canEvaluate={session.canEvaluate} onRun={() => void session.runEvaluation()} onReset={session.resetTranscript} /></div>}
  </div>;
}
