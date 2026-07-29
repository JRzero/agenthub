"use client";

import { useState } from "react";
import Image from "next/image";
import { MagicWand, PaintBrush, UserCircle } from "@phosphor-icons/react";
import { DATA_MODE } from "@/config/capabilities";
import type { Agent } from "@/modules/agents/types";
import { useAuth } from "@/modules/auth/auth-provider";
import { getApiBaseUrl } from "@/shared/api/http-client";
import { uploadAgentAvatar } from "./advanced-api";
import { generateAvatarPreview, generateCharacterSheet, generateCharacterSpec, saveCharacterDesign } from "./co-creation-api";
import type { AgentBuildDraft } from "./types";

function sheetUrl(value?: string): string {
  if (!value) return "";
  if (/^(data:|https?:)/.test(value)) return value;
  return `${getApiBaseUrl()}/api/v1/character-sheets/${encodeURIComponent(value)}?t=${Math.floor(Date.now() / 60000)}`;
}

export function CharacterDesignPanel({ agent, draft, onAgentUpdated }: { agent: Agent; draft: AgentBuildDraft; onAgentUpdated: (agent: Agent) => void }) {
  const { session } = useAuth();
  const demo = DATA_MODE === "demo";
  const [avatarPrompt, setAvatarPrompt] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [spec, setSpec] = useState(agent.config?.metadata?.character_design_spec || "");
  const [sheet, setSheet] = useState(sheetUrl(agent.config?.metadata?.character_design_sheet));
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const generateAvatar = async () => {
    if (!session?.apiKey || !avatarPrompt.trim()) return;
    setBusy("avatar"); setMessage("");
    try { if (demo) throw new Error("演示模式不调用图像模型；真实模式使用现有 Motherland 图像管线。"); setAvatarPreview((await generateAvatarPreview(session.apiKey, agent.id, avatarPrompt.trim())).image_url); }
    catch (error) { setMessage(error instanceof Error ? error.message : "头像生成失败"); }
    finally { setBusy(""); }
  };
  const acceptAvatar = async () => {
    if (!session?.apiKey || !avatarPreview) return;
    setBusy("avatar-save"); setMessage("");
    try { const response = await fetch(avatarPreview); if (!response.ok) throw new Error("无法读取生成的头像"); if (!agent.draft_revision) throw new Error("草稿版本缺失，请刷新页面后重试"); onAgentUpdated(await uploadAgentAvatar(session.apiKey, agent.id, await response.blob(), agent.draft_revision)); setMessage("生成头像已保存；如需调整可在媒体素材中重新裁剪。"); }
    catch (error) { setMessage(error instanceof Error ? error.message : "生成头像保存失败"); }
    finally { setBusy(""); }
  };
  const makeSpec = async () => {
    if (!session?.apiKey) return;
    setBusy("spec"); setMessage("");
    try { setSpec(demo ? `角色名称：${agent.name}\n视觉基调：沉静、可信、具有清晰边界。\n角色依据：${draft.systemPrompt.slice(0, 240)}` : (await generateCharacterSpec(session.apiKey, agent.id, draft.systemPrompt)).spec_text); }
    catch (error) { setMessage(error instanceof Error ? error.message : "设定稿生成失败"); }
    finally { setBusy(""); }
  };
  const makeSheet = async () => {
    if (!session?.apiKey || !spec.trim()) return;
    setBusy("sheet"); setMessage("");
    try { if (demo) throw new Error("演示模式不调用 Nano Banana；真实模式将生成漫画设计稿。"); setSheet((await generateCharacterSheet(session.apiKey, agent.id, spec)).image_url); }
    catch (error) { setMessage(error instanceof Error ? error.message : "设计稿生成失败"); }
    finally { setBusy(""); }
  };
  const save = async () => {
    if (!session?.apiKey || !spec.trim() || !sheet) return;
    setBusy("save"); setMessage("");
    try { if (!demo && !agent.draft_revision) throw new Error("草稿版本缺失，请刷新页面后重试"); const updated = demo ? { ...agent, config: { ...agent.config, metadata: { ...agent.config?.metadata, character_design_spec: spec, character_design_sheet: sheet } } } : await saveCharacterDesign(session.apiKey, agent.id, spec, sheet, agent.draft_revision!); onAgentUpdated(updated); setMessage("角色设定与设计稿已保存到 Agent Profile"); }
    catch (error) { setMessage(error instanceof Error ? error.message : "角色设计保存失败"); }
    finally { setBusy(""); }
  };

  return <div className="space-y-6"><section className="rounded-xl border border-border p-5"><div className="flex items-center gap-3"><UserCircle size={23} className="text-primary" /><div><h3 className="font-semibold">Motherland 生成头像</h3><p className="text-xs text-text-muted">使用当前提示词、共创记录和现有头像作为生成上下文。</p></div></div><textarea value={avatarPrompt} onChange={(event) => setAvatarPrompt(event.target.value)} rows={3} placeholder="补充外观要求，例如发型、表情、服装与画风" className="mt-4 w-full resize-y rounded-lg border border-border p-3" /><button type="button" onClick={() => void generateAvatar()} disabled={!avatarPrompt.trim() || Boolean(busy)} className="button-secondary mt-3"><MagicWand size={17} />{busy === "avatar" ? "生成中…" : "生成头像预览"}</button>{avatarPreview && <div className="mt-4 flex flex-wrap items-end gap-4"><Image src={avatarPreview} alt="Motherland 生成的头像预览" width={160} height={160} unoptimized className="size-40 rounded-xl border border-border object-cover" /><button type="button" onClick={() => void acceptAvatar()} disabled={Boolean(busy)} className="button-primary">接受为 Agent 头像</button></div>}</section><section className="rounded-xl border border-border p-5"><div className="flex items-center gap-3"><PaintBrush size={23} className="text-primary" /><div><h3 className="font-semibold">角色设定稿与漫画设计稿</h3><p className="text-xs text-text-muted">先由 Motherland 生成设定正文，再委托图像技能生成设计稿。</p></div></div><button type="button" onClick={() => void makeSpec()} disabled={Boolean(busy)} className="button-secondary mt-4"><MagicWand size={17} />{busy === "spec" ? "生成中…" : "生成角色设定稿"}</button><textarea value={spec} onChange={(event) => setSpec(event.target.value)} rows={12} placeholder="角色视觉设定正文" className="mt-4 w-full resize-y rounded-lg border border-border p-3 leading-6" /><div className="mt-3 flex flex-wrap gap-3"><button type="button" onClick={() => void makeSheet()} disabled={!spec.trim() || Boolean(busy)} className="button-secondary">{busy === "sheet" ? "生成中…" : "生成漫画设计稿"}</button><button type="button" onClick={() => void save()} disabled={!spec.trim() || !sheet || Boolean(busy)} className="button-primary">{busy === "save" ? "保存中…" : "保存角色设计"}</button></div>{sheet && <Image src={sheet} alt="角色漫画设计稿" width={960} height={640} unoptimized className="mt-4 max-h-96 w-full rounded-xl border border-border object-contain" />}</section>{message && <p className="rounded-md bg-subtle px-4 py-3 text-sm text-text-muted">{message}</p>}</div>;
}
