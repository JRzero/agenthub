"use client";

import Link from "next/link";
import { useState } from "react";
import { ImageSquare, Layout, LockKey } from "@phosphor-icons/react";
import { KnowledgeLibrary } from "./knowledge-library";
import { SkillsLibrary } from "./skills-library";
import type { ResourceTab } from "./types";

const tabs: Array<{ id: "assets" | ResourceTab; label: string }> = [
  { id: "assets", label: "Agent 资产" },
  { id: "skills", label: "技能库" },
  { id: "knowledge", label: "知识库" },
  { id: "media", label: "媒体资产" },
  { id: "templates", label: "模板" },
];

export function ResourcesWorkspace() {
  const [tab, setTab] = useState<ResourceTab>("skills");
  return (
    <div className="-mx-4 -mt-6 bg-surface sm:-mx-6 lg:-mx-7">
      <header className="border-b border-border px-4 pt-6 sm:px-6 lg:px-7">
        <h1 className="text-2xl font-bold tracking-tight">资产库</h1>
        <nav className="mt-3 flex gap-7 overflow-x-auto" aria-label="资源库分类">
          {tabs.map((item) => item.id === "assets" ? (
            <Link key={item.id} href="/assets" className="whitespace-nowrap border-b-2 border-transparent px-1 pb-3 text-sm text-text-muted hover:text-primary">{item.label}</Link>
          ) : (
            <button key={item.id} type="button" onClick={() => setTab(item.id as ResourceTab)} className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-medium ${tab === item.id ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-text-strong"}`}>{item.label}</button>
          ))}
        </nav>
      </header>

      {tab === "skills" && <SkillsLibrary />}
      {tab === "knowledge" && <KnowledgeLibrary />}
      {tab === "media" && <UnavailableResource icon={ImageSquare} title="媒体资产" description="头像、设定图、语音、视频与分享图需要统一媒体资产接口；现有 Agent 头像仍在 Build 工作区使用真实上传契约。" />}
      {tab === "templates" && <UnavailableResource icon={Layout} title="模板" description="可复用 Agent、Adapter 和评估模板尚无后端对象，当前不会把本地示例伪装成工作空间资产。" />}
    </div>
  );
}

function UnavailableResource({ icon: Icon, title, description }: { icon: typeof ImageSquare; title: string; description: string }) {
  return <div className="flex min-h-[560px] items-center justify-center p-6"><div className="max-w-lg text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary-soft text-primary"><Icon size={28} /></span><h2 className="mt-4 text-xl font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-text-muted">{description}</p><div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200"><LockKey size={18} />等待真实资源契约</div></div></div>;
}
