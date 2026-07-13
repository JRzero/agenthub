"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowsClockwise, Copy, Cpu, Key } from "@phosphor-icons/react";
import { DATA_MODE } from "@/config/capabilities";
import type { Agent } from "@/modules/agents/types";
import { useAuth } from "@/modules/auth/auth-provider";
import { listLLMProviders, resetEdgeToken, type LLMProvider } from "./advanced-api";
import type { AgentBuildDraft } from "./types";

const DEMO_PROVIDERS: LLMProvider[] = [
  { name: "qwen", display_name: "通义千问", description: "系统配置的 Qwen Provider", model: "qwen-max", skip_temperature: false, capabilities: ["text", "tools"] },
  { name: "openai", display_name: "OpenAI", description: "系统配置的 OpenAI Provider", model: "gpt-4.1-mini", skip_temperature: false, capabilities: ["text", "vision", "tools"] },
  { name: "claude", display_name: "Claude", description: "系统配置的 Anthropic Provider", model: "claude-3-5-sonnet-20241022", skip_temperature: false, capabilities: ["text", "vision"] },
];

export function RuntimeCapabilitiesPanel({ agent, draft, onPatch, onAgentUpdated }: { agent: Agent; draft: AgentBuildDraft; onPatch: (patch: Partial<AgentBuildDraft>) => void; onAgentUpdated: (agent: Agent) => void }) {
  const { session } = useAuth();
  const demo = DATA_MODE === "demo";
  const providers = useQuery({ queryKey: ["llm-providers", demo], queryFn: () => demo ? Promise.resolve(DEMO_PROVIDERS) : listLLMProviders(session?.apiKey || ""), enabled: Boolean(session?.apiKey) && draft.agentType === "cloud" });
  const [copied, setCopied] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState("");

  if (draft.agentType === "edge") {
    const token = agent.edge_token || (demo ? "et_demo_agenthub_edge_token" : "");
    const reset = async () => {
      if (!session?.apiKey || !window.confirm("重置 Token 后，现有 Edge Proxy 连接将失效。确定继续？")) return;
      setResetting(true); setMessage("");
      try {
        const result = demo ? { edge_token: `et_demo_${Date.now()}` } : await resetEdgeToken(session.apiKey, agent.id);
        onAgentUpdated({ ...agent, edge_token: result.edge_token });
        setMessage("Edge Token 已重置，请立即更新本地代理配置。");
      } catch (error) { setMessage(error instanceof Error ? error.message : "Token 重置失败"); }
      finally { setResetting(false); }
    };
    return <div className="mt-6 rounded-xl border border-border bg-subtle p-5"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-primary-soft text-primary"><Key size={21} /></span><div><h3 className="font-semibold">Edge 连接凭证</h3><p className="mt-1 text-xs text-text-muted">用于 Edge Proxy 与当前 Agent 建立受控连接。</p></div></div><div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-surface p-3"><code className="min-w-0 flex-1 truncate">{token || "后端未返回 Token"}</code><button type="button" onClick={() => { if (!token) return; void navigator.clipboard.writeText(token); setCopied(true); window.setTimeout(() => setCopied(false), 1500); }} disabled={!token} className="rounded p-2 text-primary hover:bg-primary-soft" aria-label="复制 Edge Token"><Copy size={18} /></button></div>{copied && <p className="mt-2 text-xs text-success">已复制</p>}<button type="button" onClick={() => void reset()} disabled={resetting} className="button-secondary mt-4"><ArrowsClockwise size={17} />{resetting ? "重置中…" : "重置 Token"}</button>{message && <p className="mt-3 text-sm text-text-muted">{message}</p>}</div>;
  }

  const selected = (providers.data || []).find((provider) => provider.name === draft.llmProvider);
  return <div className="mt-6 rounded-xl border border-border bg-subtle p-5"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-primary-soft text-primary"><Cpu size={21} /></span><div><h3 className="font-semibold">系统 Provider 目录</h3><p className="mt-1 text-xs text-text-muted">复用后端 `/llm-providers` 列表；选择后自动带入默认模型。</p></div></div><label className="mt-4 block text-sm font-medium">Provider<select value={draft.llmProvider} onChange={(event) => { const provider = (providers.data || []).find((item) => item.name === event.target.value); onPatch({ llmProvider: event.target.value, ...(provider ? { llmModelName: provider.model, llmProviderType: "", llmBaseUrl: "" } : {}) }); }} className="mt-2 h-10 w-full rounded-md border border-border bg-surface px-3"><option value="">自定义 / 系统默认</option>{(providers.data || []).map((provider) => <option key={provider.name} value={provider.name}>{provider.display_name}</option>)}</select></label>{providers.isError && <p className="mt-2 text-sm text-danger">Provider 列表加载失败，可继续使用下方自定义配置。</p>}{selected && <div className="mt-4 rounded-lg border border-primary/20 bg-primary-soft p-4"><strong>{selected.display_name}</strong><p className="mt-1 text-sm text-text-muted">{selected.description}</p><p className="mt-2 text-xs text-text-muted">默认模型：{selected.model} · 能力：{selected.capabilities.join(" / ") || "未声明"}</p></div>}</div>;
}
