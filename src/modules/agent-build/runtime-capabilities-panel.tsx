"use client";

import { useState } from "react";
import { ArrowsClockwise, Copy, Key } from "@phosphor-icons/react";
import { DATA_MODE } from "@/config/capabilities";
import type { Agent } from "@/modules/agents/types";
import { useAuth } from "@/modules/auth/auth-provider";
import { resetEdgeToken } from "./advanced-api";
import type { AgentBuildDraft } from "./types";

export function RuntimeCapabilitiesPanel({ agent, draft, onAgentUpdated }: { agent: Agent; draft: AgentBuildDraft; onPatch: (patch: Partial<AgentBuildDraft>) => void; onAgentUpdated: (agent: Agent) => void }) {
  const { session } = useAuth();
  const demo = DATA_MODE === "demo";
  const [copied, setCopied] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState("");

  if (draft.agentType !== "edge") return null;

  const token = agent.edge_token || (demo ? "et_demo_agenthub_edge_token" : "");
  const reset = async () => {
    if (!session?.apiKey || !window.confirm("重置 Token 后，现有 Edge Proxy 连接将失效。确定继续？")) return;
    setResetting(true);
    setMessage("");
    try {
      const result = demo ? { edge_token: `et_demo_${Date.now()}` } : await resetEdgeToken(session.apiKey, agent.id);
      onAgentUpdated({ ...agent, edge_token: result.edge_token });
      setMessage("Edge Token 已重置，请立即更新本地代理配置。");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Token 重置失败");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="mt-6 rounded-xl border border-border bg-subtle p-5">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-lg bg-primary-soft text-primary"><Key size={21} /></span>
        <div>
          <h3 className="font-semibold">Edge 连接凭证</h3>
          <p className="mt-1 text-xs text-text-muted">用于 Edge Proxy 与当前 Agent 建立受控连接。</p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-surface p-3">
        <code className="min-w-0 flex-1 truncate">{token || "后端未返回 Token"}</code>
        <button
          type="button"
          onClick={() => {
            if (!token) return;
            void navigator.clipboard.writeText(token);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
          }}
          disabled={!token}
          className="rounded p-2 text-primary hover:bg-primary-soft"
          aria-label="复制 Edge Token"
        >
          <Copy size={18} />
        </button>
      </div>
      {copied && <p className="mt-2 text-xs text-success">已复制</p>}
      <button type="button" onClick={() => void reset()} disabled={resetting} className="button-secondary mt-4">
        <ArrowsClockwise size={17} />
        {resetting ? "重置中…" : "重置 Token"}
      </button>
      {message && <p className="mt-3 text-sm text-text-muted">{message}</p>}
    </div>
  );
}
