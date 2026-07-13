"use client";

import { useCallback, useEffect, useState } from "react";
import { DATA_MODE } from "@/config/capabilities";
import { useAuth } from "@/modules/auth/auth-provider";
import { useWorkspace } from "@/modules/workspace/workspace-provider";
import { createRuntimeSession, getRuntimeMessages, getRuntimeSession, getRuntimeWidgets, getTestUserId, sendRuntimeMessage } from "./api";
import { DEMO_RUNTIME_WIDGETS } from "./fixtures";
import { sendRuntimeMessageStream, subscribeRuntimeEvents } from "./stream-api";
import type { PendingRuntimeAttachment, RuntimeAttachment, RuntimeMessage, RuntimeMessageOptions, RuntimeWidgetSpec } from "./types";
import { resolveRuntimeAttachments } from "./upload-api";

export function useRuntimeChat(agentId: number) {
  const { session } = useAuth();
  const { workspaceCode } = useWorkspace();
  const demo = DATA_MODE === "demo";
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<RuntimeMessage[]>([]);
  const [widgets, setWidgets] = useState<RuntimeWidgetSpec[]>(demo ? DEMO_RUNTIME_WIDGETS : []);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [edgeStatus, setEdgeStatus] = useState("");

  useEffect(() => {
    if (demo || !session?.apiKey) return;
    getRuntimeWidgets(session.apiKey, workspaceCode, agentId).then(setWidgets).catch(() => setWidgets([]));
  }, [agentId, demo, session?.apiKey, workspaceCode]);

  useEffect(() => {
    if (demo || !session?.apiKey || !sessionId) return;
    return subscribeRuntimeEvents(session.apiKey, workspaceCode, sessionId, { onEdgeStatus: (event) => setEdgeStatus(event.content), onError: () => setEdgeStatus("") });
  }, [demo, session?.apiKey, sessionId, workspaceCode]);

  const startSession = useCallback(async (): Promise<number | null> => {
    if (!session?.apiKey) return null;
    setLoading(true); setError(""); setNotice("");
    try {
      if (demo) { setSessionId(-1); setMessages([]); setNotice("演示 Runtime Session，不会写入后端"); return -1; }
      const testUserId = await getTestUserId(session.apiKey, workspaceCode, agentId);
      const created = await createRuntimeSession(session.apiKey, workspaceCode, agentId, testUserId || 1);
      setSessionId(created.id); setMessages([]); setNotice(`已创建 Runtime Session #${created.id}`); return created.id;
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "创建会话失败"); return null; }
    finally { setLoading(false); }
  }, [agentId, demo, session?.apiKey, workspaceCode]);

  const resumeSession = useCallback(async (id: number): Promise<boolean> => {
    if (!session?.apiKey || !Number.isFinite(id) || id <= 0) return false;
    setLoading(true); setError(""); setNotice("");
    try {
      if (demo) { setSessionId(-1); setMessages([]); setNotice(`演示模式不读取 Session #${id}`); return true; }
      const current = await getRuntimeSession(session.apiKey, workspaceCode, id);
      if (current.agent_id !== agentId) throw new Error("该 Session 不属于当前 Agent");
      const history = await getRuntimeMessages(session.apiKey, workspaceCode, id);
      setSessionId(id); setMessages(history); setNotice(`已恢复 Session #${id}`); return true;
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "恢复会话失败"); return false; }
    finally { setLoading(false); }
  }, [agentId, demo, session?.apiKey, workspaceCode]);

  const send = useCallback(async (content: string, pending: PendingRuntimeAttachment[] = [], metadata?: RuntimeMessageOptions["metadata"]): Promise<boolean> => {
    if (!session?.apiKey || sending) return false;
    setSending(true); setError(""); setEdgeStatus("");
    try {
      const activeSessionId = sessionId ?? await startSession();
      if (activeSessionId === null) return false;
      const attachments: RuntimeAttachment[] = demo ? pending.map(({ file: _file, ...attachment }) => { void _file; return attachment; }) : await resolveRuntimeAttachments(session.apiKey, workspaceCode, pending);
      const timestamp = Date.now();
      const userMessage: RuntimeMessage = { id: `user-${timestamp}`, uuid: `user-${timestamp}`, session_id: activeSessionId, role: "user", content, content_type: "text", attachments, created_at: new Date().toISOString() };
      const assistantId = `assistant-${timestamp}`;
      const assistant: RuntimeMessage = { id: assistantId, uuid: assistantId, session_id: activeSessionId, role: "assistant", content: "", content_type: "text", created_at: new Date().toISOString() };
      setMessages((current) => [...current, userMessage, assistant]);
      if (demo) {
        setMessages((current) => current.map((message) => message.id === assistantId ? { ...message, content: `这是演示 Runtime Chat 对“${content}”的本地回复。`, model: "demo-runtime" } : message));
        return true;
      }
      const options = { attachments, metadata };
      try {
        await sendRuntimeMessageStream(session.apiKey, workspaceCode, activeSessionId, content, options, {
          onChunk: (text) => setMessages((current) => current.map((message) => message.id === assistantId ? { ...message, content: message.content + text } : message)),
          onDone: (messageId, usage) => setMessages((current) => current.map((message) => message.id === assistantId ? { ...message, uuid: messageId, usage } : message)),
        });
      } catch {
        const response = await sendRuntimeMessage(session.apiKey, workspaceCode, activeSessionId, content, options);
        setMessages((current) => current.map((message) => message.id === assistantId ? { ...message, uuid: response.message_id, content: response.content, model: response.model, usage: response.usage, attachments: response.attachments, audio_url: response.audio_url, metadata: { docx_url: response.docx_url, image_url: response.image_url } } : message));
      }
      return true;
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "发送失败"); return false; }
    finally { setSending(false); setEdgeStatus(""); }
  }, [demo, sending, session?.apiKey, sessionId, startSession, workspaceCode]);

  return { demo, sessionId, messages, widgets, loading, sending, error, notice, edgeStatus, startSession, resumeSession, send, clearLocal: () => { setMessages([]); setError(""); } };
}
