"use client";

import Link from "next/link";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle,
  CircleNotch,
  FloppyDisk,
  Image as ImageIcon,
  MagicWand,
  MagnifyingGlass,
  UploadSimple,
  X,
} from "@phosphor-icons/react";
import { capabilitySource } from "@/config/capabilities";
import { useAuth } from "@/modules/auth/auth-provider";
import { listCreatorSkills } from "@/modules/resources/api";
import { listStageSkills } from "@/modules/agent-build/advanced-api";
import { resolveGeneratedMediaUrl } from "@/modules/agent-build/media-assets";
import { getAgent } from "@/modules/agents/api";
import type { Agent } from "@/modules/agents/types";
import type { CreatorSkill } from "@/modules/resources/types";
import { useWorkspace } from "@/modules/workspace/workspace-provider";
import { createAgentReducer, canOpenStep, shouldProtectExit, validateBasicRole } from "./reducer";
import { createDemoBasicContent, DEMO_AVATAR_CANDIDATES, DEMO_CREATOR_SKILLS, DEMO_SHEET_CANDIDATE } from "./demo";
import {
  INITIAL_CREATE_AGENT_STATE,
  type BasicRoleContent,
  type CreateAgentState,
  type CreateStep,
  type ImageCandidate,
} from "./types";
import { loadDemoCreateDraft, saveDemoCreateDraft } from "./storage";
import {
  confirmAvatarCandidate,
  confirmCharacterSheetCandidate,
  completeAgentCreation,
  generateAvatarCandidate,
  generateBasicProfile,
  generateCharacterSheetCandidate,
  getAgentCreationProgress,
  mapAgentToBasicRoleContent,
  regenerateBasicRoleContent,
  saveBasicRoleContent,
  saveGuidedCreationSkills,
} from "./api";

const PERSONALITY_OPTIONS = ["温和", "理性", "活泼", "幽默", "耐心", "专业", "简洁", "有同理心"];
const STEP_ORDER: Array<Exclude<CreateStep, "complete">> = ["basic", "avatar", "character-sheet", "skills"];
const STEP_COPY = {
  basic: { index: 1, title: "基础设定", helper: "填写名称和角色信息，生成可编辑的角色初稿。" },
  avatar: { index: 2, title: "创建头像", helper: "从候选、素材或上传图片中确认 Agent 头像。" },
  "character-sheet": { index: 3, title: "角色设定稿", helper: "确认角色外观、表情、动作与配色规范。" },
  skills: { index: 4, title: "配置技能", helper: "从当前 Workspace 资源库选择技能。", optional: true },
} as const;

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function restoredCreationState(agent: Agent, progress: Awaited<ReturnType<typeof getAgentCreationProgress>>, selectedSkillIds: number[]): CreateAgentState {
  const metadata = agent.config?.metadata;
  const input = metadata?.guided_creation_input;
  const basic = mapAgentToBasicRoleContent(agent);
  const avatar = progress.steps.avatar && metadata?.avatar ? {
    id: `saved-avatar-${agent.id}`,
    url: resolveGeneratedMediaUrl(metadata.avatar, "avatar"),
    sourceUrl: metadata.avatar,
    alt: `${agent.name} 的已确认头像`,
  } : null;
  const sheet = progress.steps.character_sheet && metadata?.character_design_sheet ? {
    id: `saved-sheet-${agent.id}`,
    url: resolveGeneratedMediaUrl(metadata.character_design_sheet, "character-sheet"),
    sourceUrl: metadata.character_design_sheet,
    specText: metadata.character_design_spec,
    alt: `${agent.name} 的已确认角色设定稿`,
  } : null;
  const step: CreateStep = progress.creation_completed
    ? "complete"
    : progress.current_step === "character_sheet"
      ? "character-sheet"
      : progress.current_step;
  return {
    ...INITIAL_CREATE_AGENT_STATE,
    lifecycle: progress.creation_completed ? "complete" : "creating",
    step,
    agentId: agent.id,
    draftRevision: progress.draft_revision,
    input: {
      name: agent.name,
      identity: input?.role_identity || "",
      relationship: input?.user_relationship || "",
      primaryInteraction: input?.primary_interactions || "",
      personalityTags: input?.personality_tags || [],
    },
    basicCandidate: basic,
    confirmedBasic: basic,
    avatarCandidates: avatar ? [avatar] : [],
    selectedAvatarId: avatar?.id || null,
    confirmedAvatar: avatar,
    sheetCandidate: sheet,
    confirmedSheet: sheet,
    selectedSkillIds,
    saveState: "saved",
  };
}

function stepComplete(state: CreateAgentState, step: Exclude<CreateStep, "complete">): boolean {
  if (step === "basic") return Boolean(state.confirmedBasic);
  if (step === "avatar") return Boolean(state.confirmedAvatar && state.avatarFreshness === "current");
  if (step === "character-sheet") return Boolean(state.confirmedSheet && state.sheetFreshness === "current");
  return state.lifecycle === "complete";
}

function CandidateImage({
  candidate,
  className = "",
  fit = "cover",
}: {
  candidate: ImageCandidate;
  className?: string;
  fit?: "cover" | "contain";
}) {
  return (
    // Demo and backend candidate URLs are dynamic and intentionally bypass Next image optimization.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={candidate.url}
      alt={candidate.alt}
      className={`h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"} ${className}`}
    />
  );
}

function ProgressRail({ state, onStep }: { state: CreateAgentState; onStep: (step: Exclude<CreateStep, "complete">) => void }) {
  return (
    <aside className="min-h-0 border-r border-border bg-surface px-4 py-5" aria-label="创建进度">
      <p className="px-2 text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">创建进度</p>
      <ol className="mt-4 space-y-2">
        {STEP_ORDER.map((step) => {
          const copy = STEP_COPY[step];
          const active = state.step === step;
          const done = stepComplete(state, step);
          const enabled = canOpenStep(state, step);
          return (
            <li key={step}>
              <button type="button" disabled={!enabled} onClick={() => onStep(step)} className={`flex min-h-14 w-full items-center gap-3 rounded-lg px-3 text-left transition ${active ? "bg-primary-soft text-primary" : enabled ? "hover:bg-subtle" : "cursor-not-allowed text-text-muted"}`}>
                <span className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold ${done ? "bg-emerald-500 text-white" : active ? "bg-primary text-white" : "border border-border bg-surface"}`}>{done ? <Check size={15} weight="bold" /> : copy.index}</span>
                <span className="min-w-0"><strong className="block text-sm">{copy.title}</strong>{"optional" in copy && copy.optional ? <span className="text-xs text-text-muted">可跳过</span> : null}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <div className="mt-6 rounded-lg bg-subtle px-3 py-3 text-xs leading-5 text-text-muted">
        {state.lifecycle === "before-draft" ? "基础设定生成成功后才会建立创建中草稿。" : state.saveState === "saving" ? "正在保存当前草稿…" : state.saveState === "error" || state.saveState === "conflict" ? "当前更改尚未保存。" : "创建结果确认后自动保存。"}
      </div>
    </aside>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? <span className="mt-1 block text-xs text-danger">{message}</span> : null;
}

function BasicInputStep({ state, dispatch, errors }: { state: CreateAgentState; dispatch: React.Dispatch<Parameters<typeof createAgentReducer>[1]>; errors: Record<string, string> }) {
  const [customPersonalityTag, setCustomPersonalityTag] = useState("");
  const inputClass = "mt-1.5 h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";
  const customPersonalityTags = state.input.personalityTags.filter((tag) => !PERSONALITY_OPTIONS.includes(tag));
  const normalizedCustomTag = customPersonalityTag.trim();
  const canAddCustomTag = Boolean(
    normalizedCustomTag &&
      state.input.personalityTags.length < 4 &&
      !state.input.personalityTags.includes(normalizedCustomTag),
  );

  const removePersonalityTag = (tag: string) => {
    dispatch({
      type: "patch-input",
      patch: { personalityTags: state.input.personalityTags.filter((item) => item !== tag) },
    });
  };

  const addCustomPersonalityTag = () => {
    if (!canAddCustomTag) return;
    dispatch({
      type: "patch-input",
      patch: { personalityTags: [...state.input.personalityTags, normalizedCustomTag] },
    });
    setCustomPersonalityTag("");
  };

  return (
    <div className="grid gap-x-5 gap-y-3 sm:grid-cols-2">
      <label className="text-sm font-medium">Agent 名称 <span className="text-danger">*</span><input autoFocus maxLength={50} value={state.input.name} onChange={(event) => dispatch({ type: "patch-input", patch: { name: event.target.value } })} placeholder="例如：暖屿" className={inputClass} /><FieldError message={errors.name} /></label>
      <label className="text-sm font-medium">角色是谁 <span className="text-danger">*</span><input maxLength={80} value={state.input.identity} onChange={(event) => dispatch({ type: "patch-input", patch: { identity: event.target.value } })} placeholder="例如：温柔清醒的心理陪伴员" className={inputClass} /><FieldError message={errors.identity} /></label>
      <label className="text-sm font-medium">与用户的关系 <span className="text-danger">*</span><input maxLength={50} value={state.input.relationship} onChange={(event) => dispatch({ type: "patch-input", patch: { relationship: event.target.value } })} placeholder="例如：愿意倾听和陪伴的朋友" className={inputClass} /><FieldError message={errors.relationship} /></label>
      <label className="text-sm font-medium">主要互动 <span className="font-normal text-text-muted">选填</span><input maxLength={100} value={state.input.primaryInteraction} onChange={(event) => dispatch({ type: "patch-input", patch: { primaryInteraction: event.target.value } })} placeholder="例如：梳理情绪、温和提问" className={inputClass} /><FieldError message={errors.primaryInteraction} /></label>
      <fieldset className="sm:col-span-2">
        <legend className="text-sm font-medium">
          性格与表达 <span className="font-normal text-text-muted">可选择或自己填写，最多 4 个</span>
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {PERSONALITY_OPTIONS.map((tag) => {
            const selected = state.input.personalityTags.includes(tag);
            return (
              <button
                type="button"
                key={tag}
                aria-pressed={selected}
                onClick={() => {
                  if (selected) {
                    removePersonalityTag(tag);
                    return;
                  }
                  if (state.input.personalityTags.length < 4) {
                    dispatch({ type: "patch-input", patch: { personalityTags: [...state.input.personalityTags, tag] } });
                  }
                }}
                className={`rounded-full border px-3 py-1.5 text-xs transition ${selected ? "border-primary bg-primary-soft text-primary" : "border-border hover:border-primary/50"}`}
              >
                {tag}
              </button>
            );
          })}
          {customPersonalityTags.map((tag) => (
            <button
              type="button"
              key={tag}
              onClick={() => removePersonalityTag(tag)}
              aria-label={`移除自定义标签 ${tag}`}
              className="inline-flex items-center gap-1 rounded-full border border-primary bg-primary-soft px-3 py-1.5 text-xs text-primary transition hover:bg-primary/10"
            >
              {tag}
              <X size={12} weight="bold" aria-hidden="true" />
            </button>
          ))}
          <div className="inline-flex h-9 w-[220px] max-w-full">
            <input
              value={customPersonalityTag}
              onChange={(event) => setCustomPersonalityTag(event.target.value)}
              onKeyDown={(event) => {
                if (event.key !== "Enter") return;
                event.preventDefault();
                addCustomPersonalityTag();
              }}
              placeholder="输入后按 Enter"
              aria-label="自定义性格与表达"
              className="h-9 min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>
        </div>
        <FieldError message={errors.personalityTags} />
      </fieldset>
    </div>
  );
}

function GeneratedBasicReview({ state, dispatch }: { state: CreateAgentState; dispatch: React.Dispatch<Parameters<typeof createAgentReducer>[1]> }) {
  const candidate = state.basicCandidate as BasicRoleContent;
  return (
    <div className="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)_auto] gap-3">
      <label className="text-sm font-medium">Agent 简介<textarea value={candidate.description} maxLength={240} onChange={(event) => dispatch({ type: "edit-basic-candidate", patch: { description: event.target.value } })} rows={2} className="mt-1.5 w-full resize-none rounded-lg border border-border px-3 py-2 text-sm leading-6 outline-none focus:border-primary" /></label>
      <label className="flex min-h-0 flex-col text-sm font-medium">角色系统提示词 <span className="ml-1 font-normal text-text-muted">{candidate.systemPrompt.length}/8000</span><textarea value={candidate.systemPrompt} maxLength={8000} onChange={(event) => dispatch({ type: "edit-basic-candidate", patch: { systemPrompt: event.target.value } })} className="mt-1.5 min-h-0 flex-1 resize-none rounded-lg border border-border px-3 py-2 text-sm leading-6 outline-none focus:border-primary" /></label>
      <details className="rounded-lg border border-border px-4 py-2.5"><summary className="cursor-pointer text-sm font-medium">开场白与 3 条示例对话</summary><div className="mt-3 max-h-36 space-y-2 overflow-y-auto pr-2 text-xs leading-5 text-text-muted"><p><strong className="text-text">开场白：</strong>{candidate.opening}</p>{candidate.examples.map((item, index) => <p key={index}><strong className="text-text">示例 {index + 1}：</strong>{item.user} / {item.assistant}</p>)}</div></details>
    </div>
  );
}

function AvatarStep({ state, dispatch, onGenerate, generating, fileInput }: { state: CreateAgentState; dispatch: React.Dispatch<Parameters<typeof createAgentReducer>[1]>; onGenerate: () => void; generating: boolean; fileInput: React.RefObject<HTMLInputElement | null> }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between gap-4 rounded-lg bg-subtle px-4 py-3 text-sm"><span><strong>{state.input.name}</strong> · {state.input.identity}</span>{state.avatarFreshness === "stale" ? <span className="status-badge status-warning">待更新</span> : null}</div>
      <div className="mt-4 flex min-h-0 flex-1 justify-center">
        {state.avatarCandidates.length ? state.avatarCandidates.map((candidate) => { const selected = candidate.id === state.selectedAvatarId; return <button key={candidate.id} type="button" onClick={() => dispatch({ type: "select-avatar", candidateId: candidate.id })} className={`relative aspect-square h-full max-h-[420px] w-full max-w-[420px] overflow-hidden rounded-xl border-2 bg-subtle transition ${selected ? "border-primary ring-2 ring-primary/15" : "border-transparent hover:border-primary/40"}`}><CandidateImage candidate={candidate} /><span className={`absolute right-2 top-2 grid size-6 place-items-center rounded-full ${selected ? "bg-primary text-white" : "bg-white/90 text-transparent"}`}><Check size={14} weight="bold" /></span></button>; }) : <div className="grid min-h-64 w-full place-items-center rounded-xl border border-dashed border-border text-center text-sm text-text-muted"><div><ImageIcon size={32} className="mx-auto text-primary" /><p className="mt-2">生成后在这里预览头像候选</p></div></div>}
      </div>
      <div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={onGenerate} disabled={generating} className="button-secondary"><MagicWand size={17} />{generating ? "正在生成…" : state.avatarCandidates.length ? "重新生成" : "生成头像候选"}</button><button type="button" onClick={() => fileInput.current?.click()} className="button-secondary"><UploadSimple size={17} />上传图片</button><button type="button" disabled title="媒体素材库接口尚未接入" className="button-secondary opacity-50"><ImageIcon size={17} />从素材选择</button><input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.addEventListener("load", () => { if (typeof reader.result !== "string") return; dispatch({ type: "set-upload-candidate", candidate: { id: `upload-${file.name}-${file.lastModified}`, url: reader.result, alt: `上传的头像 ${file.name}` } }); }); reader.readAsDataURL(file); event.target.value = ""; }} /></div>
    </div>
  );
}

function CharacterSheetStep({ state, onGenerate, generating }: { state: CreateAgentState; onGenerate: () => void; generating: boolean }) {
  const candidate = state.sheetCandidate;
  const [largePreviewOpen, setLargePreviewOpen] = useState(false);

  useEffect(() => {
    if (!largePreviewOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLargePreviewOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [largePreviewOpen]);

  return (
    <>
      <div className="mx-auto flex min-h-0 w-full max-w-[1320px] flex-1 flex-col">
        <div className="flex items-center gap-3 rounded-lg bg-subtle px-4 py-3 text-sm">{state.confirmedAvatar ? <span className="size-10 overflow-hidden rounded-lg"><CandidateImage candidate={state.confirmedAvatar} /></span> : null}<span><strong>{state.input.name}</strong><span className="ml-2 text-text-muted">基于已确认头像生成</span></span>{state.sheetFreshness === "stale" ? <span className="status-badge status-warning ml-auto">待更新</span> : null}</div>
        <div className="mt-4 grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(22rem,2fr)]">
          <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-surface" aria-labelledby="character-sheet-image-title">
            <div className="border-b border-border px-4 py-3">
              <h3 id="character-sheet-image-title" className="text-sm font-semibold">图片设定稿</h3>
              <p className="mt-0.5 text-xs text-text-muted">预览角色正侧背视图、表情、动作与配色。</p>
            </div>
            <div className="min-h-0 flex-1 overflow-hidden bg-subtle p-3">
              {candidate ? <CandidateImage candidate={candidate} fit="contain" /> : <div className="grid h-full min-h-52 place-items-center text-center text-sm text-text-muted"><div><ImageIcon size={34} className="mx-auto text-primary" /><p className="mt-2">图片设定稿将在这里预览</p></div></div>}
            </div>
          </section>
          <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-surface" aria-labelledby="character-sheet-text-title">
            <div className="border-b border-border px-4 py-3">
              <h3 id="character-sheet-text-title" className="text-sm font-semibold">文字设定稿</h3>
              <p className="mt-0.5 text-xs text-text-muted">确认后将与图片设定稿一并保存。</p>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 text-sm leading-6 text-text-muted">
              {candidate?.specText ? <p className="whitespace-pre-wrap break-words text-text">{candidate.specText}</p> : <div className="grid h-full min-h-36 place-items-center text-center"><div><MagicWand size={28} className="mx-auto text-primary" /><p className="mt-2">生成后在这里查看文字设定稿</p></div></div>}
            </div>
          </section>
        </div>
        <div className="mt-4 flex gap-2"><button type="button" onClick={onGenerate} disabled={generating} className="button-secondary"><MagicWand size={17} />{generating ? "正在生成…" : candidate ? "重新生成" : "生成角色设定稿"}</button>{candidate ? <button type="button" onClick={() => setLargePreviewOpen(true)} className="button-secondary">查看大图</button> : null}</div>
      </div>
      {largePreviewOpen && candidate ? (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/70 p-4 sm:p-6" onMouseDown={() => setLargePreviewOpen(false)}>
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="character-sheet-preview-title"
            onMouseDown={(event) => event.stopPropagation()}
            className="flex max-h-full w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-surface shadow-2xl"
          >
            <header className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h2 id="character-sheet-preview-title" className="font-semibold">角色设定稿</h2>
              </div>
              <button type="button" onClick={() => setLargePreviewOpen(false)} aria-label="关闭角色设定稿" className="rounded-lg p-2 text-text-muted transition hover:bg-subtle hover:text-text">
                <X size={20} />
              </button>
            </header>
            <div className="min-h-0 flex-1 overflow-auto bg-subtle p-4 sm:p-6">
              <div className="mx-auto flex min-h-[20rem] w-full items-center justify-center">
                <CandidateImage candidate={candidate} fit="contain" className="max-h-[calc(100vh-10rem)] max-w-full" />
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

function SkillsStep({ state, dispatch, skills, loading }: { state: CreateAgentState; dispatch: React.Dispatch<Parameters<typeof createAgentReducer>[1]>; skills: CreatorSkill[]; loading: boolean }) {
  const [search, setSearch] = useState("");
  const visible = skills.filter((skill) => skill.status !== "disabled" && `${skill.name} ${skill.default_tool_description || ""}`.toLowerCase().includes(search.trim().toLowerCase()));
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between gap-3"><label className="relative min-w-0 flex-1"><span className="sr-only">搜索技能</span><MagnifyingGlass size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索技能名称或能力" className="h-10 w-full rounded-lg border border-border pl-9 pr-3 text-sm outline-none focus:border-primary" /></label><span className="whitespace-nowrap text-sm text-text-muted">已选择 {state.selectedSkillIds.length} 个</span></div>
      <div className="mt-4 min-h-0 flex-1 overflow-y-auto rounded-xl border border-border">
        {loading ? <div className="grid h-full place-items-center text-sm text-text-muted"><CircleNotch size={20} className="mr-2 inline animate-spin" />正在读取技能资源…</div> : visible.length ? visible.map((skill) => { const selected = state.selectedSkillIds.includes(skill.id); return <button key={skill.id} type="button" onClick={() => dispatch({ type: "toggle-skill", skillId: skill.id })} className="flex w-full items-center gap-4 border-b border-border px-4 py-3 text-left last:border-b-0 hover:bg-subtle"><span className={`grid size-9 shrink-0 place-items-center rounded-lg ${selected ? "bg-primary text-white" : "bg-primary-soft text-primary"}`}><MagicWand size={18} /></span><span className="min-w-0 flex-1"><strong className="block truncate text-sm">{skill.name}</strong><span className="mt-1 block truncate text-xs text-text-muted">{skill.default_tool_description || "可用于扩展 Agent 的工作能力"}</span></span><span className="status-badge status-success">已安装</span><span className={`grid size-5 place-items-center rounded border ${selected ? "border-primary bg-primary text-white" : "border-border"}`}>{selected ? <Check size={13} weight="bold" /> : null}</span></button>; }) : <div className="grid h-full min-h-40 place-items-center text-center text-sm text-text-muted"><div><p className="font-medium text-text">当前 Workspace 暂无可用技能</p><Link href="/resources?tab=skills" className="mt-2 inline-block text-primary">前往技能资源库</Link></div></div>}
      </div>
    </div>
  );
}

function CompleteStep({ state, skills }: { state: CreateAgentState; skills: CreatorSkill[] }) {
  const selected = skills.filter((skill) => state.selectedSkillIds.includes(skill.id));
  return (
    <div className="grid h-full place-items-center overflow-y-auto py-4 text-center"><div className="w-full max-w-2xl"><span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300"><CheckCircle size={36} weight="fill" /></span><h2 className="mt-4 text-2xl font-bold">Agent 创建完成</h2><p className="mt-2 text-sm text-text-muted">已完成基础设定、头像和角色设定稿{selected.length ? `，并配置 ${selected.length} 个技能` : "，暂未配置技能"}。</p><div className="mt-6 grid grid-cols-3 gap-3 text-left"><div className="rounded-xl border border-border p-4"><span className="text-xs text-text-muted">基础设定</span><strong className="mt-2 block truncate">{state.input.name}</strong></div><div className="rounded-xl border border-border p-4"><span className="text-xs text-text-muted">视觉资产</span><strong className="mt-2 block">头像与设定稿已确认</strong></div><div className="rounded-xl border border-border p-4"><span className="text-xs text-text-muted">技能</span><strong className="mt-2 block">{selected.length ? `${selected.length} 个` : "未配置"}</strong></div></div><p className="mt-5 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:bg-blue-400/10 dark:text-blue-200">当前为未发布草稿，发布后才会建立正式版本。</p></div></div>
  );
}

export function AgentCreateWorkspace() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session } = useAuth();
  const { workspaceCode } = useWorkspace();
  const source = capabilitySource("guidedAgentCreation");
  const demo = source === "demo";
  const [state, dispatch] = useReducer(createAgentReducer, INITIAL_CREATE_AGENT_STATE, (initial) => {
    if (!demo || typeof window === "undefined") return initial;
    return loadDemoCreateDraft(window.sessionStorage) || initial;
  });
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState<"basic" | "confirm-basic" | "avatar" | "confirm-avatar" | "sheet" | "confirm-sheet" | "skills" | "" >("");
  const [restoring, setRestoring] = useState(false);
  const restoredAgentId = useRef<number | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const validation = useMemo(() => validateBasicRole(state.input), [state.input]);
  const skillsQuery = useQuery({ queryKey: ["agent-create-skills", workspaceCode, demo], queryFn: () => demo ? Promise.resolve(DEMO_CREATOR_SKILLS) : listCreatorSkills(session?.apiKey || "", workspaceCode), enabled: Boolean((demo || session?.apiKey) && state.step === "skills") });
  const skills = skillsQuery.data || [];

  useEffect(() => {
    const agentId = Number(searchParams.get("agentId"));
    if (demo || !session?.apiKey || !Number.isInteger(agentId) || agentId <= 0 || restoredAgentId.current === agentId) return;
    restoredAgentId.current = agentId;
    setRestoring(true);
    void Promise.all([
      getAgent(session.apiKey, agentId, workspaceCode),
      getAgentCreationProgress(session.apiKey, workspaceCode, agentId),
      ...(["pre", "mid", "post"] as const).map((stage) => listStageSkills(session.apiKey, agentId, stage)),
    ]).then(([agent, progress, ...stageSkills]) => {
      dispatch({ type: "restore", state: restoredCreationState(agent, progress, stageSkills.flat().map((skill) => skill.id)) });
    }).catch((error) => {
      restoredAgentId.current = null;
      dispatch({ type: "save-failed", message: error instanceof Error ? error.message : "创建进度读取失败，请重试。" });
    }).finally(() => setRestoring(false));
  }, [demo, searchParams, session?.apiKey, workspaceCode]);

  useEffect(() => {
    if (!demo || state.lifecycle === "before-draft" || state.saveState !== "dirty") return;
    const timer = window.setTimeout(() => {
      dispatch({ type: "save-started" });
      try {
        saveDemoCreateDraft(window.sessionStorage, state);
        dispatch({ type: "save-succeeded", draftRevision: (state.draftRevision || 0) + 1 });
      } catch {
        dispatch({ type: "save-failed", message: "自动保存失败，请使用“保存并退出”重试。" });
      }
    }, 500);
    return () => window.clearTimeout(timer);
  }, [demo, state]);

  useEffect(() => {
    if (!shouldProtectExit(state)) return;
    const listener = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", listener);
    return () => window.removeEventListener("beforeunload", listener);
  }, [state]);

  async function generateBasic() {
    setSubmitted(true);
    if (Object.keys(validation).length || (!demo && !session?.apiKey)) return;
    setBusy("basic"); dispatch({ type: "basic-generation-started" });
    try {
      if (demo) {
        await delay(600);
        dispatch({ type: "basic-generation-succeeded", candidate: createDemoBasicContent(state.input), agentId: Date.now(), draftRevision: 1 });
      } else if (state.agentId && state.basicCandidate) {
        const candidate = await regenerateBasicRoleContent(session!.apiKey, state.agentId, state.input, state.basicCandidate);
        dispatch({ type: "basic-generation-succeeded", candidate, agentId: state.agentId, draftRevision: state.draftRevision || 1 });
      } else {
        const agent = await generateBasicProfile(session!.apiKey, workspaceCode, state.input);
        dispatch({
          type: "basic-generation-succeeded",
          candidate: mapAgentToBasicRoleContent(agent),
          agentId: agent.id,
          draftRevision: agent.draft_revision || 1,
        });
        // Updating the URL must not immediately restore server progress and skip
        // the local review of the newly generated basic profile.
        restoredAgentId.current = agent.id;
        router.replace(`/assets/create?agentId=${agent.id}`);
      }
    } catch (error) {
      dispatch({ type: "basic-generation-failed", message: error instanceof Error ? error.message : "基础设定生成失败，请重试。" });
    } finally {
      setBusy("");
    }
  }

  async function generateAvatars() {
    if (!state.agentId || !state.confirmedBasic || (!demo && !session?.apiKey)) return;
    setBusy("avatar"); dispatch({ type: "avatar-generation-started" });
    try {
      const candidate = demo
        ? (await delay(700), DEMO_AVATAR_CANDIDATES[0])
        : await generateAvatarCandidate(session!.apiKey, state.agentId, state.input, state.confirmedBasic);
      dispatch({ type: "avatar-generation-succeeded", candidates: [candidate] });
    } catch (error) { dispatch({ type: "avatar-generation-failed", message: error instanceof Error ? error.message : "头像生成失败，请重试或上传图片。" }); }
    finally { setBusy(""); }
  }

  async function generateSheet() {
    if (!state.agentId || !state.confirmedBasic || (!demo && !session?.apiKey)) return;
    setBusy("sheet"); dispatch({ type: "sheet-generation-started" });
    try {
      const candidate = demo
        ? (await delay(700), DEMO_SHEET_CANDIDATE)
        : await generateCharacterSheetCandidate(session!.apiKey, state.agentId, state.input, state.confirmedBasic);
      dispatch({ type: "sheet-generation-succeeded", candidate });
    } catch (error) { dispatch({ type: "sheet-generation-failed", message: error instanceof Error ? error.message : "角色设定稿生成失败，请重试。" }); }
    finally { setBusy(""); }
  }

  async function confirmBasic() {
    if (!state.basicCandidate || !state.agentId || !state.draftRevision || (!demo && !session?.apiKey)) return;
    setBusy("confirm-basic");
    dispatch({ type: "save-started" });
    try {
      if (demo) {
        dispatch({ type: "confirm-basic" });
        dispatch({ type: "save-succeeded", draftRevision: state.draftRevision + 1 });
      } else {
        const updated = await saveBasicRoleContent(session!.apiKey, workspaceCode, state.agentId, state.draftRevision, state.input.name, state.basicCandidate);
        dispatch({ type: "confirm-basic" });
        dispatch({ type: "save-succeeded", draftRevision: updated.draft_revision || state.draftRevision + 1 });
      }
    } catch (error) {
      dispatch({ type: "save-failed", message: error instanceof Error ? error.message : "基础设定保存失败，请重试。" });
    } finally { setBusy(""); }
  }

  async function confirmAvatar() {
    const candidate = state.avatarCandidates.find((item) => item.id === state.selectedAvatarId);
    if (!candidate || !state.agentId || (!demo && !session?.apiKey)) return;
    setBusy("confirm-avatar");
    dispatch({ type: "save-started" });
    try {
      const updated = demo ? null : await confirmAvatarCandidate(session!.apiKey, state.agentId, candidate);
      dispatch({ type: "confirm-avatar" });
      dispatch({ type: "save-succeeded", draftRevision: updated?.draft_revision || state.draftRevision || 1 });
    } catch (error) {
      dispatch({ type: "save-failed", message: error instanceof Error ? error.message : "头像保存失败，请重试。" });
    } finally { setBusy(""); }
  }

  async function confirmSheet() {
    if (!state.sheetCandidate || !state.agentId || (!demo && !session?.apiKey)) return;
    setBusy("confirm-sheet");
    dispatch({ type: "save-started" });
    try {
      const updated = demo ? null : await confirmCharacterSheetCandidate(session!.apiKey, state.agentId, state.sheetCandidate);
      dispatch({ type: "confirm-sheet" });
      dispatch({ type: "save-succeeded", draftRevision: updated?.draft_revision || state.draftRevision || 1 });
    } catch (error) {
      dispatch({ type: "save-failed", message: error instanceof Error ? error.message : "角色设定稿保存失败，请重试。" });
    } finally { setBusy(""); }
  }

  async function completeCreation(skipSkills = false) {
    if (!state.agentId || (!demo && !session?.apiKey)) return;
    setBusy("skills");
    dispatch({ type: "save-started" });
    try {
      let savedRevision = state.draftRevision || 1;
      if (!demo) {
        if (!skipSkills) {
          const selected = skills.filter((skill) => state.selectedSkillIds.includes(skill.id));
          await saveGuidedCreationSkills(session!.apiKey, state.agentId, selected);
        }
        const progress = await getAgentCreationProgress(session!.apiKey, workspaceCode, state.agentId);
        const completed = await completeAgentCreation(session!.apiKey, workspaceCode, state.agentId, progress.draft_revision);
        savedRevision = completed.draft_revision || progress.draft_revision;
      }
      dispatch({ type: "complete" });
      dispatch({ type: "save-succeeded", draftRevision: savedRevision });
    } catch (error) {
      dispatch({ type: "save-failed", message: error instanceof Error ? error.message : "完成创建失败，请检查必填内容后重试。" });
    } finally { setBusy(""); }
  }

  function exit() {
    const hasInput = Object.values(state.input).some((value) => Array.isArray(value) ? value.length : Boolean(value));
    if (state.lifecycle === "before-draft" && hasInput && !window.confirm("放弃尚未生成的角色信息？")) return;
    if (demo && state.lifecycle !== "before-draft" && state.saveState !== "saved") {
      try {
        saveDemoCreateDraft(window.sessionStorage, state);
      } catch {
        if (!window.confirm("当前更改未能保存，确定退出吗？")) return;
      }
    } else if (state.lifecycle !== "before-draft" && state.saveState !== "saved" && !window.confirm("当前更改尚未保存，确定退出吗？")) return;
    router.push("/assets");
  }

  const title = state.step === "complete" ? "Agent 创建完成" : STEP_COPY[state.step].title;
  const helper = state.step === "complete" ? "当前 Agent 仍是未发布草稿。" : STEP_COPY[state.step].helper;
  return (
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      <header className="flex min-h-[72px] shrink-0 items-center justify-between gap-4 border-b border-border px-5">
        <div><div className="flex items-center gap-3"><h1 className="text-xl font-bold">创建 Agent</h1><span className={`status-badge ${state.lifecycle === "before-draft" ? "status-neutral" : state.lifecycle === "complete" ? "status-success" : "status-info"}`}>{state.lifecycle === "before-draft" ? "尚未创建" : state.lifecycle === "complete" ? "创建完成" : "创建中"}</span></div><p className="mt-1 text-xs text-text-muted">四步完成角色初稿，创建完成后仍为未发布草稿。</p></div>
        <div className="flex items-center gap-2">{state.lifecycle !== "before-draft" && state.step !== "complete" ? <button type="button" onClick={exit} className="button-secondary"><FloppyDisk size={17} />保存并退出</button> : <button type="button" onClick={exit} className="button-secondary">退出</button>}</div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[210px_minmax(0,1fr)]">
        <ProgressRail state={state} onStep={(step) => dispatch({ type: "go-to-step", step })} />
        <main className="flex min-h-0 min-w-0 flex-col bg-surface px-6 py-5">
          <div className="mx-auto w-full max-w-[1320px] shrink-0"><h2 className="text-xl font-bold">{title}</h2><p className="mt-1 text-sm text-text-muted">{helper}</p></div>
          {busy === "basic" ? <div role="status" className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:bg-blue-400/10 dark:text-blue-200"><CircleNotch size={17} className="mr-2 inline animate-spin" />正在生成基础设定，成功后将建立创建中草稿…</div> : null}
          {state.error ? <div role="alert" className="mt-4 rounded-lg border border-danger/20 bg-red-50 px-4 py-3 text-sm text-danger dark:bg-red-400/10 dark:text-red-300">{state.error}</div> : null}
          <div className="mx-auto mt-5 flex min-h-0 w-full max-w-[1320px] flex-1 flex-col">
            {restoring ? <div className="grid h-full place-items-center text-sm text-text-muted"><span><CircleNotch size={20} className="mr-2 inline animate-spin" />正在恢复创建进度…</span></div> : null}
            {!restoring && state.step === "basic" && !state.basicCandidate ? <BasicInputStep state={state} dispatch={dispatch} errors={submitted ? validation : {}} /> : null}
            {!restoring && state.step === "basic" && state.basicCandidate ? <GeneratedBasicReview state={state} dispatch={dispatch} /> : null}
            {!restoring && state.step === "avatar" ? <AvatarStep state={state} dispatch={dispatch} onGenerate={() => void generateAvatars()} generating={busy === "avatar"} fileInput={fileInput} /> : null}
            {!restoring && state.step === "character-sheet" ? <CharacterSheetStep state={state} onGenerate={() => void generateSheet()} generating={busy === "sheet"} /> : null}
            {!restoring && state.step === "skills" ? <SkillsStep state={state} dispatch={dispatch} skills={skills} loading={skillsQuery.isLoading} /> : null}
            {!restoring && state.step === "complete" ? <CompleteStep state={state} skills={skills} /> : null}
          </div>

          <footer className="mx-auto mt-4 flex min-h-12 w-full max-w-[1320px] shrink-0 items-center justify-between border-t border-border pt-4">
            {state.step !== "basic" && state.step !== "complete" ? <button type="button" onClick={() => { const currentStep = state.step as Exclude<CreateStep, "complete">; const index = STEP_ORDER.indexOf(currentStep); dispatch({ type: "go-to-step", step: STEP_ORDER[Math.max(0, index - 1)] }); }} className="button-secondary"><ArrowLeft size={17} />返回</button> : <span />}
            {state.step === "basic" && !state.basicCandidate ? <button type="button" disabled={busy === "basic"} onClick={() => void generateBasic()} className="button-primary"><MagicWand size={17} />{busy === "basic" ? "正在生成…" : "生成基础设定"}</button> : null}
            {state.step === "basic" && state.basicCandidate ? <div className="flex gap-2"><button type="button" onClick={() => void generateBasic()} disabled={Boolean(busy)} className="button-secondary">重新生成</button><button type="button" onClick={() => void confirmBasic()} disabled={Boolean(busy)} className="button-primary">{busy === "confirm-basic" ? "正在保存…" : "确认并创建头像"}<ArrowRight size={17} /></button></div> : null}
            {state.step === "avatar" ? <button type="button" disabled={!state.selectedAvatarId || Boolean(busy)} onClick={() => void confirmAvatar()} className="button-primary">{busy === "confirm-avatar" ? "正在保存…" : "使用此头像，继续"}<ArrowRight size={17} /></button> : null}
            {state.step === "character-sheet" ? <button type="button" disabled={!state.sheetCandidate || Boolean(busy)} onClick={() => void confirmSheet()} className="button-primary">{busy === "confirm-sheet" ? "正在保存…" : "使用此设定稿，继续"}<ArrowRight size={17} /></button> : null}
            {state.step === "skills" ? <div className="flex gap-2"><button type="button" disabled={Boolean(busy)} onClick={() => void completeCreation(true)} className="button-secondary">跳过</button><button type="button" disabled={Boolean(busy)} onClick={() => void completeCreation(false)} className="button-primary">{busy === "skills" ? "正在保存…" : "完成创建"}<Check size={17} /></button></div> : null}
            {state.step === "complete" ? <div className="ml-auto flex gap-2"><button type="button" onClick={() => state.agentId && router.push(`/assets/${state.agentId}/test`)} className="button-secondary">测试 Agent</button><button type="button" onClick={() => state.agentId && router.push(`/assets/${state.agentId}/build`)} className="button-primary">进入专业配置<ArrowRight size={17} /></button></div> : null}
          </footer>
        </main>
      </div>
    </div>
  );
}
