"use client";

import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FileArrowUp, Gear, ImageSquare, MagicWand } from "@phosphor-icons/react";
import { DATA_MODE } from "@/config/capabilities";
import type { CreatorSkill } from "@/modules/resources/types";
import { useAuth } from "@/modules/auth/auth-provider";
import { addBuiltinUpload, listBuildCreatorSkills, listStageSkills, setStageSkills, updateBuildCreatorSkill, type AgentStageSkill, type SkillStage } from "./advanced-api";
import { SkillConfigDialog } from "./skill-config-dialog";

const stageCopy: Record<SkillStage, { label: string; contract: string }> = {
  pre: { label: "对话前", contract: "pre_conversation" },
  mid: { label: "对话中", contract: "mid_conversation" },
  post: { label: "对话后", contract: "post_conversation" },
};

const DEMO_SKILLS: CreatorSkill[] = [
  { id: 101, uuid: "demo-image-upload", skill_id: 1, skill_name: "image_upload", name: "图片上传", stage: "pre_conversation", status: "active", config: {} },
  { id: 102, uuid: "demo-weather", skill_id: 2, skill_name: "weather_api", name: "实时天气", stage: "mid_conversation", implementation_type: "prompt-api", status: "active", default_tool_description: "当用户询问天气时调用。", config: { default_city: "上海" }, config_schema: { properties: { default_city: { type: "string", description: "默认城市" } } } },
  { id: 103, uuid: "demo-tts", skill_id: 3, skill_name: "minimaxi_tts", name: "语音生成", stage: "post_conversation", status: "active", config: { voice: "default" }, config_schema: { properties: { voice: { type: "string" } } } },
];

function demoBound(stage: SkillStage): AgentStageSkill[] {
  return DEMO_SKILLS.filter((skill) => skill.stage === stageCopy[stage].contract).map((skill) => ({ id: skill.id, uuid: skill.uuid, skill_id: skill.skill_id, skill_name: skill.skill_name || skill.name, name: skill.name, config: skill.config, agent_config: {} }));
}

export function StagedSkillsPanel({ agentId }: { agentId: number }) {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const demo = DATA_MODE === "demo";
  const [stage, setStage] = useState<SkillStage>("mid");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [configSkill, setConfigSkill] = useState<CreatorSkill | null>(null);
  const [agentConfig, setAgentConfig] = useState<Record<string, unknown>>({});
  const creatorQuery = useQuery({ queryKey: ["build-creator-skills", demo], queryFn: async () => demo ? DEMO_SKILLS : (await listBuildCreatorSkills(session?.apiKey || "")).creator_skills, enabled: Boolean(session?.apiKey) });
  const boundQuery = useQuery({ queryKey: ["agent-stage-skills", agentId, stage, demo], queryFn: () => demo ? Promise.resolve(demoBound(stage)) : listStageSkills(session?.apiKey || "", agentId, stage), enabled: Boolean(session?.apiKey) });
  const available = useMemo(() => (creatorQuery.data || []).filter((skill) => !skill.stage || skill.stage === stageCopy[stage].contract), [creatorQuery.data, stage]);
  const bound = boundQuery.data || [];
  const boundIds = new Set(bound.map((skill) => skill.id));

  const persist = async (next: AgentStageSkill[]) => {
    if (!session?.apiKey) return;
    setSaving(true); setMessage("");
    try {
      if (!demo) await setStageSkills(session.apiKey, agentId, stage, next.map((skill) => ({ creator_skill_id: skill.id, config: skill.agent_config || {} })));
      queryClient.setQueryData(["agent-stage-skills", agentId, stage, demo], next);
      setMessage("阶段技能已保存到当前草稿，无需再次点击页面顶部的“保存草稿”");
    } catch (error) { setMessage(error instanceof Error ? error.message : "技能保存失败"); }
    finally { setSaving(false); }
  };

  const toggle = (skill: CreatorSkill) => {
    const next = boundIds.has(skill.id) ? bound.filter((item) => item.id !== skill.id) : [...bound, { id: skill.id, uuid: skill.uuid, skill_id: skill.skill_id, skill_name: skill.skill_name || skill.name, name: skill.name, config: skill.config, agent_config: {} }];
    void persist(next);
  };

  const openConfig = (skill: CreatorSkill) => {
    setConfigSkill(skill);
    setAgentConfig(bound.find((item) => item.id === skill.id)?.agent_config || {});
  };

  const saveConfig = async (scope: "global" | "agent", config: Record<string, unknown>) => {
    if (!configSkill || !session?.apiKey) return;
    setSaving(true); setMessage("");
    try {
      if (scope === "global") {
        const updated = demo ? { ...configSkill, config } : await updateBuildCreatorSkill(session.apiKey, configSkill.id, { config });
        queryClient.setQueryData<CreatorSkill[]>(["build-creator-skills", demo], (current) => (current || []).map((item) => item.id === updated.id ? updated : item));
      } else {
        const next = bound.map((item) => item.id === configSkill.id ? { ...item, agent_config: config } : item);
        if (!demo) await setStageSkills(session.apiKey, agentId, stage, next.map((item) => ({ creator_skill_id: item.id, config: item.agent_config || {} })));
        queryClient.setQueryData(["agent-stage-skills", agentId, stage, demo], next);
      }
      setConfigSkill(null); setMessage(scope === "agent" ? "当前 Agent 技能配置已保存到草稿" : "Creator 全局技能配置已保存");
    } catch (error) { setMessage(error instanceof Error ? error.message : "技能配置保存失败"); }
    finally { setSaving(false); }
  };

  const addBuiltin = async (kind: "image" | "document") => {
    if (!session?.apiKey) return;
    setSaving(true); setMessage("");
    try {
      if (!demo) await addBuiltinUpload(session.apiKey, agentId, kind);
      await Promise.all([creatorQuery.refetch(), boundQuery.refetch()]);
      setMessage(kind === "image" ? "图片上传 Widget 已添加" : "文档上传 Widget 已添加");
    } catch (error) { setMessage(error instanceof Error ? error.message : "内置 Widget 添加失败"); }
    finally { setSaving(false); }
  };

  return <div className="space-y-5"><div className="rounded-lg border border-primary/20 bg-primary-soft p-4 text-sm leading-6 text-text-muted">技能按现有后端契约分为对话前 Widget、对话中工具和对话后数字人处理。勾选或修改 Agent 覆盖配置后会直接写入当前草稿，无需再次点击页面顶部的“保存草稿”。</div><div className="flex rounded-lg border border-border bg-subtle p-1" role="tablist" aria-label="技能阶段">{(Object.keys(stageCopy) as SkillStage[]).map((key) => <button key={key} type="button" role="tab" aria-selected={stage === key} onClick={() => setStage(key)} className={`flex-1 rounded-md px-3 py-2 text-sm ${stage === key ? "bg-surface font-medium text-primary shadow-sm" : "text-text-muted"}`}>{stageCopy[key].label}</button>)}</div>{stage === "pre" && <div className="flex flex-wrap gap-2"><button type="button" className="button-secondary" onClick={() => void addBuiltin("image")} disabled={saving}><ImageSquare size={17} />添加图片上传</button><button type="button" className="button-secondary" onClick={() => void addBuiltin("document")} disabled={saving}><FileArrowUp size={17} />添加文档上传</button></div>}<div className="space-y-2">{available.map((skill) => <div key={skill.id} className={`flex items-center gap-3 rounded-lg border p-4 ${boundIds.has(skill.id) ? "border-primary/40 bg-primary-soft/50" : "border-border"}`}><span className="grid size-9 place-items-center rounded-lg bg-surface text-primary"><MagicWand size={18} /></span><label className="min-w-0 flex-1 cursor-pointer"><strong className="block truncate">{skill.name}</strong><span className="mt-1 block truncate text-xs text-text-muted">{skill.skill_name || skill.implementation_type || "Creator Skill"}</span></label><input type="checkbox" checked={boundIds.has(skill.id)} onChange={() => toggle(skill)} disabled={saving} aria-label={`启用 ${skill.name}`} className="size-4 accent-primary" /><button type="button" onClick={() => openConfig(skill)} disabled={!boundIds.has(skill.id)} className="rounded-md p-2 text-text-muted hover:bg-surface disabled:opacity-30" aria-label={`配置 ${skill.name}`}><Gear size={18} /></button></div>)}{!available.length && <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-text-muted">当前没有可用的{stageCopy[stage].label}技能，请先在资源库安装。</div>}</div>{message && <p className="text-sm text-text-muted">{message}</p>}<SkillConfigDialog skill={configSkill} agentConfig={agentConfig} saving={saving} onClose={() => setConfigSkill(null)} onSave={saveConfig} /></div>;
}
