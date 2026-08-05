"use client";

import { useState } from "react";
import { KnowledgeLibrary } from "./knowledge-library";
import { SkillsLibrary } from "./skills-library";
import type { ResourceTab } from "./types";

const tabs: Array<{ id: ResourceTab; label: string }> = [
  { id: "skills", label: "技能库" },
  { id: "knowledge", label: "知识库" },
];

export function ResourcesWorkspace() {
  const [tab, setTab] = useState<ResourceTab>("skills");
  return (
    <div className="-mx-4 -mt-6 min-h-[calc(100vh-56px)] bg-canvas sm:-mx-6 lg:-mx-7">
      <header className="border-b border-border px-4 pt-7 sm:px-6 lg:px-7">
        <h1 className="text-[28px] font-semibold tracking-tight">资源</h1>
        <p className="mt-1 text-sm text-text-secondary">管理可被 Agent 复用的技能与知识</p>
        <nav className="mt-5 flex gap-8 overflow-x-auto" aria-label="资源分类">
          {tabs.map((item) => (
            <button key={item.id} type="button" onClick={() => setTab(item.id)} className={`whitespace-nowrap border-b-[3px] px-2 pb-3 text-sm font-medium transition-colors ${tab === item.id ? "border-primary text-primary" : "border-transparent text-text-secondary hover:text-text-strong"}`}>{item.label}</button>
          ))}
        </nav>
      </header>

      {tab === "skills" && <SkillsLibrary />}
      {tab === "knowledge" && <KnowledgeLibrary />}
    </div>
  );
}
