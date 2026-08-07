import type { Icon } from "@phosphor-icons/react";
import { ChatCircleDots, Code, Globe, Stack } from "@phosphor-icons/react";
import type { CapabilitySource } from "@/config/capabilities";
import type { ClientAdapter } from "./model";
import { SourceBadge } from "@/shared/ui/source-badge";

const statusCopy = {
  running: { label: "运行中", className: "status-info" },
  outdated: { label: "待更新", className: "status-warning" },
  draft: { label: "草稿", className: "status-warning" },
};

function AdapterIcon({ id, core }: { id: string; core?: boolean }) {
  let Icon: Icon = Stack;
  let className = "bg-primary-soft text-primary";
  if (id.includes("oyiioyii")) Icon = ChatCircleDots;
  if (id.includes("web")) {
    Icon = Globe;
    className = "bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300";
  }
  if (id.includes("api")) {
    Icon = Code;
    className = "bg-orange-50 text-orange-600 dark:bg-orange-400/10 dark:text-orange-300";
  }
  return (
    <span className={`flex h-9 w-9 items-center justify-center rounded-md ${className}`}>
      <Icon size={core ? 24 : 21} weight={core ? "duotone" : "regular"} />
    </span>
  );
}

function AdapterRow({ adapter, child }: { adapter: ClientAdapter; child?: boolean }) {
  const copy = statusCopy[adapter.status];
  return (
    <div className={`relative flex min-h-[74px] items-center gap-3 rounded-md border border-border bg-surface px-4 ${child ? "ml-9" : ""}`}>
      <AdapterIcon id={adapter.id} core={!child} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{adapter.name} {adapter.version}</p>
        {adapter.publishedAt && <p className="mt-1 text-xs text-text-muted">发布：{adapter.publishedAt}</p>}
      </div>
      <span className={`status-badge ${copy.className}`}>{copy.label}</span>
    </div>
  );
}

export function AdapterPanel({ adapters, source }: { adapters: ClientAdapter[]; source: CapabilitySource }) {
  if (adapters.length === 0) {
    return (
      <section className="panel p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold">版本与 Client 适配</h2>
          <SourceBadge source={source} />
        </div>
        <div className="mt-4 rounded-md border border-dashed border-border px-5 py-10 text-center">
          <p className="font-medium">Client Adapter API 尚未接入</p>
          <p className="mt-2 text-sm leading-6 text-text-muted">当前不会创建或修改任何虚假的生产适配配置。</p>
        </div>
      </section>
    );
  }

  const [core, ...children] = adapters;
  return (
    <section className="panel p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold">版本与 Client 适配</h2>
        <SourceBadge source={source} />
      </div>
      <div className="mt-4 space-y-2.5">
        <AdapterRow adapter={core} />
        <div className="space-y-2.5 border-l border-border pl-0.5">
          {children.map((adapter) => <AdapterRow key={adapter.id} adapter={adapter} child />)}
        </div>
      </div>
      <button type="button" disabled className="mt-3 h-9 w-full rounded-md border border-primary/50 text-sm font-medium text-primary opacity-60">
        + 添加 Client 适配
      </button>
    </section>
  );
}
