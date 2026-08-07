"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowRight,
  CheckCircle,
  ChatCircle,
  Copy,
  DesktopTower,
  DeviceMobile,
  DownloadSimple,
  Globe,
  Info,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import { capabilitySource, DATA_MODE } from "@/config/capabilities";
import { AgentAvatar } from "@/modules/agents/agent-avatar";
import { useAgent } from "@/modules/agents/queries";
import { useAuth } from "@/modules/auth/auth-provider";
import {
  createAgentExport,
  downloadAgentExport,
} from "@/modules/agent-versions/api";
import {
  useAgentClients,
  useAgentClientRuntimeVersion,
  useAgentVersions,
} from "@/modules/agent-versions/queries";
import type { AgentClient } from "@/modules/agent-versions/types";
import { useWorkspace } from "@/modules/workspace/workspace-provider";
import { ErrorState, LoadingState } from "@/shared/ui/request-state";
import { createShareLink, getShareLink, setShareLinkEnabled } from "./api";
import { canExportCurrentVersion, DEMO_SHARE_LINK, distributionPublishState } from "./model";
import type { ShareLink } from "./types";

function shortHash(value?: string | null) {
  return value ? value.slice(0, 12) : "—";
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function saveDownloadedPackage(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function formatFileSize(value: number) {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}

export function DistributionWorkspace() {
  const params = useParams<{ agentId: string }>();
  const agentId = Number(params.agentId);
  const agentQuery = useAgent(Number.isFinite(agentId) ? agentId : null);
  const versionsQuery = useAgentVersions(agentId);
  const clientsQuery = useAgentClients(agentId);
  const { session } = useAuth();
  const { workspaceCode } = useWorkspace();
  const demo = DATA_MODE === "demo";
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const runtimeQuery = useAgentClientRuntimeVersion(selectedClientId);
  const [shareLink, setShareLink] = useState<ShareLink | null>(null);
  const [shareBusy, setShareBusy] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"success" | "error">("success");
  const [shareLoadError, setShareLoadError] = useState("");

  useEffect(() => {
    const first = clientsQuery.data?.clients?.[0];
    if (selectedClientId === null && first) setSelectedClientId(first.id);
  }, [clientsQuery.data?.clients, selectedClientId]);

  useEffect(() => {
    if (demo) {
      setShareLink(DEMO_SHARE_LINK);
      setShareLoadError("");
      return;
    }
    if (!session?.apiKey || !Number.isFinite(agentId)) return;
    setShareLoadError("");
    void getShareLink(session.apiKey, agentId, workspaceCode)
      .then(setShareLink)
      .catch((error: Error) => {
        setShareLink(null);
        setShareLoadError(error.message || "无法读取公开分享状态");
      });
  }, [agentId, demo, session?.apiKey, workspaceCode]);

  if (
    agentQuery.isLoading ||
    versionsQuery.isLoading ||
    clientsQuery.isLoading
  ) {
    return <LoadingState label="正在加载 Client 运行状态…" />;
  }
  if (agentQuery.isError || versionsQuery.isError || clientsQuery.isError || !agentQuery.data) {
    return (
      <ErrorState
        message={agentQuery.error?.message || versionsQuery.error?.message || clientsQuery.error?.message || "无法加载发布状态"}
        onRetry={() => void Promise.all([agentQuery.refetch(), versionsQuery.refetch(), clientsQuery.refetch()])}
      />
    );
  }

  const agent = agentQuery.data;
  const versions = versionsQuery.data?.versions || [];
  const current = versions.find((item) => item.id === agent.current_version_id);
  const clients = clientsQuery.data?.clients || [];
  const selectedClient = clients.find((item) => item.id === selectedClientId);
  const auth = {
    apiKey: session?.apiKey || "",
    username: session?.username,
    workspaceCode,
  };
  const packageExportSource = capabilitySource("packageExport");
  const packageExportReady = canExportCurrentVersion(agent.current_version_id, packageExportSource);
  const publishState = distributionPublishState(agent.current_version_id);
  const enabled = clients.filter((item) => item.status === "enabled").length;
  const synced = clients.filter(
    (item) => item.status === "enabled" && item.last_ack_version_id === agent.current_version_id,
  ).length;
  const pending = clients.filter(
    (item) =>
      item.status === "enabled" &&
      item.last_ack_version_id !== agent.current_version_id,
  ).length;
  const disabled = clients.filter((item) => item.status === "disabled").length;

  function openExport() {
    setMessage("");
    setExportOpen(true);
  }

  async function retryShareLink() {
    if (demo) {
      setShareLink(DEMO_SHARE_LINK);
      setShareLoadError("");
      return;
    }
    if (!session?.apiKey) return;
    setShareLoadError("");
    try {
      setShareLink(await getShareLink(session.apiKey, agentId, workspaceCode));
    } catch (error) {
      setShareLoadError(error instanceof Error ? error.message : "无法读取公开分享状态");
    }
  }

  async function toggleShare() {
    if (!session?.apiKey) return;
    setShareBusy(true);
    setMessage("");
    setMessageTone("success");
    try {
      const next = demo
        ? { ...(shareLink || DEMO_SHARE_LINK), enabled: !shareLink?.enabled }
        : shareLink
        ? await setShareLinkEnabled(
            session.apiKey,
            agentId,
            workspaceCode,
            !shareLink.enabled,
          )
        : await createShareLink(session.apiKey, agentId, workspaceCode);
      setShareLink(next);
      setMessage(next.enabled ? "公开分享已启用。" : "公开分享已暂停。");
    } catch (error) {
      setMessageTone("error");
      setMessage(error instanceof Error ? error.message : "分享设置失败");
    } finally {
      setShareBusy(false);
    }
  }

  async function createExport() {
    if (!current || !packageExportReady) return;
    setExporting(true);
    setMessage("");
    setMessageTone("success");
    try {
      const result = await createAgentExport(auth, agentId);
      const download = await downloadAgentExport(auth, result.id);
      saveDownloadedPackage(download.blob, download.filename);
      setExportOpen(false);
      setMessage(
        `ZIP 版本包已导出（${formatFileSize(download.blob.size)}，Hash ${shortHash(download.packageHash || result.package_hash)}）。`,
      );
    } catch (error) {
      setMessageTone("error");
      setMessage(error instanceof Error ? error.message : "导出失败");
    } finally {
      setExporting(false);
    }
  }

  return (
    <section className="space-y-5 pb-8">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">发布中心</h1>
          <p className="mt-1 text-sm text-text-muted">
            查看已发布版本、Client 同步状态与公开分享
          </p>
        </div>
        <Link
          href={`/operations?module=moments&agentId=${agentId}`}
          className="button-secondary control-compact"
        >
          <ChatCircle size={17} />
          管理朋友圈
          <ArrowRight size={15} />
        </Link>
      </header>

      {message && (
        <div className={messageTone === "error" ? "error-feedback" : "rounded-lg border border-success/30 bg-primary-soft px-4 py-3 text-sm text-success"} role={messageTone === "error" ? "alert" : "status"}>
          {message}
        </div>
      )}

      <div className="panel flex flex-wrap items-center gap-4 px-5 py-4">
        <AgentAvatar agent={agent} size={48} />
        <div className="min-w-0">
          <strong className="block truncate text-lg">{agent.name}</strong>
          <span className={`status-badge mt-1 ${publishState.tone === "success" ? "status-success" : "status-warning"}`}>{publishState.label}</span>
        </div>
        <Link href={`/assets/${agentId}/build`} className="button-secondary ml-auto">进入工作室<ArrowRight size={16} /></Link>
      </div>

      <div className="panel flex flex-wrap items-center gap-x-7 gap-y-3 px-4 py-3.5">
        <strong>平台当前版本</strong>
        <span className="font-semibold text-primary">
          {current ? "v" + current.version_no : "尚未发布"}
        </span>
        <span className="hidden h-5 w-px bg-border sm:block" />
        <span>
          Hash&nbsp; {current ? shortHash(current.version_hash) : "—"}
        </span>
        <span className="hidden h-5 w-px bg-border sm:block" />
        <span>
          已启用 {enabled} 个 Client
        </span>
        <span className="inline-flex items-center gap-2 text-success">
          <span className="size-2 rounded-full bg-success" />
          {synced} 个已同步
        </span>
        <span className="inline-flex items-center gap-2 text-warning">
          <span className="size-2 rounded-full bg-warning" />
          {pending} 个等待同步
        </span>
        <span className="inline-flex items-center gap-2 text-text-muted">
          <span className="size-2 rounded-full bg-slate-400" />
          {disabled} 个已停用
        </span>
        <div className="ml-auto text-right">
          <button
            type="button"
            className="button-secondary"
            disabled={!packageExportReady}
            onClick={openExport}
            title={
              packageExportSource !== "live"
                ? "后端 ZIP 下载接口尚未就绪"
                : undefined
            }
          >
            <DownloadSimple size={16} />
            导出当前版本
          </button>
          {current && packageExportSource !== "live" && (
            <p className="mt-1 text-xs text-text-muted">
              ZIP 下载接口尚未就绪
            </p>
          )}
        </div>
      </div>

      <div className="grid min-h-[480px] gap-4 lg:grid-cols-[minmax(360px,0.92fr)_minmax(0,1.38fr)]">
        <div className="panel overflow-hidden">
          <div className="border-b border-border px-5 py-3.5">
            <h2 className="font-semibold">Client</h2>
          </div>
          {clients.length ? (
            <div className="divide-y divide-border">
              {clients.map((client) => (
                <ClientRow
                  key={client.id}
                  client={client}
                  currentVersionId={agent.current_version_id}
                  selected={client.id === selectedClientId}
                  onSelect={() => setSelectedClientId(client.id)}
                />
              ))}
            </div>
          ) : (
            <div className="grid min-h-80 place-items-center px-6 text-center text-sm text-text-muted">
              尚未配置 Client。请先在 Clients 中添加接入端。
            </div>
          )}
        </div>

        <div className="panel min-w-0 overflow-hidden">
          {runtimeQuery.isLoading ? (
            <LoadingState label="正在读取跟随状态…" />
          ) : runtimeQuery.isError ? (
            <ErrorState message={runtimeQuery.error.message || "无法读取 Client 跟随状态"} onRetry={() => void runtimeQuery.refetch()} />
          ) : runtimeQuery.data && selectedClient ? (
            <ClientDetail
              client={selectedClient}
              currentVersionId={agent.current_version_id}
              runtime={runtimeQuery.data}
            />
          ) : (
            <div className="grid min-h-[480px] place-items-center text-sm text-text-muted">
              选择 Client 查看详情
            </div>
          )}
        </div>
      </div>

      <div className="panel flex flex-wrap items-center gap-4 px-5 py-4">
        <Globe size={20} className="text-primary" />
        <div>
          <h3 className="font-semibold">网页公开分享</h3>
          <p className="mt-0.5 text-xs text-text-muted">
            公开页面始终使用平台当前版本
          </p>
        </div>
        {shareLoadError ? (
          <div className="error-feedback ml-auto flex items-center gap-3"><span>{shareLoadError}</span><button type="button" className="button-secondary control-compact" onClick={() => void retryShareLink()}>重试</button></div>
        ) : shareLink?.share_url && (
          <button
            type="button"
            className="ml-auto flex max-w-sm items-center gap-2 truncate rounded-md bg-subtle px-3 py-2 text-xs"
            onClick={() =>
              void navigator.clipboard.writeText(shareLink.share_url || "")
            }
          >
            <span className="truncate">{shareLink.share_url}</span>
            <Copy size={15} />
          </button>
        )}
        <button
          type="button"
          className="button-secondary"
          disabled={shareBusy || !current || Boolean(shareLoadError)}
          onClick={() => void toggleShare()}
        >
          {shareBusy
            ? "处理中…"
            : shareLink?.enabled
              ? "暂停公开分享"
              : "启用公开分享"}
        </button>
      </div>

      {exportOpen && current && (
        <ExportDialog
          currentVersionNo={current.version_no}
          currentHash={current.version_hash}
          exporting={exporting}
          onClose={() => !exporting && setExportOpen(false)}
          onExport={() => void createExport()}
        />
      )}
    </section>
  );
}

function ClientRow({
  client,
  currentVersionId,
  selected,
  onSelect,
}: {
  client: AgentClient;
  currentVersionId?: number | null;
  selected: boolean;
  onSelect: () => void;
}) {
  const synced = client.last_ack_version_id === currentVersionId;
  const disabled = client.status === "disabled";
  return (
    <div
      className={
        "flex items-center gap-3 px-4 py-4 transition " +
        (selected ? "bg-primary-soft/60" : "hover:bg-subtle")
      }
    >
      <button
        type="button"
        onClick={onSelect}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <span
          className={
            "grid size-10 shrink-0 place-items-center rounded-lg " +
            (disabled ? "bg-slate-500 text-white" : "bg-primary text-canvas")
          }
        >
          <ClientIcon client={client} />
        </span>
        <span className="min-w-0">
          <strong className="block truncate">{client.name}</strong>
          <span className="mt-0.5 block truncate text-xs text-text-muted">
            {isLocalClient(client)
              ? "本地 Client"
              : client.client_type.includes("web")
                ? "AgentHub 托管"
                : "远程 Client"}
          </span>
        </span>
        <span
          className={
            "ml-auto inline-flex items-center gap-1.5 text-xs " +
            (disabled ? "text-text-muted" : "text-success")
          }
        >
          <span
            className={
              "size-2 rounded-full " +
              (disabled ? "bg-slate-400" : "bg-success")
            }
          />
          {disabled ? "已停用" : "在线"}
        </span>
        <span
          className={
            "min-w-28 text-right text-xs " +
            (synced ? "text-success" : "text-warning")
          }
        >
          {disabled
            ? "停止跟随"
            : synced
              ? "已跟随平台当前版本"
              : "等待下次同步"}
        </span>
        {!isLocalClient(client) && (
          <ArrowRight size={17} className="text-text-muted" />
        )}
      </button>
    </div>
  );
}

function ClientDetail({
  client,
  currentVersionId,
  runtime,
}: {
  client: AgentClient;
  currentVersionId?: number | null;
  runtime: import("@/modules/agent-versions/types").AgentClientRuntimeVersion;
}) {
  const synced = client.last_ack_version_id === currentVersionId;
  const capabilities = client.capability_manifest?.capabilities || [];
  return (
    <div className="flex min-h-[480px] flex-col">
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <span className="grid size-10 place-items-center rounded-lg bg-primary text-canvas">
          <ClientIcon client={client} />
        </span>
        <div>
          <h3 className="text-lg font-semibold">{client.name}</h3>
          <div className="mt-1 flex gap-2 text-xs">
            <span className="status-badge status-success">
              {client.status === "enabled" ? "在线" : "已停用"}
            </span>
            <span className="status-badge status-success">
              跟随平台当前版本
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-3 p-5">
        <div
          className={
            "grid grid-cols-3 rounded-md border px-4 py-3 text-sm " +
            (synced
              ? "border-emerald-200 bg-emerald-50/70 dark:border-emerald-400/20 dark:bg-emerald-400/10"
              : "border-amber-200 bg-amber-50/70 dark:border-amber-400/20 dark:bg-amber-400/10")
          }
        >
          <InfoItem
            label="当前确认"
            value={
              runtime.current_version_no
                ? "v" + runtime.current_version_no
                : "尚未发布"
            }
          />
          <InfoItem
            label="Hash"
            value={shortHash(runtime.current_version_hash)}
          />
          <span
            className={
              "flex items-center justify-end gap-2 font-medium " +
              (synced ? "text-success" : "text-warning")
            }
          >
            {synced ? (
              <CheckCircle size={18} weight="fill" />
            ) : (
              <WarningCircle size={18} weight="fill" />
            )}
            {synced ? "已同步" : "等待同步"}
          </span>
        </div>

        <DetailCard title="Client 配置">
          <InfoGrid
            label="互动方式"
            value={String(
              client.config?.interaction_mode || client.client_type,
            )}
          />
          <InfoGrid
            label="陪伴模式"
            value={String(client.config?.companion_mode || "默认")}
          />
          <InfoGrid label="可用技能" value={capabilities.length + " 项"} />
          <InfoGrid
            label="能力 Hash"
            value={maskCapabilityHash(client.capability_hash)}
          />
        </DetailCard>

        <DetailCard title="同步信息">
          <InfoGrid label="最近确认" value={formatDate(client.last_seen_at)} />
          <InfoGrid
            label="连接状态"
            value={client.last_seen_at ? "正常" : "尚未连接"}
          />
          <InfoGrid label="版本策略" value="自动跟随平台当前版本" />
          <InfoGrid label="Client 类型" value={client.client_type} />
        </DetailCard>

        <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-700 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-200">
          <Info size={16} className="mr-2 inline" />新 Session
          使用平台当前版本；已有 Session 继续使用创建时绑定的版本。
        </div>
      </div>
    </div>
  );
}

function ExportDialog({
  currentVersionNo,
  currentHash,
  exporting,
  onClose,
  onExport,
}: {
  currentVersionNo: number;
  currentHash: string;
  exporting: boolean;
  onClose: () => void;
  onExport: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-slate-950/45 p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[480px] flex-col overflow-hidden rounded-xl bg-surface shadow-2xl sm:max-h-[calc(100dvh-2rem)]">
        <header className="flex shrink-0 items-start justify-between border-b border-border px-6 py-4">
          <div>
            <h3 className="text-xl font-bold">导出当前版本</h3>
            <p className="mt-1 text-sm text-text-muted">
              生成并下载可部署的 ZIP 版本包
            </p>
          </div>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-md hover:bg-subtle"
            onClick={onClose}
            aria-label="关闭"
          >
            <X size={20} />
          </button>
        </header>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-6 py-5">
          <div className="rounded-md border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-400/20 dark:bg-emerald-400/10">
            <p className="text-xs text-success">平台当前版本</p>
            <div className="mt-2 flex items-center justify-between">
              <strong className="text-lg">v{currentVersionNo}</strong>
              <span className="text-sm">
                Version Hash&nbsp; {shortHash(currentHash)}
              </span>
            </div>
            <p className="mt-2 text-xs text-text-muted">只能导出平台当前版本</p>
          </div>
          <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-200">
            生成通用 Agent 版本包，无需关联 Client。包内包含平台当前版本冻结的配置、技能与媒体资源。
          </div>
          <div>
            <h4 className="text-sm font-semibold">ZIP 版本包内容</h4>
            <div className="mt-2 overflow-hidden rounded-md border border-border">
              <PackageRow label="Agent 配置" value="平台当前版本" />
              <PackageRow label="资源清单" value="版本引用" />
              <PackageRow label="能力要求" value="版本引用" />
              <PackageRow label="Client 配置" value="不包含" />
            </div>
          </div>
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
            检查通过，可以导出。导出内容固定为当前版本，不会随后续发布自动更新。
          </div>
        </div>
        <footer className="flex shrink-0 justify-end gap-2 border-t border-border bg-surface px-6 py-4">
          <button
            type="button"
            className="button-secondary"
            onClick={onClose}
            disabled={exporting}
          >
            取消
          </button>
          <button
            type="button"
            className="button-primary"
            onClick={onExport}
            disabled={exporting}
          >
            <DownloadSimple size={17} />
            {exporting ? "正在生成版本包…" : "导出 ZIP"}
          </button>
        </footer>
      </div>
    </div>
  );
}

function DetailCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-border">
      <h4 className="border-b border-border px-4 py-2.5 text-sm font-semibold">
        {title}
      </h4>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-2 px-4 py-3">{children}</dl>
    </div>
  );
}

function InfoGrid({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-sm">
      <dt className="min-w-20 text-text-muted">{label}</dt>
      <dd className="truncate font-medium">{value}</dd>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <span>
      <span className="block text-xs text-text-muted">{label}</span>
      <strong className="mt-1 block">{value}</strong>
    </span>
  );
}

function PackageRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center border-b border-border px-4 py-2.5 text-sm last:border-b-0">
      <CheckCircle size={17} weight="fill" className="mr-2 text-success" />
      <span>{label}</span>
      <span className="ml-auto text-text-muted">{value}</span>
    </div>
  );
}

function ClientIcon({ client }: { client: AgentClient }) {
  if (isLocalClient(client)) return <DesktopTower size={21} />;
  if (client.client_type.includes("web")) return <Globe size={21} />;
  if (
    client.client_type.includes("mobile") ||
    client.client_type.includes("h5")
  )
    return <DeviceMobile size={21} />;
  return <ChatCircle size={21} />;
}

function isLocalClient(client: AgentClient) {
  return (
    client.client_type.includes("local") ||
    client.client_type.includes("desktop") ||
    client.client_type.includes("edge")
  );
}

function maskCapabilityHash(value?: string | null) {
  const hash = shortHash(value);
  if (hash === "—") return hash;
  return hash.length > 7 ? `${hash.slice(0, 4)}***${hash.slice(-3)}` : `${hash.slice(0, 2)}***`;
}
