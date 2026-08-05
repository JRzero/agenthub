"use client";

import { useEffect, useMemo, useState } from "react";
import { Buildings, CheckCircle, Hash, Info, UserCircle } from "@phosphor-icons/react";
import { useWorkspace } from "@/modules/workspace/workspace-provider";
import { Select } from "@/shared/ui/select";
import {
  DEFAULT_WORKSPACE_PREFERENCES,
  loadWorkspacePreferences,
  saveWorkspacePreferences,
  type WorkspacePreferences,
} from "./workspace-preferences";

type SaveState = "idle" | "saved" | "error";

export function WorkspaceInformationPanel() {
  const { workspaceCode, workspaceName, workspaces } = useWorkspace();
  const [preferences, setPreferences] = useState<WorkspacePreferences>(DEFAULT_WORKSPACE_PREFERENCES);
  const [savedPreferences, setSavedPreferences] = useState<WorkspacePreferences>(DEFAULT_WORKSPACE_PREFERENCES);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  useEffect(() => {
    try {
      const stored = loadWorkspacePreferences(window.localStorage);
      setPreferences(stored);
      setSavedPreferences(stored);
    } catch {
      setSaveState("error");
    }
  }, []);

  const dirty = useMemo(
    () => JSON.stringify(preferences) !== JSON.stringify(savedPreferences),
    [preferences, savedPreferences],
  );

  const updatePreference = <Key extends keyof WorkspacePreferences>(key: Key, value: WorkspacePreferences[Key]) => {
    setPreferences((current) => ({ ...current, [key]: value }));
    setSaveState("idle");
  };

  const save = () => {
    try {
      saveWorkspacePreferences(window.localStorage, preferences);
      setSavedPreferences(preferences);
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  };

  const selectedWorkspace = workspaces.find((workspace) => workspace.code === workspaceCode);

  return (
    <div className="grid gap-7 min-[1360px]:grid-cols-[minmax(0,1fr)_280px]">
      <section aria-labelledby="workspace-settings-title">
        <h2 id="workspace-settings-title" className="text-xl font-semibold">工作区信息</h2>
        <p className="mt-2 text-sm text-text-muted">基础信息由工作区服务提供；偏好仅保存在当前浏览器。</p>
        <div className="mt-6 divide-y divide-border border-y border-border">
          <Field label="工作区名称" hint="当前版本不可修改。">
            <input aria-label="工作区名称" readOnly value={workspaceName} className="control-field w-full bg-surface text-text-secondary" />
          </Field>
          <Field label="工作区标识" hint="由后端创建后不可修改。">
            <input aria-label="工作区标识" readOnly value={workspaceCode} className="control-field w-full bg-surface font-mono text-text-secondary" />
          </Field>
          <Field label="默认语言">
            <Select ariaLabel="默认语言" value={preferences.language} onValueChange={(value) => updatePreference("language", value as WorkspacePreferences["language"])} options={[{ value: "zh-CN", label: "简体中文" }, { value: "en-US", label: "English" }]} className="w-full" />
          </Field>
          <Field label="时区">
            <Select ariaLabel="时区" value={preferences.timezone} onValueChange={(value) => updatePreference("timezone", value as WorkspacePreferences["timezone"])} options={[{ value: "Asia/Shanghai", label: "Asia/Shanghai" }, { value: "UTC", label: "UTC" }]} className="w-full" />
          </Field>
          <Field label="资产默认可见性" hint="只控制新建资产的前端默认选项；发布权限仍以后端规则为准。">
            <Select ariaLabel="资产默认可见性" value={preferences.visibility} onValueChange={(value) => updatePreference("visibility", value as WorkspacePreferences["visibility"])} options={[{ value: "workspace", label: "仅工作区可见" }, { value: "private", label: "仅自己可见" }]} className="w-full" />
          </Field>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <p className={`flex items-center gap-2 text-xs ${saveState === "error" ? "text-danger" : saveState === "saved" ? "text-success" : dirty ? "text-warning" : "text-text-muted"}`} role="status" aria-live="polite">
            {saveState === "error" ? <><Info size={16} />无法访问浏览器存储，偏好未保存</> : saveState === "saved" ? <><CheckCircle size={16} />偏好已保存到当前浏览器</> : dirty ? "有未保存的偏好更改" : "当前偏好已保存"}
          </p>
          <button type="button" className="button-primary min-w-28" onClick={save} disabled={!dirty}>保存偏好</button>
        </div>
      </section>

      <aside className="h-fit border-t border-border pt-6 min-[1360px]:border-l min-[1360px]:border-t-0 min-[1360px]:pl-7 min-[1360px]:pt-0" aria-label="工作区概览">
        <h2 className="text-lg font-semibold">工作区概览</h2>
        <div className="mt-5 divide-y divide-border">
          <Overview icon={Buildings} label="当前工作区" value={workspaceName} />
          <Overview icon={Hash} label="工作区标识" value={workspaceCode} mono />
          {selectedWorkspace?.role && <Overview icon={UserCircle} label="当前角色" value={selectedWorkspace.role} />}
        </div>
        <p className="mt-5 flex gap-2 text-xs leading-5 text-text-muted"><Info size={16} className="mt-0.5 shrink-0" />此处只展示当前工作区契约已返回的信息，不推导成员、资产或应用端数量。</p>
      </aside>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return <div className="grid gap-3 py-5 md:grid-cols-[150px_minmax(0,1fr)]"><div><span className="font-medium">{label}</span>{hint && <span className="mt-1 block text-xs leading-5 text-text-muted">{hint}</span>}</div><div>{children}</div></div>;
}

function Overview({ icon: OverviewIcon, label, value, mono = false }: { icon: typeof Buildings; label: string; value: string; mono?: boolean }) {
  return <div className="flex items-center gap-3 py-5 first:pt-0"><OverviewIcon size={22} className="shrink-0 text-text-muted" aria-hidden="true" /><div className="min-w-0"><p className="text-xs text-text-muted">{label}</p><p className={`mt-1 truncate text-sm font-medium text-text-strong ${mono ? "font-mono" : ""}`}>{value}</p></div></div>;
}
