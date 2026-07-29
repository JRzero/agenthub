"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Gear, MagicWand, Plus, X } from "@phosphor-icons/react";
import { DATA_MODE } from "@/config/capabilities";
import { useAuth } from "@/modules/auth/auth-provider";
import type {
  CreatorSkill,
  UpdateCreatorSkillRequest,
} from "@/modules/resources/types";
import {
  listBuildCreatorSkills,
  listStageSkills,
  setStageSkills,
  updateBuildCreatorSkill,
  type AgentStageSkill,
  type SkillStage,
} from "./advanced-api";
import { SkillConfigDialog } from "./skill-config-dialog";
import { sanitizeSkillConfig } from "./skill-credential-model";

const STAGES: Record<SkillStage, { label: string; contract: string }> = {
  pre: { label: "对话前", contract: "pre_conversation" },
  mid: { label: "对话中", contract: "mid_conversation" },
  post: { label: "对话后", contract: "post_conversation" },
};

const DEMO_SKILLS: CreatorSkill[] = [
  { id: 101, uuid: "demo-image-upload", skill_id: 1, skill_name: "image_upload", name: "图片上传", stage: "pre_conversation", status: "active", config: {} },
  { id: 102, uuid: "demo-weather", skill_id: 2, skill_name: "weather_api", name: "实时天气", stage: "mid_conversation", implementation_type: "prompt-api", status: "active", default_tool_description: "查询实时天气信息", config: { default_city: "上海" }, config_schema: { properties: { default_city: { type: "string", description: "默认城市" } } } },
  { id: 103, uuid: "demo-tts", skill_id: 3, skill_name: "minimaxi_tts", name: "语音生成", stage: "post_conversation", status: "active", config: { voice: "default" }, config_schema: { properties: { voice: { type: "string" } } } },
];

function toBound(skill: CreatorSkill): AgentStageSkill {
  return { id: skill.id, uuid: skill.uuid, skill_id: skill.skill_id, skill_name: skill.skill_name || skill.name, name: skill.name, config: skill.config, agent_config: {} };
}

function demoBound(stage: SkillStage): AgentStageSkill[] {
  return DEMO_SKILLS.filter((skill) => skill.stage === STAGES[stage].contract).map(toBound);
}

export function StagedSkillsPanel({ agentId }: { agentId: number }) {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const demo = DATA_MODE === "demo";
  const [stage, setStage] = useState<SkillStage>("mid");
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [configSkill, setConfigSkill] = useState<CreatorSkill | null>(null);
  const [agentConfig, setAgentConfig] = useState<Record<string, unknown>>({});

  const creatorQuery = useQuery({
    queryKey: ["build-creator-skills", demo],
    queryFn: async () => demo ? DEMO_SKILLS : (await listBuildCreatorSkills(session?.apiKey || "")).creator_skills,
    enabled: Boolean(session?.apiKey),
  });
  const boundQuery = useQuery({
    queryKey: ["agent-stage-skills", agentId, stage, demo],
    queryFn: () => demo ? Promise.resolve(demoBound(stage)) : listStageSkills(session?.apiKey || "", agentId, stage),
    enabled: Boolean(session?.apiKey),
  });
  const compatible = useMemo(
    () => (creatorQuery.data || []).filter((skill) => !skill.stage || skill.stage === STAGES[stage].contract),
    [creatorQuery.data, stage],
  );
  const bound = boundQuery.data || [];
  const boundIds = new Set(bound.map((skill) => skill.id));
  const available = compatible.filter((skill) => !boundIds.has(skill.id));

  async function persist(next: AgentStageSkill[], successMessage: string) {
    if (!session?.apiKey) return;
    setSaving(true);
    setMessage("");
    try {
      if (!demo) await setStageSkills(session.apiKey, agentId, stage, next.map((skill) => ({ creator_skill_id: skill.id, config: skill.agent_config || {} })));
      queryClient.setQueryData(["agent-stage-skills", agentId, stage, demo], next);
      setMessage(successMessage);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "技能更新失败，请重试");
    } finally {
      setSaving(false);
    }
  }

  function openConfig(skill: AgentStageSkill) {
    const creator = compatible.find((item) => item.id === skill.id);
    if (!creator) return;
    setConfigSkill(creator);
    setAgentConfig(skill.agent_config || {});
  }

  async function saveConfig(
    scope: "global" | "agent",
    request: UpdateCreatorSkillRequest,
  ): Promise<CreatorSkill | null> {
    if (!configSkill || !session?.apiKey) return null;
    setSaving(true);
    setMessage("");
    try {
      if (scope === "global") {
        const updated = demo
          ? {
              ...configSkill,
              config: request.config ?? configSkill.config,
              api_key_configured:
                request.api_key === null
                  ? false
                  : typeof request.api_key === "string"
                    ? true
                    : configSkill.api_key_configured,
            }
          : await updateBuildCreatorSkill(session.apiKey, configSkill.id, request);
        queryClient.setQueryData<CreatorSkill[]>(["build-creator-skills", demo], (current) => (current || []).map((item) => item.id === updated.id ? updated : item));
        setMessage("技能默认配置已更新");
        return updated;
      } else {
        const safeConfig = sanitizeSkillConfig(
          request.config || {},
          configSkill.credential_schema,
        );
        const next = bound.map((item) => item.id === configSkill.id ? { ...item, agent_config: safeConfig } : item);
        if (!demo) await setStageSkills(session.apiKey, agentId, stage, next.map((item) => ({ creator_skill_id: item.id, config: item.agent_config || {} })));
        queryClient.setQueryData(["agent-stage-skills", agentId, stage, demo], next);
        setMessage("当前 Agent 的技能配置已更新");
        return null;
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "技能配置保存失败");
      throw error;
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex rounded-lg border border-border bg-subtle p-1" role="tablist" aria-label="技能阶段">
        {(Object.keys(STAGES) as SkillStage[]).map((key) => (
          <button key={key} type="button" role="tab" aria-selected={stage === key} onClick={() => { setStage(key); setAdding(false); setMessage(""); }} className={`flex-1 rounded-md px-3 py-2 text-sm ${stage === key ? "bg-surface font-medium text-primary shadow-sm" : "text-text-muted"}`}>
            {STAGES[key].label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold">已选技能</h3>
          <p className="mt-1 text-sm text-text-muted">在{STAGES[stage].label}阶段使用，共 {bound.length} 个。</p>
        </div>
        <button type="button" className="button-secondary" onClick={() => setAdding(true)} disabled={saving}>
          <Plus size={17} />添加技能
        </button>
      </div>

      <div className="space-y-2">
        {bound.map((skill) => (
          <div key={skill.id} className="flex items-center gap-3 rounded-lg border border-border p-4">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary"><MagicWand size={18} /></span>
            <div className="min-w-0 flex-1">
              <strong className="block truncate">{skill.name}</strong>
              <span className="mt-1 block truncate text-xs text-text-muted">{skill.skill_name}</span>
            </div>
            <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">已启用</span>
            <button type="button" onClick={() => openConfig(skill)} className="rounded-md p-2 text-text-muted hover:bg-subtle" aria-label={`配置 ${skill.name}`}><Gear size={18} /></button>
            <button type="button" onClick={() => void persist(bound.filter((item) => item.id !== skill.id), `已移除 ${skill.name}`)} disabled={saving} className="rounded-md p-2 text-text-muted hover:bg-subtle hover:text-danger" aria-label={`移除 ${skill.name}`}><X size={18} /></button>
          </div>
        ))}
        {!bound.length && <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-text-muted">当前阶段还没有添加技能。</div>}
      </div>

      {adding && (
        <div className="rounded-xl border border-primary/30 bg-primary-soft/30 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div><h3 className="font-semibold">添加{STAGES[stage].label}技能</h3><p className="mt-1 text-xs text-text-muted">仅显示已安装且适用于当前阶段的技能。</p></div>
            <button type="button" onClick={() => setAdding(false)} className="rounded-md p-2 text-text-muted hover:bg-surface" aria-label="关闭技能选择"><X size={18} /></button>
          </div>
          <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
            {available.map((skill) => (
              <button key={skill.id} type="button" disabled={saving} onClick={() => { void persist([...bound, toBound(skill)], `已添加 ${skill.name}`); setAdding(false); }} className="flex w-full items-center gap-3 rounded-lg border border-border bg-surface p-3 text-left hover:border-primary/40">
                <MagicWand size={18} className="shrink-0 text-primary" />
                <span className="min-w-0 flex-1"><strong className="block truncate text-sm">{skill.name}</strong><span className="mt-0.5 block truncate text-xs text-text-muted">{skill.default_tool_description || skill.skill_name || "已安装技能"}</span></span>
                <Plus size={17} className="text-primary" />
              </button>
            ))}
            {!available.length && <div className="p-5 text-center text-sm text-text-muted">暂无其他可用技能。<Link href="/resources?tab=skills" className="ml-1 text-primary hover:underline">前往技能库</Link></div>}
          </div>
        </div>
      )}

      {message && <p role="status" className="text-sm text-text-muted">{message}</p>}
      <SkillConfigDialog skill={configSkill} agentConfig={agentConfig} saving={saving} onClose={() => setConfigSkill(null)} onSave={saveConfig} />
    </div>
  );
}
