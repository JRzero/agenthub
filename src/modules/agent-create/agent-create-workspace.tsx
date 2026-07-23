"use client";

import Link from "next/link";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import { capabilitySource } from "@/config/capabilities";
import { useAuth } from "@/modules/auth/auth-provider";
import { listCreatorSkills } from "@/modules/resources/api";
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

function stepComplete(state: CreateAgentState, step: Exclude<CreateStep, "complete">): boolean {
  if (step === "basic") return Boolean(state.confirmedBasic);
  if (step === "avatar") return Boolean(state.confirmedAvatar && state.avatarFreshness === "current");
  if (step === "character-sheet") return Boolean(state.confirmedSheet && state.sheetFreshness === "current");
  return state.lifecycle === "complete";
}

function CandidateImage({ candidate, className = "" }: { candidate: ImageCandidate; className?: string }) {
  return (
    // Demo and backend candidate URLs are dynamic and intentionally bypass Next image optimization.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={candidate.url} alt={candidate.alt} className={`h-full w-full object-cover ${className}`} />
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

function CreatePreview({ state, skills }: { state: CreateAgentState; skills: CreatorSkill[] }) {
  const base = state.basicCandidate || state.confirmedBasic;
  const avatar = state.confirmedAvatar || state.avatarCandidates.find((item) => item.id === state.selectedAvatarId) || null;
  const selectedSkills = skills.filter((skill) => state.selectedSkillIds.includes(skill.id));
  return (
    <aside className="min-h-0 border-l border-border bg-surface" aria-label="创建预览">
      <header className="border-b border-border px-5 py-4"><h2 className="font-semibold">创建预览</h2><p className="mt-1 text-xs text-text-muted">随当前步骤逐步补全</p></header>
      <div className="flex h-[calc(100%-69px)] min-h-0 flex-col items-center overflow-hidden px-5 py-6 text-center">
        <div className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-2xl bg-primary-soft text-3xl font-bold text-primary">
          {avatar ? <CandidateImage candidate={avatar} /> : state.input.name.slice(0, 1) || "A"}
        </div>
        <h3 className="mt-4 text-xl font-semibold">{state.input.name || "你的 Agent"}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-text-muted">{base?.description || state.input.identity || "完成基础设定后，这里会显示 Agent 简介。"}</p>
        {base?.opening ? <div className="mt-5 w-full rounded-xl bg-subtle px-4 py-3 text-left text-sm leading-6"><span className="mb-1 block text-xs text-text-muted">开场白</span>{base.opening}</div> : null}
        {state.confirmedSheet ? <div className="mt-4 h-28 w-full overflow-hidden rounded-xl border border-border"><CandidateImage candidate={state.confirmedSheet} className="object-contain" /></div> : null}
        {selectedSkills.length ? <div className="mt-4 w-full text-left"><span className="text-xs text-text-muted">已选技能</span><div className="mt-2 flex flex-wrap gap-2">{selectedSkills.map((skill) => <span key={skill.id} className="rounded-full bg-primary-soft px-2.5 py-1 text-xs text-primary">{skill.name}</span>)}</div></div> : null}
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
      <div className="flex items-center justify-between gap-4 rounded-lg bg-subtle px-4 py-3 text-sm"><span><strong>{state.input.name}</strong> · {state.input.identity}</span>{state.avatarFreshness === "stale" ? <span className="status-badge bg-amber-50 text-amber-700">待更新</span> : null}</div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {state.avatarCandidates.length ? state.avatarCandidates.map((candidate) => { const selected = candidate.id === state.selectedAvatarId; return <button key={candidate.id} type="button" onClick={() => dispatch({ type: "select-avatar", candidateId: candidate.id })} className={`relative aspect-square min-w-0 overflow-hidden rounded-xl border-2 bg-subtle transition ${selected ? "border-primary ring-2 ring-primary/15" : "border-transparent hover:border-primary/40"}`}><CandidateImage candidate={candidate} /><span className={`absolute right-2 top-2 grid size-6 place-items-center rounded-full ${selected ? "bg-primary text-white" : "bg-white/90 text-transparent"}`}><Check size={14} weight="bold" /></span></button>; }) : <div className="col-span-full grid min-h-64 place-items-center rounded-xl border border-dashed border-border text-center text-sm text-text-muted"><div><ImageIcon size={32} className="mx-auto text-primary" /><p className="mt-2">生成后在这里选择头像候选</p></div></div>}
      </div>
      <div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={onGenerate} disabled={generating} className="button-secondary"><MagicWand size={17} />{generating ? "正在生成…" : state.avatarCandidates.length ? "重新生成" : "生成头像候选"}</button><button type="button" onClick={() => fileInput.current?.click()} className="button-secondary"><UploadSimple size={17} />上传图片</button><button type="button" disabled title="媒体素材库接口尚未接入" className="button-secondary opacity-50"><ImageIcon size={17} />从素材选择</button><input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.addEventListener("load", () => { if (typeof reader.result !== "string") return; dispatch({ type: "set-upload-candidate", candidate: { id: `upload-${file.name}-${file.lastModified}`, url: reader.result, alt: `上传的头像 ${file.name}` } }); }); reader.readAsDataURL(file); event.target.value = ""; }} /></div>
    </div>
  );
}

function CharacterSheetStep({ state, onGenerate, generating }: { state: CreateAgentState; onGenerate: () => void; generating: boolean }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center gap-3 rounded-lg bg-subtle px-4 py-3 text-sm">{state.confirmedAvatar ? <span className="size-10 overflow-hidden rounded-lg"><CandidateImage candidate={state.confirmedAvatar} /></span> : null}<span><strong>{state.input.name}</strong><span className="ml-2 text-text-muted">基于已确认头像生成</span></span>{state.sheetFreshness === "stale" ? <span className="status-badge ml-auto bg-amber-50 text-amber-700">待更新</span> : null}</div>
      <div className="mt-4 min-h-0 flex-1 overflow-hidden rounded-xl border border-dashed border-border bg-subtle">{state.sheetCandidate ? <CandidateImage candidate={state.sheetCandidate} className="object-contain" /> : <div className="grid h-full place-items-center text-center text-sm text-text-muted"><div><ImageIcon size={34} className="mx-auto text-primary" /><p className="mt-2">角色设定稿候选将在这里预览</p></div></div>}</div>
      <div className="mt-4 flex gap-2"><button type="button" onClick={onGenerate} disabled={generating} className="button-secondary"><MagicWand size={17} />{generating ? "正在生成…" : state.sheetCandidate ? "重新生成" : "生成角色设定稿"}</button>{state.sheetCandidate ? <a href={state.sheetCandidate.url} target="_blank" rel="noreferrer" className="button-secondary">查看大图</a> : null}</div>
    </div>
  );
}

function SkillsStep({ state, dispatch, skills, loading }: { state: CreateAgentState; dispatch: React.Dispatch<Parameters<typeof createAgentReducer>[1]>; skills: CreatorSkill[]; loading: boolean }) {
  const [search, setSearch] = useState("");
  const visible = skills.filter((skill) => skill.status !== "disabled" && `${skill.name} ${skill.default_tool_description || ""}`.toLowerCase().includes(search.trim().toLowerCase()));
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between gap-3"><label className="relative min-w-0 flex-1"><span className="sr-only">搜索技能</span><MagnifyingGlass size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索技能名称或能力" className="h-10 w-full rounded-lg border border-border pl-9 pr-3 text-sm outline-none focus:border-primary" /></label><span className="whitespace-nowrap text-sm text-text-muted">已选择 {state.selectedSkillIds.length} 个</span></div>
      <div className="mt-4 min-h-0 flex-1 overflow-y-auto rounded-xl border border-border">
        {loading ? <div className="grid h-full place-items-center text-sm text-text-muted"><CircleNotch size={20} className="mr-2 inline animate-spin" />正在读取技能资源…</div> : visible.length ? visible.map((skill) => { const selected = state.selectedSkillIds.includes(skill.id); return <button key={skill.id} type="button" onClick={() => dispatch({ type: "toggle-skill", skillId: skill.id })} className="flex w-full items-center gap-4 border-b border-border px-4 py-3 text-left last:border-b-0 hover:bg-subtle"><span className={`grid size-9 shrink-0 place-items-center rounded-lg ${selected ? "bg-primary text-white" : "bg-primary-soft text-primary"}`}><MagicWand size={18} /></span><span className="min-w-0 flex-1"><strong className="block truncate text-sm">{skill.name}</strong><span className="mt-1 block truncate text-xs text-text-muted">{skill.default_tool_description || "可用于扩展 Agent 的工作能力"}</span></span><span className="status-badge bg-emerald-50 text-emerald-700">已安装</span><span className={`grid size-5 place-items-center rounded border ${selected ? "border-primary bg-primary text-white" : "border-border"}`}>{selected ? <Check size={13} weight="bold" /> : null}</span></button>; }) : <div className="grid h-full min-h-40 place-items-center text-center text-sm text-text-muted"><div><p className="font-medium text-text">当前 Workspace 暂无可用技能</p><Link href="/resources?tab=skills" className="mt-2 inline-block text-primary">前往技能资源库</Link></div></div>}
      </div>
    </div>
  );
}

function CompleteStep({ state, skills }: { state: CreateAgentState; skills: CreatorSkill[] }) {
  const selected = skills.filter((skill) => state.selectedSkillIds.includes(skill.id));
  return (
    <div className="grid h-full place-items-center overflow-y-auto py-4 text-center"><div className="w-full max-w-2xl"><span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle size={36} weight="fill" /></span><h2 className="mt-4 text-2xl font-bold">Agent 创建完成</h2><p className="mt-2 text-sm text-text-muted">已完成基础设定、头像和角色设定稿{selected.length ? `，并配置 ${selected.length} 个技能` : "，暂未配置技能"}。</p><div className="mt-6 grid grid-cols-3 gap-3 text-left"><div className="rounded-xl border border-border p-4"><span className="text-xs text-text-muted">基础设定</span><strong className="mt-2 block truncate">{state.input.name}</strong></div><div className="rounded-xl border border-border p-4"><span className="text-xs text-text-muted">视觉资产</span><strong className="mt-2 block">头像与设定稿已确认</strong></div><div className="rounded-xl border border-border p-4"><span className="text-xs text-text-muted">技能</span><strong className="mt-2 block">{selected.length ? `${selected.length} 个` : "未配置"}</strong></div></div><p className="mt-5 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800">当前为未发布草稿，发布后才会建立正式版本。</p></div></div>
  );
}

export function AgentCreateWorkspace() {
  const router = useRouter();
  const { session } = useAuth();
  const { workspaceCode } = useWorkspace();
  const source = capabilitySource("guidedAgentCreation");
  const demo = source === "demo";
  const [state, dispatch] = useReducer(createAgentReducer, INITIAL_CREATE_AGENT_STATE, (initial) => {
    if (!demo || typeof window === "undefined") return initial;
    return loadDemoCreateDraft(window.sessionStorage) || initial;
  });
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState<"basic" | "avatar" | "sheet" | "" >("");
  const fileInput = useRef<HTMLInputElement>(null);
  const validation = useMemo(() => validateBasicRole(state.input), [state.input]);
  const skillsQuery = useQuery({ queryKey: ["agent-create-skills", workspaceCode, demo], queryFn: () => demo ? Promise.resolve(DEMO_CREATOR_SKILLS) : listCreatorSkills(session?.apiKey || "", workspaceCode), enabled: Boolean((demo || session?.apiKey) && state.step === "skills") });
  const skills = skillsQuery.data || [];

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
    if (Object.keys(validation).length || !demo) return;
    setBusy("basic"); dispatch({ type: "basic-generation-started" });
    try { await delay(600); dispatch({ type: "basic-generation-succeeded", candidate: createDemoBasicContent(state.input), agentId: Date.now(), draftRevision: 1 }); }
    catch { dispatch({ type: "basic-generation-failed", message: "基础设定生成失败，请重试。" }); }
    finally { setBusy(""); }
  }

  async function generateAvatars() {
    if (!demo) return;
    setBusy("avatar"); dispatch({ type: "avatar-generation-started" });
    try { await delay(700); dispatch({ type: "avatar-generation-succeeded", candidates: DEMO_AVATAR_CANDIDATES }); }
    catch { dispatch({ type: "avatar-generation-failed", message: "头像生成失败，请重试或上传图片。" }); }
    finally { setBusy(""); }
  }

  async function generateSheet() {
    if (!demo) return;
    setBusy("sheet"); dispatch({ type: "sheet-generation-started" });
    try { await delay(700); dispatch({ type: "sheet-generation-succeeded", candidate: DEMO_SHEET_CANDIDATE }); }
    catch { dispatch({ type: "sheet-generation-failed", message: "角色设定稿生成失败，请重试。" }); }
    finally { setBusy(""); }
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
  const liveUnavailable = source === "unavailable";

  return (
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      <header className="flex min-h-[72px] shrink-0 items-center justify-between gap-4 border-b border-border px-5">
        <div><div className="flex items-center gap-3"><h1 className="text-xl font-bold">创建 Agent</h1><span className={`status-badge ${state.lifecycle === "before-draft" ? "bg-slate-100 text-text-muted" : "bg-blue-50 text-primary"}`}>{state.lifecycle === "before-draft" ? "尚未创建" : state.lifecycle === "complete" ? "创建完成" : "创建中"}</span></div><p className="mt-1 text-xs text-text-muted">四步完成角色初稿，创建完成后仍为未发布草稿。</p></div>
        <div className="flex items-center gap-2">{state.lifecycle !== "before-draft" && state.step !== "complete" ? <button type="button" onClick={exit} className="button-secondary"><FloppyDisk size={17} />保存并退出</button> : <button type="button" onClick={exit} className="button-secondary">退出</button>}</div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[210px_minmax(0,1fr)_310px]">
        <ProgressRail state={state} onStep={(step) => dispatch({ type: "go-to-step", step })} />
        <main className="flex min-h-0 min-w-0 flex-col bg-white px-6 py-5">
          <div className="shrink-0"><h2 className="text-xl font-bold">{title}</h2><p className="mt-1 text-sm text-text-muted">{helper}</p></div>
          {liveUnavailable && state.step === "basic" ? <div className="mt-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"><WarningCircle size={20} className="mt-0.5 shrink-0" /><div><strong>基础生成与创建草稿接口待接入</strong><p className="mt-1 leading-6">当前不会先创建空 Agent，也不会用本地内容冒充生成成功。接口接入后即可启用完整向导。</p></div></div> : null}
          {state.error ? <div role="alert" className="mt-4 rounded-lg border border-danger/20 bg-red-50 px-4 py-3 text-sm text-danger">{state.error}</div> : null}
          <div className="mt-5 flex min-h-0 flex-1 flex-col">
            {state.step === "basic" && !state.basicCandidate ? <BasicInputStep state={state} dispatch={dispatch} errors={submitted ? validation : {}} /> : null}
            {state.step === "basic" && state.basicCandidate ? <GeneratedBasicReview state={state} dispatch={dispatch} /> : null}
            {state.step === "avatar" ? <AvatarStep state={state} dispatch={dispatch} onGenerate={() => void generateAvatars()} generating={busy === "avatar"} fileInput={fileInput} /> : null}
            {state.step === "character-sheet" ? <CharacterSheetStep state={state} onGenerate={() => void generateSheet()} generating={busy === "sheet"} /> : null}
            {state.step === "skills" ? <SkillsStep state={state} dispatch={dispatch} skills={skills} loading={skillsQuery.isLoading} /> : null}
            {state.step === "complete" ? <CompleteStep state={state} skills={skills} /> : null}
          </div>

          <footer className="mt-4 flex min-h-12 shrink-0 items-center justify-between border-t border-border pt-4">
            {state.step !== "basic" && state.step !== "complete" ? <button type="button" onClick={() => { const currentStep = state.step as Exclude<CreateStep, "complete">; const index = STEP_ORDER.indexOf(currentStep); dispatch({ type: "go-to-step", step: STEP_ORDER[Math.max(0, index - 1)] }); }} className="button-secondary"><ArrowLeft size={17} />返回</button> : <span />}
            {state.step === "basic" && !state.basicCandidate ? <button type="button" disabled={busy === "basic" || liveUnavailable} onClick={() => void generateBasic()} className="button-primary"><MagicWand size={17} />{busy === "basic" ? "正在生成…" : "生成基础设定"}</button> : null}
            {state.step === "basic" && state.basicCandidate ? <div className="flex gap-2"><button type="button" onClick={() => void generateBasic()} disabled={busy === "basic" || liveUnavailable} className="button-secondary">重新生成</button><button type="button" onClick={() => dispatch({ type: "confirm-basic" })} className="button-primary">确认并创建头像<ArrowRight size={17} /></button></div> : null}
            {state.step === "avatar" ? <button type="button" disabled={!state.selectedAvatarId} onClick={() => dispatch({ type: "confirm-avatar" })} className="button-primary">使用此头像，继续<ArrowRight size={17} /></button> : null}
            {state.step === "character-sheet" ? <button type="button" disabled={!state.sheetCandidate} onClick={() => dispatch({ type: "confirm-sheet" })} className="button-primary">使用此设定稿，继续<ArrowRight size={17} /></button> : null}
            {state.step === "skills" ? <div className="flex gap-2"><button type="button" onClick={() => dispatch({ type: "complete" })} className="button-secondary">跳过</button><button type="button" onClick={() => dispatch({ type: "complete" })} className="button-primary">完成创建<Check size={17} /></button></div> : null}
            {state.step === "complete" ? <div className="ml-auto flex gap-2"><button type="button" onClick={() => state.agentId && router.push(`/assets/${state.agentId}/test`)} className="button-secondary">测试 Agent</button><button type="button" onClick={() => state.agentId && router.push(`/assets/${state.agentId}/build`)} className="button-primary">进入专业配置<ArrowRight size={17} /></button></div> : null}
          </footer>
        </main>
        <CreatePreview state={state} skills={skills} />
      </div>
    </div>
  );
}
