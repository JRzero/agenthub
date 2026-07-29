"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DATA_MODE } from "@/config/capabilities";
import { useAgent } from "@/modules/agents/queries";
import type { Agent } from "@/modules/agents/types";
import { useAuth } from "@/modules/auth/auth-provider";
import { useWorkspace } from "@/modules/workspace/workspace-provider";
import { ApiError } from "@/shared/api/http-client";
import { listKnowledgeBaseOptions, updateAgentBuild, type KnowledgeBaseOption } from "./api";
import { createBuildDraft, draftsEqual, serializeBuildDraft, validateBuildDraft, type AgentBuildDraft } from "./types";

const DEMO_KNOWLEDGE_BASES: KnowledgeBaseOption[] = [
  { id: 8, name: "星海陪伴语料库", description: "角色背景、回应边界与品牌术语" },
  { id: 3, name: "产品帮助中心", description: "产品说明与常见问题" },
];

export function useBuildEditor(agentId: number | null) {
  const queryClient = useQueryClient();
  const query = useAgent(agentId);
  const { session } = useAuth();
  const { workspaceCode } = useWorkspace();
  const demo = DATA_MODE === "demo";
  const [draft, setDraft] = useState<AgentBuildDraft | null>(null);
  const [savedDraft, setSavedDraft] = useState<AgentBuildDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const loadedKey = useRef("");

  const knowledgeQuery = useQuery({
    queryKey: ["knowledge-bases", workspaceCode, demo],
    queryFn: () => demo ? Promise.resolve(DEMO_KNOWLEDGE_BASES) : listKnowledgeBaseOptions(session?.apiKey || "", workspaceCode),
    enabled: Boolean(session?.apiKey),
  });

  useEffect(() => {
    if (!query.data) return;
    const key = `${query.data.id}:${query.data.updated_at || "initial"}:${query.data.version}:${query.data.draft_revision ?? 0}`;
    if (loadedKey.current === key) return;
    const next = createBuildDraft(query.data);
    loadedKey.current = key;
    setDraft(next);
    setSavedDraft(next);
    setSaveError("");
  }, [query.data]);

  const validationErrors = useMemo(() => draft ? validateBuildDraft(draft) : {}, [draft]);
  const dirty = Boolean(draft && savedDraft && !draftsEqual(draft, savedDraft));

  const patchDraft = useCallback((patch: Partial<AgentBuildDraft>) => {
    setDraft((current) => current ? { ...current, ...patch } : current);
    setSaveError("");
  }, []);

  const reset = useCallback(() => {
    if (savedDraft) setDraft(structuredClone(savedDraft));
    setSaveError("");
  }, [savedDraft]);

  const applyAgentUpdate = useCallback((updated: Agent) => {
    loadedKey.current = `${updated.id}:${updated.updated_at || "initial"}:${updated.version}:${updated.draft_revision ?? 0}`;
    queryClient.setQueryData(["agent", updated.id, workspaceCode, demo], updated);
  }, [demo, queryClient, workspaceCode]);

  const save = useCallback(async (): Promise<boolean> => {
    if (!draft || !agentId || !query.data) return false;
    const errors = validateBuildDraft(draft);
    if (Object.keys(errors).length) {
      setSaveError("请先修正标记的必填项");
      return false;
    }
    setSaving(true);
    setSaveError("");
    try {
      if (!demo) {
        if (!query.data.draft_revision) {
          setSaveError("草稿版本缺失，请刷新页面后重试");
          return false;
        }
        const updated = await updateAgentBuild(
          session?.apiKey || "",
          agentId,
          workspaceCode,
          serializeBuildDraft(draft, query.data.draft_revision),
        );
        applyAgentUpdate(updated);
      }
      const snapshot = structuredClone(draft);
      setSavedDraft(snapshot);
      setDraft(snapshot);
      setSavedAt(new Date());
      return true;
    } catch (error) {
      if (error instanceof ApiError && error.code === "DRAFT_CONFLICT") {
        await query.refetch();
        setSaveError("草稿已被其他操作更新，已刷新到最新版本，请确认后再保存。");
      } else {
        setSaveError(error instanceof Error ? error.message : "保存失败，请重试");
      }
      return false;
    } finally {
      setSaving(false);
    }
  }, [agentId, applyAgentUpdate, demo, draft, query, session?.apiKey, workspaceCode]);

  return {
    ...query,
    draft,
    dirty,
    saving,
    saveError,
    savedAt,
    validationErrors,
    knowledgeBases: knowledgeQuery.data || [],
    knowledgeLoading: knowledgeQuery.isLoading,
    knowledgeError: knowledgeQuery.isError,
    demo,
    patchDraft,
    reset,
    applyAgentUpdate,
    save,
  };
}
