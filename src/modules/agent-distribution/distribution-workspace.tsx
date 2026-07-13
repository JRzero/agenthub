"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Cards, DownloadSimple, PaperPlaneTilt } from "@phosphor-icons/react";
import { DATA_MODE } from "@/config/capabilities";
import { useAgent } from "@/modules/agents/queries";
import { useAuth } from "@/modules/auth/auth-provider";
import { useWorkspace } from "@/modules/workspace/workspace-provider";
import { ErrorState, LoadingState } from "@/shared/ui/request-state";
import { SourceBadge } from "@/shared/ui/source-badge";
import { createShareLink, getShareLink, setShareLinkEnabled } from "./api";
import { DistributionChannelTable } from "./distribution-channel-table";
import { DistributionDialog } from "./distribution-dialog";
import { DistributionSidePanel } from "./distribution-side-panel";
import { DEMO_SHARE_LINK, buildDistributionChannels, buildPublicAgentCard } from "./model";
import type {
  DistributionChannel,
  DistributionChannelId,
  DistributionDialogKind,
  ShareLink,
} from "./types";

export function DistributionWorkspace() {
  const params = useParams<{ agentId: string }>();
  const router = useRouter();
  const agentId = Number(params.agentId);
  const agentQuery = useAgent(Number.isFinite(agentId) ? agentId : null);
  const { session } = useAuth();
  const { workspaceCode } = useWorkspace();
  const demo = DATA_MODE === "demo";
  const [shareLink, setShareLink] = useState<ShareLink | null>(demo ? DEMO_SHARE_LINK : null);
  const [shareLoading, setShareLoading] = useState(!demo);
  const [loadError, setLoadError] = useState("");
  const [busyChannel, setBusyChannel] = useState<DistributionChannelId | null>(null);
  const [paused, setPaused] = useState(false);
  const [dialog, setDialog] = useState<DistributionDialogKind>(null);
  const [unsupportedMessage, setUnsupportedMessage] = useState("");
  const [toast, setToast] = useState("");
  const [overrides, setOverrides] = useState<Record<string, Partial<DistributionChannel>>>({});

  useEffect(() => {
    if (demo || !session?.apiKey || !Number.isFinite(agentId)) return;
    let active = true;
    setShareLoading(true);
    getShareLink(session.apiKey, agentId, workspaceCode)
      .then((result) => {
        if (active) setShareLink(result);
      })
      .catch((error: Error) => {
        if (active) setLoadError(error.message || "无法读取公开分享状态");
      })
      .finally(() => {
        if (active) setShareLoading(false);
      });
    return () => {
      active = false;
    };
  }, [agentId, demo, session?.apiKey, workspaceCode]);

  const channels = useMemo(
    () =>
      agentQuery.data
        ? buildDistributionChannels(agentQuery.data, { demo, shareLink, paused, overrides })
        : [],
    [agentQuery.data, demo, overrides, paused, shareLink],
  );
  const publicCard = useMemo(
    () => (agentQuery.data ? buildPublicAgentCard(agentQuery.data, shareLink) : null),
    [agentQuery.data, shareLink],
  );

  if (agentQuery.isLoading || shareLoading) return <LoadingState label="正在读取发行状态…" />;
  if (agentQuery.isError || !agentQuery.data || !publicCard) {
    return <ErrorState message={agentQuery.error?.message || "无法打开发行控制台"} onRetry={() => void agentQuery.refetch()} />;
  }
  const agent = agentQuery.data;

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  function openUnsupported(message: string) {
    setUnsupportedMessage(message);
    setDialog("unsupported");
  }

  async function updateWebShare(enabled = true) {
    if (demo) {
      setShareLink((current) => (current ? { ...current, enabled } : { ...DEMO_SHARE_LINK, enabled }));
      setPaused(!enabled);
      notify(enabled ? "演示分享链接已启用" : "演示分享链接已暂停");
      return;
    }
    if (!session?.apiKey) return;
    setBusyChannel("web-chat");
    try {
      const next = shareLink
        ? await setShareLinkEnabled(session.apiKey, agentId, workspaceCode, enabled)
        : await createShareLink(session.apiKey, agentId, workspaceCode);
      setShareLink(next);
      setPaused(!next.enabled);
      notify(next.enabled ? "公开分享链接已启用" : "公开分享链接已暂停");
    } catch (error) {
      notify(error instanceof Error ? error.message : "分享链接操作失败");
    } finally {
      setBusyChannel(null);
    }
  }

  function copyShareUrl(url: string) {
    const textarea = document.createElement("textarea");
    textarea.value = url;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = typeof document.execCommand === "function" && document.execCommand("copy");
    textarea.remove();
    if (!copied && navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(url).catch(() => undefined);
    }
    notify(copied ? "分享链接已复制" : "复制请求已发送");
  }

  async function handleChannelAction(channel: DistributionChannel) {
    if (channel.id === "web-chat") {
      if (channel.status === "running" && channel.shareUrl) await copyShareUrl(channel.shareUrl);
      else await updateWebShare(true);
      return;
    }
    if (!demo) {
      openUnsupported(`${channel.name} 尚无发布或 Adapter 配置接口；当前只接入了真实的网页公开分享能力。`);
      return;
    }
    if (channel.status === "running") {
      notify(`${channel.name} 已在演示环境运行`);
      return;
    }
    setBusyChannel(channel.id);
    setOverrides((current) => ({
      ...current,
      [channel.id]: {
        status: "running",
        statusLabel: "运行中",
        compatibility: "compatible",
        compatibilityLabel: "完全兼容",
        compatibilityHint: "演示配置已就绪",
        publishedAt: new Date().toLocaleString("zh-CN", { hour12: false }).replaceAll("/", "-"),
        publishedBy: "李然",
        actionLabel: undefined,
      },
    }));
    window.setTimeout(() => {
      setBusyChannel(null);
      notify(`${channel.name} 已在当前演示会话发布`);
    }, 350);
  }

  function publishVersion() {
    if (!demo) {
      openUnsupported("后端目前没有版本发行编排接口。真实模式保留当前分享链接操作，其余 Client 发布不会被伪造。");
      return;
    }
    setPaused(false);
    setShareLink({ ...DEMO_SHARE_LINK, enabled: true });
    setOverrides((current) => ({
      ...current,
      oyiioyii: { status: "running", statusLabel: "运行中", version: `${agent.version || 1}.0` },
      "web-chat": { status: "running", statusLabel: "运行中", version: `${agent.version || 1}.0` },
    }));
    notify(`演示版本 v${agent.version || 1}.0 已发布`);
  }

  function downloadCard() {
    const blob = new Blob([JSON.stringify(publicCard, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${agent.code || "agent"}-public-card.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    notify("Public Agent Card 已生成");
  }

  return (
    <section className="relative space-y-6 pb-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">发行控制台</h1>
            <SourceBadge source={demo ? "demo" : "live"} />
          </div>
          <p className="mt-2 text-sm text-text-muted">将 Agent 版本 {agent.version || 1}.0 发布到多个应用端，并查看兼容性与发布状态。</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={publishVersion} className="button-primary"><PaperPlaneTilt size={17} />发布新版本</button>
          <button type="button" onClick={() => setDialog("agent-card")} className="button-secondary"><Cards size={17} />生成 Agent 卡片</button>
          <button type="button" onClick={() => setDialog("export")} className="button-secondary"><DownloadSimple size={17} />导出资产</button>
        </div>
      </div>

      {loadError && <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">公开分享状态读取失败：{loadError}。其他端仍按未接入展示。</div>}

      <div className="grid gap-7 min-[1400px]:grid-cols-[minmax(0,1fr)_310px]">
        <DistributionChannelTable channels={channels} busyChannel={busyChannel} onAction={(channel) => void handleChannelAction(channel)} />
        <DistributionSidePanel
          demo={demo}
          paused={paused}
          canPauseLiveShare={Boolean(shareLink)}
          onOpen={setDialog}
          onRollback={() => router.push(`/assets/${agentId}/versions`)}
          onPause={() => void updateWebShare(paused || !shareLink?.enabled)}
        />
      </div>

      {toast && <div role="status" className="fixed bottom-6 right-6 z-50 rounded-lg bg-slate-950 px-4 py-3 text-sm font-medium text-white shadow-xl">{toast}</div>}
      {dialog && (
        <DistributionDialog
          kind={dialog}
          card={publicCard}
          demo={demo}
          unsupportedMessage={unsupportedMessage}
          onClose={() => setDialog(null)}
          onDownloadCard={downloadCard}
        />
      )}
    </section>
  );
}



