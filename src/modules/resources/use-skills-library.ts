"use client";

import { useEffect, useMemo, useState } from "react";
import { DATA_MODE } from "@/config/capabilities";
import { useAgents } from "@/modules/agents/queries";
import { useAuth } from "@/modules/auth/auth-provider";
import { useWorkspace } from "@/modules/workspace/workspace-provider";
import {
  attachSkillToAgent,
  createCreatorSkill,
  deleteCreatorSkill,
  getMarketplaceSkill,
  listCreatorSkills,
  listMarketplaceSkills,
  updateCreatorSkill,
} from "./api";
import { DEMO_CREATOR_SKILLS, DEMO_MARKETPLACE_SKILLS } from "./fixtures";
import { getSafeResourceError } from "./resource-feedback";
import type { CreatorSkill, MarketplaceSkill } from "./types";

export function isSkillAttached(skills: string[] | undefined, skillName: string): boolean {
  return Boolean(skills?.includes(skillName));
}

export function useSkillsLibrary() {
  const { session } = useAuth();
  const { workspaceCode } = useWorkspace();
  const agentsQuery = useAgents();
  const demo = DATA_MODE === "demo";
  const [skills, setSkills] = useState<MarketplaceSkill[]>(demo ? DEMO_MARKETPLACE_SKILLS : []);
  const [creatorSkills, setCreatorSkills] = useState<CreatorSkill[]>(demo ? DEMO_CREATOR_SKILLS : []);
  const [selectedId, setSelectedId] = useState(DEMO_MARKETPLACE_SKILLS[0].id);
  const [detail, setDetail] = useState<MarketplaceSkill | null>(demo ? DEMO_MARKETPLACE_SKILLS[0] : null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("全部技能");
  const [loading, setLoading] = useState(!demo);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [attachOpen, setAttachOpen] = useState(false);
  const [agentId, setAgentId] = useState<number | "">("");
  const [manageSkill, setManageSkill] = useState<CreatorSkill | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (demo || !session?.apiKey) return;
    setLoading(true);
    Promise.all([listMarketplaceSkills(session.apiKey, workspaceCode), listCreatorSkills(session.apiKey, workspaceCode)])
      .then(([marketplace, owned]) => {
        setSkills(marketplace);
        setCreatorSkills(owned);
        setSelectedId(marketplace[0]?.id || 0);
      })
      .catch((err: unknown) => setError(getSafeResourceError(err, "无法加载技能库")))
      .finally(() => setLoading(false));
  }, [demo, reloadKey, session?.apiKey, workspaceCode]);

  useEffect(() => {
    const listItem = skills.find((skill) => skill.id === selectedId) || null;
    if (!selectedId || demo || !session?.apiKey) { setDetail(listItem); return; }
    getMarketplaceSkill(session.apiKey, workspaceCode, selectedId)
      .then(setDetail)
      .catch((err: unknown) => { setDetail(listItem); setError(getSafeResourceError(err, "无法加载技能详情")); });
  }, [demo, selectedId, session?.apiKey, skills, workspaceCode]);

  const categories = useMemo(() => ["全部技能", ...Array.from(new Set(skills.map((skill) => skill.category || "其他")))], [skills]);
  const filtered = useMemo(() => skills.filter((skill) => {
    const keyword = search.trim().toLowerCase();
    return (category === "全部技能" || (skill.category || "其他") === category)
      && (!keyword || `${skill.name} ${skill.description}`.toLowerCase().includes(keyword));
  }), [category, search, skills]);
  const selectedFromFilter = filtered.find((skill) => skill.id === selectedId);
  const selected = selectedFromFilter
    ? (detail?.id === selectedFromFilter.id ? detail : selectedFromFilter)
    : filtered[0];
  const ownedSkill = selected ? creatorSkills.find((skill) => skill.skill_id === selected.id) : undefined;

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2200);
  }

  async function addToWorkspace() {
    if (!selected || !session?.apiKey || ownedSkill) return;
    setBusy(true); setError("");
    try {
      const created = demo
        ? { id: Date.now(), uuid: `demo-${selected.id}`, skill_id: selected.id, skill_name: selected.name, name: selected.name, stage: selected.stage, status: "active", config: {} }
        : await createCreatorSkill(session.apiKey, workspaceCode, selected);
      setCreatorSkills((current) => [created, ...current]);
      flash("技能已添加到工作空间");
    } catch (err) { setError(getSafeResourceError(err, "添加技能失败")); }
    finally { setBusy(false); }
  }

  async function addToAgent() {
    const agent = (agentsQuery.data || []).find((item) => item.id === agentId);
    if (!selected || !agent || !session?.apiKey) return;
    if (isSkillAttached(agent.config?.skills, selected.name)) {
      setAttachOpen(false);
      flash(`${selected.name} 已在 ${agent.name} 中，无需重复添加`);
      return;
    }
    setBusy(true); setError("");
    try {
      if (!demo) await attachSkillToAgent(session.apiKey, workspaceCode, agent, selected);
      setAttachOpen(false); flash(`${selected.name} 已添加到 ${agent.name}`);
    } catch (err) { setError(getSafeResourceError(err, "绑定 Agent 失败")); }
    finally { setBusy(false); }
  }

  async function saveOwnedSkill(input: { name: string; status: string; config: Record<string, unknown> }) {
    if (!manageSkill || !session?.apiKey) return;
    setBusy(true); setError("");
    try {
      const updated = demo ? { ...manageSkill, ...input } : await updateCreatorSkill(session.apiKey, workspaceCode, manageSkill.id, input);
      setCreatorSkills((current) => current.map((skill) => skill.id === updated.id ? updated : skill));
      setManageSkill(null); flash("技能配置已保存");
    } catch (err) { setError(getSafeResourceError(err, "保存技能失败")); }
    finally { setBusy(false); }
  }

  async function removeOwnedSkill() {
    if (!manageSkill || !session?.apiKey || !window.confirm(`从工作空间删除「${manageSkill.name}」？`)) return;
    setBusy(true); setError("");
    try {
      if (!demo) await deleteCreatorSkill(session.apiKey, workspaceCode, manageSkill.id);
      setCreatorSkills((current) => current.filter((skill) => skill.id !== manageSkill.id));
      setManageSkill(null); flash("技能已从工作空间删除");
    } catch (err) { setError(getSafeResourceError(err, "删除技能失败")); }
    finally { setBusy(false); }
  }

  return {
    demo, loading, busy, error, notice, categories, filtered, selected, selectedId, creatorSkills,
    agents: agentsQuery.data || [], attachOpen, agentId, manageSkill, ownedSkill, search, category,
    setSearch, setCategory, setSelectedId, setAttachOpen, setAgentId, setManageSkill,
    retry: () => { setError(""); setReloadKey((current) => current + 1); },
    addToWorkspace, addToAgent, saveOwnedSkill, removeOwnedSkill,
  };
}
