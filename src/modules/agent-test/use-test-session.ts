"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DATA_MODE } from "@/config/capabilities";
import { DEMO_RUNTIME_WIDGETS } from "@/modules/agent-runtime/fixtures";
import { clearTestUserMemories, getRuntimeWidgets, getTestUserId } from "@/modules/agent-runtime/api";
import { resolveRuntimeAttachments } from "@/modules/agent-runtime/upload-api";
import type { PendingRuntimeAttachment, RuntimeAttachment, RuntimeMessageOptions, RuntimeWidgetSpec } from "@/modules/agent-runtime/types";
import { useAgent } from "@/modules/agents/queries";
import { useAuth } from "@/modules/auth/auth-provider";
import { useWorkspace } from "@/modules/workspace/workspace-provider";
import { buildSimulationPayload, getDemoSimulationResponse, simulateAgent } from "./api";
import { deriveEvaluation } from "./evaluation";
import {
  createPublishTestSummary,
  readPublishTestSummary,
  savePublishTestSummary,
} from "./publish-test-summary";
import { DEFAULT_TEST_SCENARIOS, type EvaluationResult, type TestMessage, type TestScenario } from "./types";

export function useTestSession(agentId: number | null) {
  const query = useAgent(agentId);
  const { session } = useAuth();
  const { workspaceCode } = useWorkspace();
  const demo = DATA_MODE === "demo";
  const [scenarios, setScenarios] = useState<TestScenario[]>(DEFAULT_TEST_SCENARIOS);
  const [scenarioId, setScenarioId] = useState(DEFAULT_TEST_SCENARIOS[3].id);
  const [messages, setMessages] = useState<TestMessage[]>([]);
  const [widgets, setWidgets] = useState<RuntimeWidgetSpec[]>(demo ? DEMO_RUNTIME_WIDGETS : []);
  const [sending, setSending] = useState(false);
  const [conversationError, setConversationError] = useState("");
  const [memoryBusy, setMemoryBusy] = useState(false);
  const [memoryNotice, setMemoryNotice] = useState("");
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const scenario = useMemo(() => scenarios.find((item) => item.id === scenarioId) || scenarios[0], [scenarioId, scenarios]);
  const canEvaluate = messages.some((item) => item.role === "assistant");

  useEffect(() => {
    if (demo || !agentId || !session?.apiKey) return;
    getRuntimeWidgets(session.apiKey, workspaceCode, agentId).then(setWidgets).catch(() => setWidgets([]));
  }, [agentId, demo, session?.apiKey, workspaceCode]);

  useEffect(() => {
    if (!query.data || !agentId) return;
    const summary = readPublishTestSummary(
      window.sessionStorage,
      DATA_MODE,
      agentId,
      query.data.draft_revision ?? 0,
    );
    if (!summary) return;
    setScenarioId(summary.scenarioId);
    setEvaluation(summary.evaluation);
    setScenarios((current) =>
      current.map((item) =>
        item.id === summary.scenarioId
          ? {
              ...item,
              status:
                summary.evaluation.overall >= 85 ? "passed" : "partial",
            }
          : item,
      ),
    );
  }, [agentId, query.data]);

  const resetTranscript = useCallback(() => { setMessages([]); setEvaluation(null); setConversationError(""); }, []);
  const selectScenario = useCallback((id: string) => { setScenarioId(id); setMessages([]); setEvaluation(null); setConversationError(""); }, []);
  const addScenario = useCallback((name: string) => {
    const trimmed = name.trim(); if (!trimmed) return;
    const id = `local-${Date.now()}`;
    setScenarios((current) => [...current, { id, name: trimmed, goal: "当前浏览器会话中的自定义测试目标。", starter: "请从这个场景开始测试。", status: "idle", local: true }]);
    selectScenario(id);
  }, [selectScenario]);

  const send = useCallback(async (content: string, pending: PendingRuntimeAttachment[] = [], metadata?: RuntimeMessageOptions["metadata"]): Promise<boolean> => {
    const value = content.trim();
    if (!value || !query.data || !agentId || !scenario || sending) return false;
    setSending(true); setConversationError(""); setEvaluation(null);
    try {
      const attachments: RuntimeAttachment[] = demo
        ? pending.map(({ file: _file, ...attachment }) => { void _file; return attachment; })
        : await resolveRuntimeAttachments(session?.apiKey || "", workspaceCode, pending);
      setMessages((current) => [...current, { id: `user-${Date.now()}`, role: "user", content: value, attachments }]);
      const response = demo ? getDemoSimulationResponse(scenario, value) : await simulateAgent(session?.apiKey || "", workspaceCode, agentId, buildSimulationPayload(query.data, value, messages, attachments, metadata));
      setMessages((current) => [...current, { id: response.message_id || `assistant-${Date.now()}`, role: "assistant", content: response.content, model: response.model, usage: response.usage, attachments: response.attachments, audio_url: response.audio_url, docx_url: response.docx_url, image_url: response.image_url }]);
      return true;
    } catch (error) { setConversationError(error instanceof Error ? error.message : "模拟请求失败，请重新发送"); return false; }
    finally { setSending(false); }
  }, [agentId, demo, messages, query.data, scenario, sending, session?.apiKey, workspaceCode]);

  const clearMemory = useCallback(async () => {
    if (!agentId || !session?.apiKey || !window.confirm("清除当前 Agent 的测试用户长期记忆？此操作不可恢复。")) return;
    if (demo) { setMemoryNotice("演示模式不会写入或删除后端记忆"); return; }
    setMemoryBusy(true); setMemoryNotice(""); setConversationError("");
    try {
      const userId = await getTestUserId(session.apiKey, workspaceCode, agentId);
      if (!userId) throw new Error("当前 Agent 没有可用的测试用户");
      await clearTestUserMemories(session.apiKey, workspaceCode, userId, agentId);
      setMemoryNotice("测试用户长期记忆已清除");
    } catch (error) { setConversationError(error instanceof Error ? error.message : "清除记忆失败"); }
    finally { setMemoryBusy(false); }
  }, [agentId, demo, session?.apiKey, workspaceCode]);

  const runEvaluation = useCallback(() => {
    if (!query.data || !scenario || !canEvaluate) return null;
    const result = deriveEvaluation(query.data, scenario, messages); setEvaluation(result);
    savePublishTestSummary(
      window.sessionStorage,
      DATA_MODE,
      createPublishTestSummary(query.data, result, scenario.id),
    );
    setScenarios((current) => current.map((item) => item.id === scenario.id ? { ...item, status: result.overall >= 85 ? "passed" : "partial" } : item));
    return result;
  }, [canEvaluate, messages, query.data, scenario]);

  return { ...query, demo, scenarios, scenario, messages, widgets, sending, conversationError, memoryBusy, memoryNotice, evaluation, canEvaluate, selectScenario, addScenario, send, clearMemory, runEvaluation, resetTranscript };
}
