"use client";

import { useMemo, useState } from "react";
import type { Icon } from "@phosphor-icons/react";
import {
  BookOpenText,
  ChatText,
  CheckCircle,
  Heart,
  MagnifyingGlass,
  Plus,
  ShieldCheck,
  Warning,
} from "@phosphor-icons/react";
import type { TestScenario } from "./types";

const scenarioIcons: Record<string, Icon> = {
  "new-user": ChatText,
  "long-term": Heart,
  emotion: Warning,
  boundary: ShieldCheck,
  knowledge: BookOpenText,
};

function Status({ scenario }: { scenario: TestScenario }) {
  if (scenario.status === "passed") {
    return <span className="inline-flex items-center gap-1 text-[11px] text-success"><CheckCircle size={12} weight="fill" />通过</span>;
  }
  if (scenario.status === "partial") {
    return <span className="inline-flex items-center gap-1 text-[11px] text-warning"><Warning size={12} weight="fill" />部分通过</span>;
  }
  return <span className="text-[11px] text-text-muted">{scenario.local ? "本地场景" : "待运行"}</span>;
}

export function ScenarioPanel({
  scenarios,
  selectedId,
  onSelect,
  onCreate,
}: {
  scenarios: TestScenario[];
  selectedId: string;
  onSelect: (id: string) => void;
  onCreate: (name: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const visible = useMemo(
    () => scenarios.filter((item) => `${item.name} ${item.goal}`.toLowerCase().includes(search.trim().toLowerCase())),
    [scenarios, search],
  );

  const submit = () => {
    if (!newName.trim()) return;
    onCreate(newName);
    setNewName("");
    setCreating(false);
  };

  return (
    <aside className="flex min-h-0 flex-col border-b border-border bg-surface xl:border-b-0 xl:border-r">
      <div className="border-b border-border p-4">
        <h2 className="text-base font-semibold">测试场景</h2>
        <label className="mt-4 flex items-center gap-2 rounded-lg border border-border px-3 py-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
          <MagnifyingGlass size={17} className="text-text-muted" />
          <span className="sr-only">搜索场景</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索场景" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
        </label>
      </div>

      <div className="flex gap-2 overflow-x-auto p-3 xl:flex-1 xl:flex-col xl:overflow-y-auto xl:p-4">
        {visible.map((scenario) => {
          const Icon = scenarioIcons[scenario.id] || ChatText;
          const selected = scenario.id === selectedId;
          return (
            <button
              key={scenario.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(scenario.id)}
              className={`flex min-w-[190px] items-start gap-3 rounded-lg border px-3 py-3 text-left transition xl:min-w-0 xl:w-full ${
                selected ? "border-primary bg-primary-soft" : "border-transparent hover:border-border hover:bg-subtle"
              }`}
            >
              <Icon size={21} className={selected ? "text-primary" : "text-text-muted"} />
              <span className="min-w-0">
                <strong className="block truncate text-sm">{scenario.name}</strong>
                <Status scenario={scenario} />
              </span>
            </button>
          );
        })}
        {visible.length === 0 && <p className="p-4 text-center text-sm text-text-muted">没有匹配的场景</p>}
      </div>

      <div className="border-t border-border p-4">
        {creating ? (
          <div className="space-y-2">
            <input autoFocus aria-label="新场景名称" value={newName} onChange={(event) => setNewName(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") submit(); }} placeholder="场景名称" className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
            <div className="flex gap-2">
              <button type="button" onClick={submit} className="button-primary min-h-9 flex-1 px-3">创建</button>
              <button type="button" onClick={() => setCreating(false)} className="button-secondary min-h-9 px-3">取消</button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => setCreating(true)} className="button-secondary w-full"><Plus size={17} />新建场景</button>
        )}
      </div>
    </aside>
  );
}
