import { DownloadSimple, LockKey, X } from "@phosphor-icons/react";
import type { DistributionDialogKind, PublicAgentCard } from "./types";

const governanceCopy: Record<
  Exclude<DistributionDialogKind, "agent-card" | "export" | "unsupported" | null>,
  { title: string; description: string; items: string[] }
> = {
  license: {
    title: "授权清单",
    description: "授权范围需要由版本、应用端、有效期和商业权限共同约束。",
    items: ["可运行 Client", "有效期与地区", "商用及二次分发", "收益与分成规则"],
  },
  "export-policy": {
    title: "导出权限",
    description: "当前仅支持安全的 Public Agent Card 前端导出。",
    items: ["View Only", "Embed", "Trusted Runtime", "Licensed Export"],
  },
  memory: {
    title: "记忆边界",
    description: "角色资产可以迁移，用户关系记忆默认不能跨端导出。",
    items: ["Agent Self Memory 可按授权导出", "User Relationship Memory 默认不可导出", "Session Summary 需脱敏与审计"],
  },
  safety: {
    title: "安全策略",
    description: "内容安全、IP 边界和拒答规则应绑定到具体发行版本。",
    items: ["敏感内容策略", "版权与肖像权", "工具调用边界", "风险暂停与撤销"],
  },
  audit: {
    title: "审计记录",
    description: "发行、授权、导出和回滚都应形成可追踪事件。",
    items: ["操作者与时间", "目标 Client 与版本", "授权范围变化", "暂停、撤销与恢复"],
  },
};

export function DistributionDialog({
  kind,
  card,
  demo,
  unsupportedMessage,
  onClose,
  onDownloadCard,
}: {
  kind: Exclude<DistributionDialogKind, null>;
  card: PublicAgentCard;
  demo: boolean;
  unsupportedMessage: string;
  onClose: () => void;
  onDownloadCard: () => void;
}) {
  const heading =
    kind === "agent-card"
      ? "Public Agent Card"
      : kind === "export"
        ? "导出资产"
        : kind === "unsupported"
          ? "能力待接入"
          : governanceCopy[kind].title;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4" role="presentation" onMouseDown={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="distribution-dialog-title"
        className="max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-xl border border-border bg-surface shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 id="distribution-dialog-title" className="text-lg font-semibold">{heading}</h2>
            <p className="mt-1 text-xs text-text-muted">{demo ? "演示模式 · 不写入生产数据" : "真实数据模式"}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-2 text-text-muted hover:bg-subtle" aria-label="关闭弹窗">
            <X size={19} />
          </button>
        </header>

        <div className="p-5">
          {kind === "agent-card" && (
            <>
              <p className="text-sm leading-6 text-text-muted">只包含公开身份、介绍、版本和分享地址，不包含 system prompt、知识库绑定或用户关系记忆。</p>
              <pre className="mt-4 max-h-72 overflow-auto rounded-lg bg-slate-950 p-4 text-xs leading-6 text-slate-100">{JSON.stringify(card, null, 2)}</pre>
              <button type="button" onClick={onDownloadCard} className="button-primary mt-4">
                <DownloadSimple size={17} />下载 Public Agent Card
              </button>
            </>
          )}

          {kind === "export" && (
            <div className="space-y-3">
              <ExportRow title="Public Agent Card" description="公开身份、介绍、版本与分享地址" available onDownload={onDownloadCard} />
              <ExportRow title="Persona Package" description="角色设定、口吻、禁区与示例对话" />
              <ExportRow title="Runtime Package" description="运行配置、工具声明与 RAG 引用" />
              <ExportRow title="License Manifest" description="授权对象、期限、范围与商用限制" />
              <p className="rounded-lg bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900 dark:bg-amber-400/10 dark:text-amber-200">受控资产包需要后端导出、授权签名与审计接口；当前不在浏览器内拼装伪生产包。</p>
            </div>
          )}

          {kind === "unsupported" && (
            <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-4 text-amber-950 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200">
              <LockKey className="mt-0.5 shrink-0" size={21} />
              <div>
                <p className="font-medium">当前操作未连接生产端点</p>
                <p className="mt-2 text-sm leading-6 text-amber-900/80 dark:text-amber-200/80">{unsupportedMessage}</p>
              </div>
            </div>
          )}

          {!(["agent-card", "export", "unsupported"] as string[]).includes(kind) && (
            <>
              <p className="text-sm leading-6 text-text-muted">{governanceCopy[kind as keyof typeof governanceCopy].description}</p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {governanceCopy[kind as keyof typeof governanceCopy].items.map((item) => (
                  <li key={item} className="rounded-lg border border-border bg-subtle/60 px-3 py-3 text-sm">{item}</li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-5 text-text-muted">界面已保留治理入口；真实配置与历史读取等待后端契约后再开放写入。</p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function ExportRow({ title, description, available = false, onDownload }: { title: string; description: string; available?: boolean; onDownload?: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
      <div className="min-w-0 flex-1">
        <strong className="text-sm">{title}</strong>
        <p className="mt-1 text-xs text-text-muted">{description}</p>
      </div>
      {available ? (
        <button type="button" onClick={onDownload} className="min-h-8 rounded border border-primary/50 px-3 text-xs font-medium text-primary hover:bg-primary-soft">下载</button>
      ) : (
        <span className="status-badge status-neutral">待接入</span>
      )}
    </div>
  );
}
