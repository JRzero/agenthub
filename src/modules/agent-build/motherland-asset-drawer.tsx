"use client";

import { useEffect, useReducer, useState } from "react";
import { ArrowClockwise, ArrowSquareOut, CheckCircle, MagicWand, SpinnerGap, X } from "@phosphor-icons/react";
import { DATA_MODE } from "@/config/capabilities";
import type { Agent } from "@/modules/agents/types";
import { useAuth } from "@/modules/auth/auth-provider";
import { ApiError } from "@/shared/api/http-client";
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
    description: "先生成可编辑的角色设定正文，再生成漫画设计稿图；确认后保存到 Agent。",
    prompt: "角色视觉设定正文",
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

export function AvatarCandidatePreview({
  src,
  failed,
  onError,
}: {
  src: string;
  failed: boolean;
  onError: () => void;
}) {
  return (
    <div
      data-testid="avatar-candidate-preview"
      className="flex h-[clamp(14rem,52dvh,40rem)] w-full items-center justify-center overflow-hidden bg-slate-950/40"
    >
      {failed ? (
        <div className="grid h-full w-full place-items-center px-5 py-8 text-center">
          <div>
            <MagicWand size={28} className="mx-auto text-text-muted" />
            <p className="mt-3 text-sm font-medium text-text-primary">候选图片加载失败</p>
            <p className="mt-1 text-xs text-text-muted">请重新生成，或检查后端返回的图片地址。</p>
          </div>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          data-testid="avatar-candidate-image"
          src={src}
          alt="Motherland generated candidate"
          onError={onError}
          className="block h-full w-full object-contain"
        />
      )}
    </div>
  );
}

export function MotherlandAssetDrawer({
  kind,
  agent,
  draft,
  onClose,
  onAgentUpdated,
  onDemoAssetCreated,
  onDraftConflict,
}: {
  kind: MediaAssetKind | null;
  agent: Agent;
  draft: AgentBuildDraft;
  onClose: () => void;
  onAgentUpdated: (agent: Agent) => void;
  onDemoAssetCreated: (asset: MediaAsset) => void;
  onDraftConflict: () => Promise<void>;
}) {
  const { session } = useAuth();
  const demo = DATA_MODE === "demo";
  const [prompt, setPrompt] = useState("");
  const [characterSpec, setCharacterSpec] = useState("");
  const [candidate, setCandidate] = useState<MediaCandidate | null>(null);
  const [state, dispatch] = useReducer(reduceMediaGenerationState, "idle");
  const [error, setError] = useState("");
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setPrompt("");
    setCharacterSpec(kind === "character-sheet" ? agent.config?.metadata?.character_design_spec || "" : "");
    setCandidate(null);
    dispatch("reset");
    setError("");
    setImageFailed(false);
  }, [agent.config?.metadata?.character_design_spec, kind]);

  if (!kind) return null;
  const copy = KIND_COPY[kind];
  const busy = state === "generating" || state === "confirming";
  const candidatePreviewUrl = candidate ? resolveGeneratedMediaUrl(candidate.url, candidate.kind) : "";
  const isCharacterSheet = kind === "character-sheet";

  const generate = async () => {
    const value = prompt.trim();
    if ((!value && kind !== "character-sheet") || (!demo && !session?.apiKey)) return;
    dispatch("start");
    setError("");
    try {
      let url = "/images/lin-yue-avatar.png";
      if (!demo && session?.apiKey) {
        if (kind === "avatar") {
          url = (await generateAvatarPreview(session.apiKey, agent.id, value)).image_url;
        } else if (kind === "comic-draft") {
          throw new Error("漫画草稿后端能力尚未接入");
        }
      }
      setCandidate({ kind, url, prompt: value, state: "pending-confirmation", demoOnly: demo });
      setImageFailed(false);
      dispatch("generated");
    } catch (requestError) {
      dispatch("failed");
      setError(requestError instanceof Error ? requestError.message : "生成失败，请重试");
    }
  };

  const generateSpec = async () => {
    if (!demo && !session?.apiKey) return;
    dispatch("start");
    setError("");
    try {
      const basePrompt = draft.systemPrompt.trim();
      const specText = demo
        ? `角色名称：${agent.name}\n视觉基调：沉静、可信、具有清晰边界。\n角色依据：${basePrompt.slice(0, 240)}`
        : (await generateCharacterSpec(session!.apiKey, agent.id, basePrompt)).spec_text;
      setCharacterSpec(specText);
      setCandidate(null);
      setImageFailed(false);
      dispatch("reset");
    } catch (requestError) {
      dispatch("failed");
      setError(requestError instanceof Error ? requestError.message : "设定稿生成失败");
    }
  };

  const generateSheet = async () => {
    const specText = characterSpec.trim();
    if (!specText || (!demo && !session?.apiKey)) return;
    dispatch("start");
    setError("");
    try {
      const url = demo
        ? "/images/lin-yue-avatar.png"
        : (await generateCharacterSheet(session!.apiKey, agent.id, specText)).image_url;
      setCandidate({ kind: "character-sheet", url, prompt: specText.slice(0, 120), specText, state: "pending-confirmation", demoOnly: demo });
      setImageFailed(false);
      dispatch("generated");
    } catch (requestError) {
      dispatch("failed");
      setError(requestError instanceof Error ? requestError.message : "设计稿生成失败");
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
          if (!agent.draft_revision) throw new Error("草稿版本缺失，请刷新页面后重试");
          onAgentUpdated(
            await uploadAgentAvatar(
              session.apiKey,
              agent.id,
              await response.blob(),
              agent.draft_revision,
            ),
          );
        }
      } else if (kind === "character-sheet") {
        const specText = candidate.specText || characterSpec.trim() || candidate.prompt;
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
          if (!agent.draft_revision) throw new Error("草稿版本缺失，请刷新页面后重试");
          onAgentUpdated(
            await saveCharacterDesign(
              session.apiKey,
              agent.id,
              specText,
              candidate.url,
              agent.draft_revision,
            ),
          );
        }
      }

      const savedAsset: MediaAsset = {
        id: `${demo ? "demo" : "saved"}-${kind}-${Date.now()}`,
        kind,
        name: kind === "avatar" ? `${agent.name} 当前头像` : kind === "character-sheet" ? `${agent.name} 角色设定稿` : candidate.prompt,
        url: candidate.url,
        status: "saved",
        specText: kind === "character-sheet" ? candidate.specText || characterSpec.trim() : undefined,
        version: demo ? "演示" : `v${agent.version}`,
        createdAt: new Date().toISOString(),
        demoOnly: demo,
      };
      if (demo || kind === "comic-draft") onDemoAssetCreated(savedAsset);
      setCandidate({ ...candidate, state: "saved" });
      dispatch("confirmed");
    } catch (requestError) {
      dispatch("failed");
      if (
        requestError instanceof ApiError &&
        requestError.code === "DRAFT_CONFLICT"
      ) {
        await onDraftConflict();
        setError("草稿已被其他操作更新，已刷新最新状态，请重新确认该素材。");
      } else {
        setError(requestError instanceof Error ? requestError.message : "保存失败，请重试");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/30" onMouseDown={() => { if (!busy) onClose(); }}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="motherland-drawer-title"
        onMouseDown={(event) => event.stopPropagation()}
        className="ml-auto grid h-full max-h-full w-full max-w-xl grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden bg-surface shadow-2xl"
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

        <div
          data-testid="motherland-drawer-scroll"
          className="flex min-h-0 flex-col gap-4 overflow-y-scroll overscroll-contain p-5 [scrollbar-gutter:stable]"
        >
          {isCharacterSheet ? (
            <>
              <label className="block text-sm font-medium">
                角色设定稿（可编辑）
                <textarea
                  autoFocus
                  value={characterSpec}
                  onChange={(event) => {
                    setCharacterSpec(event.target.value);
                    if (candidate) setCandidate(null);
                  }}
                  rows={8}
                  placeholder={copy.prompt}
                  disabled={busy}
                  className="mt-2 min-h-44 max-h-[45dvh] w-full resize-y rounded-lg border border-border bg-surface p-3 leading-6 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:opacity-60"
                />
              </label>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={() => void generateSpec()} disabled={busy} className="button-secondary">
                  {state === "generating" && !candidate ? <SpinnerGap size={17} className="animate-spin" /> : <MagicWand size={17} />}
                  生成设定稿
                </button>
                <button type="button" onClick={() => void generateSheet()} disabled={!characterSpec.trim() || busy} className="button-secondary">
                  {state === "generating" && candidate ? <SpinnerGap size={17} className="animate-spin" /> : <MagicWand size={17} />}
                  生成漫画设计稿图
                </button>
              </div>
            </>
          ) : (
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
          )}

          {!candidate && (
            <div className="rounded-xl border border-dashed border-border bg-subtle px-5 py-8 text-center">
              {state === "generating" ? (
                <><SpinnerGap size={28} className="mx-auto animate-spin text-primary" /><p className="mt-3 text-sm font-medium">Motherland 正在生成</p></>
              ) : (
                <><MagicWand size={28} className="mx-auto text-primary" /><p className="mt-3 text-sm font-medium">候选素材会先在这里预览</p><p className="mt-1 text-xs text-text-muted">未确认前不会影响当前 Agent</p></>
              )}
            </div>
          )}

          {candidate && (
            <div className="shrink-0 overflow-hidden rounded-xl border border-border bg-subtle">
              {kind === "avatar" ? (
                <AvatarCandidatePreview
                  src={candidatePreviewUrl}
                  failed={imageFailed}
                  onError={() => setImageFailed(true)}
                />
              ) : imageFailed ? (
                <div className="grid min-h-[220px] place-items-center px-5 py-8 text-center">
                  <div>
                    <MagicWand size={28} className="mx-auto text-text-muted" />
                    <p className="mt-3 text-sm font-medium text-text-primary">候选图片加载失败</p>
                    <p className="mt-1 text-xs text-text-muted">请重新生成，或检查后端返回的图片地址。</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={candidatePreviewUrl}
                    alt="Motherland generated candidate"
                    onError={() => setImageFailed(true)}
                    className="block h-auto w-full bg-surface object-contain"
                  />
                </>
              )}
              <div className="flex items-center justify-between gap-3 border-t border-border bg-surface px-4 py-3">
                <span className={`status-badge ${state === "saved" ? "status-success" : "status-warning"}`}>
                  {state === "saved" ? "已确认保存" : "候选 · 待确认"}
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href={candidatePreviewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    查看原图
                    <ArrowSquareOut size={13} />
                  </a>
                  {candidate.demoOnly && <span className="text-xs text-text-muted">仅演示会话</span>}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div role="alert" className="rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm leading-6 text-danger">
              {error}
            </div>
          )}
        </div>

        <footer className="relative z-10 flex shrink-0 flex-wrap justify-end gap-3 border-t border-border bg-surface px-5 py-4 shadow-[0_-8px_20px_rgba(15,23,42,0.06)]">
          <button type="button" onClick={onClose} disabled={busy} className="button-secondary">取消</button>
          {!isCharacterSheet && (
            <button type="button" onClick={() => void generate()} disabled={!prompt.trim() || busy} className="button-secondary">
              {state === "generating" ? <SpinnerGap size={17} className="animate-spin" /> : state === "failed" ? <ArrowClockwise size={17} /> : <MagicWand size={17} />}
              {state === "failed" ? "重新生成" : "生成候选"}
            </button>
          )}
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
