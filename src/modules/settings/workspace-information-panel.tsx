"use client";

import { useEffect, useState } from "react";
import { Buildings, Cube, UsersThree } from "@phosphor-icons/react";
import { DEMO_AGENTS, DEMO_ADAPTERS } from "@/fixtures/demo-data";
import { useAuth } from "@/modules/auth/auth-provider";
import { useWorkspace } from "@/modules/workspace/workspace-provider";
import { Select } from "@/shared/ui/select";

const PREFERENCES_KEY = "agenthub-workspace-preferences";

export function WorkspaceInformationPanel() {
  const { demo } = useAuth();
  const { workspaceCode, workspaceName, workspaces } = useWorkspace();
  const [language, setLanguage] = useState("zh-CN");
  const [timezone, setTimezone] = useState("Asia/Shanghai");
  const [visibility, setVisibility] = useState("workspace");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(PREFERENCES_KEY);
    if (!raw) return;
    try {
      const value = JSON.parse(raw) as { language?: string; timezone?: string; visibility?: string };
      if (value.language) setLanguage(value.language);
      if (value.timezone) setTimezone(value.timezone);
      if (value.visibility) setVisibility(value.visibility);
    } catch {
      window.localStorage.removeItem(PREFERENCES_KEY);
    }
  }, []);

  const save = () => {
    window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify({ language, timezone, visibility }));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  return <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]"><section className="panel p-6"><h2 className="text-xl font-semibold">工作区信息</h2><div className="mt-6 space-y-5"><Field label="工作区名称"><input aria-label="工作区名称" readOnly value={workspaceName} className="control-field w-full bg-subtle text-text-muted" /></Field><Field label="工作区标识" hint="工作区的唯一标识，由后端创建后不可修改。"><input aria-label="工作区标识" readOnly value={workspaceCode} className="control-field w-full bg-subtle font-mono text-text-muted" /></Field><Field label="默认语言"><Select ariaLabel="默认语言" value={language} onValueChange={setLanguage} options={[{ value: "zh-CN", label: "简体中文" }, { value: "en-US", label: "English" }]} className="w-full" /></Field><Field label="时区"><Select ariaLabel="时区" value={timezone} onValueChange={setTimezone} options={[{ value: "Asia/Shanghai", label: "Asia/Shanghai" }, { value: "UTC", label: "UTC" }]} className="w-full" /></Field><Field label="资产默认可见性" hint="只控制新建资产的前端默认选项，发布权限仍以后端规则为准。"><Select ariaLabel="资产默认可见性" value={visibility} onValueChange={setVisibility} options={[{ value: "workspace", label: "仅工作区可见" }, { value: "private", label: "仅自己可见" }]} className="w-full" /></Field><div className="rounded-lg border border-primary/20 bg-primary-soft p-4 text-sm text-text-muted">语言、时区与默认可见性目前仅保存在此浏览器。工作区名称和标识来自真实工作区契约。</div><button type="button" className="button-primary" onClick={save}>{saved ? "已保存到当前浏览器" : "保存偏好"}</button></div></section>
    <aside className="panel h-fit p-6"><h2 className="text-lg font-semibold">工作区概览</h2><div className="mt-5 divide-y divide-border"><Overview icon={<UsersThree size={22} />} label="可访问工作区" value={String(workspaces.length)} /><Overview icon={<Cube size={22} />} label="Agent 资产" value={demo ? String(DEMO_AGENTS.length) : "—"} /><Overview icon={<Buildings size={22} />} label="已接入应用端" value={demo ? String(DEMO_ADAPTERS.length) : "—"} /></div><div className="mt-5 rounded-lg bg-subtle p-4"><p className="text-xs text-text-muted">当前角色</p><p className="mt-1 font-semibold">{workspaces.find((item) => item.code === workspaceCode)?.role || "member"}</p></div></aside></div>;
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) { return <div><span className="font-medium">{label}</span>{hint && <span className="mt-1 block text-xs text-text-muted">{hint}</span>}<div className="mt-2">{children}</div></div>; }
function Overview({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="flex items-center gap-4 py-5 first:pt-0"><span className="grid size-11 place-items-center rounded-full bg-primary-soft text-primary">{icon}</span><div><p className="text-sm text-text-muted">{label}</p><p className="mt-1 text-2xl font-semibold">{value}</p></div></div>; }
