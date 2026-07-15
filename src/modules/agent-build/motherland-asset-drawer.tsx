"use client";

import { useEffect, useReducer, useState } from "react";
import { ArrowClockwise, CheckCircle, MagicWand, SpinnerGap, X } from "@phosphor-icons/react";
import { DATA_MODE } from "@/config/capabilities";
import type { Agent } from "@/modules/agents/types";
import { useAuth } from "@/modules/auth/auth-provider";
import { uploadAgentAvatar } from "./advanced-api";
import {
  generateAvatarPreview,
  generateCharacterSheet,
  generateCharacterSpec,
  saveCharacterDesign,
} from "./co-creation-api";
import { reduceMediaGenerationState, resolveGeneratedMediaUrl } from "./media-assets";
import type { MediaAsset, MediaAssetKind, MediaCandidate, MediaGenerationState } from "./media-assets";
import type { AgentBuildDraft } from "./types";

const KIND_COPY: Record<MediaAssetKind, { title: string; description: string; prompt: string }> = {
  avatar: {
    title: "生成 Agent 头像",
    description: "生成结果会先作为候选预览，确认后才替换当前头像。",
    prompt: "描述头像的发型、表情、服装、构图与画风",
  },
  "character-sheet": {
    title: "生成角色设定稿",
    description: "根据当前角色提示词生成视觉设定和角色图，确认后保存到 Agent。",
    prompt: "补充角色的外观、动作、配色和设定稿要求",
  },
  "comic-draft": {
    title: "生成漫画草稿",
    description: "围绕一个科普主题生成可继续编辑的漫画视觉草稿。",
    prompt: "输入漫画主题、场景、角色动作和画面风格",
  },
};

const STATE_COPY: Record<MediaGenerationState, string> = {
  idle: "待生成",
  generating: "生成中",
  "pending-confirmation": "待确认",
  confirming: "保存中",
  saved: "已保存",
  failed: "生成失败",
};

export function MotherlandAssetDrawer({
  kind,
  agent,
  draft,
  onClose,
  onAgentUpdated,
  onDemoAssetCreated,
}: {
  kind: MediaAssetKind | null;
  agent: Agent;
  draft: AgentBuildDraft;
  onClose: () => void;
  onAgentUpdated: (agent: Agent) => void;
  onDemoAssetCreated: (asset: MediaAsset) => void;
}) {
  const { session } = useAuth();
  const demo = DATA_MODE === "demo";
  const [prompt, setPrompt] = useState("");
  const [candidate, setCandidate] = useState<MediaCandidate | null>(null);
  const [state, dispatch] = useReducer(reduceMediaGenerationState, "idle");
  const [error, setError] = useState("");
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setPrompt("");
    setCandidate(null);
    dispatch("reset");
    setError("");
    setImageFailed(false);
  }, [kind]);

  if (!kind) return null;
  const copy = KIND_COPY[kind];
  const busy = state === "generating" || state === "confirming";
  const candidatePreviewUrl = candidate ? resolveGeneratedMediaUrl(candidate.url, candidate.kind) : "";

  const generate = async () => {
    const value = prompt.trim();
    if (!value || (!demo && !session?.apiKey)) return;
    dispatch("start");
    setError("");
    try {
      let url = "/images/lin-yue-avatar.png";
      let specText = "";
      if (!demo && session?.apiKey) {
        if (kind === "avatar") {
          url = (await generateAvatarPreview(session.apiKey, agent.id, value)).image_url;
        } else if (kind === "character-sheet") {
          specText = (await generateCharacterSpec(
            session.apiKey,
            agent.id,
            `${draft.systemPrompt}\n\n视觉补充：${value}`,
          )).spec_text;
          url = (await generateCharacterSheet(session.apiKey, agent.id, specText)).image_url;
        } else {
          throw new Error("漫画草稿后端能力尚未接入");
        }
      } else if (kind === "character-sheet") {
        specText = `${agent.name} 角色视觉设定\n${value}\n${draft.systemPrompt.slice(0, 240)}`;
      }
      setCandidate({ kind, url, prompt: value, specText, state: "pending-confirmation", demoOnly: demo });
      setImageFailed(false);
      dispatch("generated");
    } catch (requestError) {
      dispatch("failed");
      setError(requestError instanceof Error ? requestError.message : "生成失败，请重试");
    }
  };

  const confirm = async () => {
    if (!candidate || (!demo && !session?.apiKey)) return;
    dispatch("confirm");
    setError("");
    try {
      if (kind === "avatar") {
        if (demo) {
          onAgentUpdated({
            ...agent,
            config: {
              ...agent.config,
              metadata: { ...agent.config?.metadata, avatar: candidate.url },
            },
            updated_at: new Date().toISOString(),
          });
        } else if (session?.apiKey) {
          const response = await fetch(resolveGeneratedMediaUrl(candidate.url, candidate.kind));
          if (!response.ok) throw new Error("无法读取生成的头像");
          onAgentUpdated(await uploadAgentAvatar(session.apiKey, agent.id, await response.blob()));
        }
      } else if (kind === "character-sheet") {
        const specText = candidate.specText || candidate.prompt;
        if (demo) {
          onAgentUpdated({
            ...agent,
            config: {
              ...agent.config,
              metadata: {
                ...agent.config?.metadata,
                character_design_spec: specText,
                character_design_sheet: candidate.url,
              },
            },
            updated_at: new Date().toISOString(),
          });
        } else if (session?.apiKey) {
          onAgentUpdated(await saveCharacterDesign(session.apiKey, agent.id, specText, candidate.url));
        }
      }

      const savedAsset: MediaAsset = {
        id: `${demo ? "demo" : "saved"}-${kind}-${Date.now()}`,
        kind,
        name: kind === "avatar" ? `${agent.name} 当前头像` : kind === "character-sheet" ? `${agent.name} 角色设定稿` : candidate.prompt,
        url: candidate.url,
        status: "saved",
        specText: kind === "character-sheet" ? candidate.specText : undefined,
        version: demo ? "演示" : `v${agent.version}`,
        createdAt: new Date().toISOString(),
        demoOnly: demo,
      };
      if (demo || kind === "comic-draft") onDemoAssetCreated(savedAsset);
      setCandidate({ ...candidate, state: "saved" });
      dispatch("confirmed");
    } catch (requestError) {
      dispatch("failed");
      setError(requestError instanceof Error ? requestError.message : "保存失败，请重试");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/30" onMouseDown={() => { if (!busy) onClose(); }}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="motherland-drawer-title"
        onMouseDown={(event) => event.stopPropagation()}
        className="ml-auto flex h-full w-full max-w-lg flex-col overflow-hidden bg-surface shadow-2xl"
      >
        <header className="shrink-0 border-b border-border px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-lg bg-primary-soft text-primary"><MagicWand size={19} /></span>
              <div>
                <h2 id="motherland-drawer-title" className="font-semibold">{copy.title}</h2>
                <p className="mt-0.5 text-xs text-text-muted">Motherland · {STATE_COPY[state]}</p>
              </div>
            </div>
            <button type="button" onClick={onClose} disabled={busy} aria-label="关闭 Motherland 生成" className="rounded-md p-2 text-text-muted hover:bg-subtle disabled:opacity-40">
              <X size={19} />
            </button>
          </div>
          <p className="mt-3 text-sm leading-5 text-text-muted">{copy.description}</p>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden p-5">
          <label className="block text-sm font-medium">
            生成要求
            <textarea
              autoFocus
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={4}
              placeholder={copy.prompt}
              disabled={busy}
              className="mt-2 w-full resize-none rounded-lg border border-border bg-surface p-3 leading-6 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:opacity-60"
            />
          </label>

          {!candidate && (
            <div className="rounded-xl border border-dashed border-border bg-subtle px-5 py-8 text-center">
              {state === "generating" ? (
                <><SpinnerGap size={28} className="mx-auto animate-spin text-primary" /><p className="mt-3 text-sm font-medium">Motherland 正在生成候选素材</p></>
              ) : (
                <><MagicWand size={28} className="mx-auto text-primary" /><p className="mt-3 text-sm font-medium">候选素材会先在这里预览</p><p className="mt-1 text-xs text-text-muted">未确认前不会影响当前 Agent</p></>
              )}
            </div>
          )}

          {candidate && (
            <div className="min-h-0 overflow-hidden rounded-xl border border-border bg-subtle">
              {imageFailed ? (
                <div className="grid min-h-[220px] place-items-center px-5 py-8 text-center">
                  <div>
                    <MagicWand size={28} className="mx-auto text-text-muted" />
                    <p className="mt-3 text-sm font-medium text-text-primary">{"\u5019\u9009\u56fe\u7247\u52a0\u8f7d\u5931\u8d25"}</p>
                    <p className="mt-1 text-xs text-text-muted">{"\u8bf7\u91cd\u65b0\u751f\u6210\uff0c\u6216\u68c0\u67e5\u540e\u7aef\u8fd4\u56de\u7684\u56fe\u7247\u5730\u5740\u3002"}</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={candidatePreviewUrl} alt="Motherland generated candidate" onError={() => setImageFailed(true)} className="max-h-[320px] w-full object-contain" />
                </>
              )}
              <div className="flex items-center justify-between gap-3 border-t border-border bg-surface px-4 py-3">
                <span className={`status-badge ${state === "saved" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                  {state === "saved" ? "已确认保存" : "候选 · 待确认"}
                </span>
                {candidate.demoOnly && <span className="text-xs text-text-muted">仅演示会话</span>}
              </div>
            </div>
          )}

          {error && (
            <div role="alert" className="rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm leading-6 text-danger">
              {error}
            </div>
          )}
        </div>

        <footer className="shrink-0 flex flex-wrap justify-end gap-3 border-t border-border px-5 py-4">
          <button type="button" onClick={onClose} disabled={busy} className="button-secondary">取消</button>
          <button type="button" onClick={() => void generate()} disabled={!prompt.trim() || busy} className="button-secondary">
            {state === "generating" ? <SpinnerGap size={17} className="animate-spin" /> : state === "failed" ? <ArrowClockwise size={17} /> : <MagicWand size={17} />}
            {state === "failed" ? "重新生成" : "生成候选"}
          </button>
          {candidate && state !== "saved" && (
            <button type="button" onClick={() => void confirm()} disabled={busy || imageFailed} className="button-primary">
              {state === "confirming" ? <SpinnerGap size={17} className="animate-spin" /> : <CheckCircle size={17} />}
              {state === "confirming" ? "保存中…" : "确认使用"}
            </button>
          )}
          {state === "saved" && <button type="button" onClick={onClose} className="button-primary"><CheckCircle size={17} />完成</button>}
        </footer>
      </aside>
    </div>
  );
}
