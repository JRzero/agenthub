import type { Icon } from "@phosphor-icons/react";
import {
  ChatCircleDots,
  Code,
  DeviceMobile,
  Storefront,
} from "@phosphor-icons/react";
import { getShareQrValue } from "./share-qr";
import { ShareQrButton } from "./share-qr-button";
import type {
  CompatibilityStatus,
  DistributionChannel,
  DistributionChannelId,
  DistributionStatus,
} from "./types";

const channelIcons: Record<DistributionChannelId, { icon: Icon; className: string }> = {
  oyiioyii: { icon: DeviceMobile, className: "bg-indigo-600 text-white" },
  "web-chat": { icon: ChatCircleDots, className: "bg-emerald-500 text-white" },
  "brand-private": { icon: Storefront, className: "bg-blue-600 text-white" },
  "api-runtime": { icon: Code, className: "bg-orange-500 text-white" },
};

const compatibilityStyles: Record<CompatibilityStatus, string> = {
  compatible: "text-success",
  upgrade: "text-warning",
  configure: "text-text-muted",
};

const statusStyles: Record<DistributionStatus, string> = {
  running: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  unpublished: "bg-slate-50 text-slate-600 ring-slate-200",
  paused: "bg-rose-50 text-rose-700 ring-rose-200",
};

const desktopGridColumns =
  "xl:grid-cols-[minmax(160px,1.25fr)_90px_minmax(145px,1fr)_90px_minmax(120px,0.8fr)_100px]";

type DistributionChannelTableNextProps = {
  channels: DistributionChannel[];
  busyChannel: DistributionChannelId | null;
  onAction: (channel: DistributionChannel) => void;
};

export function DistributionChannelTableNext({
  channels,
  busyChannel,
  onAction,
}: DistributionChannelTableNextProps) {
  return (
    <section aria-labelledby="distribution-overview-title" className="min-w-0">
      <h2 id="distribution-overview-title" className="text-lg font-semibold">
        多端发布概览
      </h2>

      <div className="mt-3 overflow-hidden border-y border-border bg-surface">
        <div
          className={
            "hidden gap-x-4 border-b border-border px-4 py-3 text-xs font-medium text-text-muted xl:grid " +
            desktopGridColumns
          }
        >
          <span>应用端</span>
          <span>适配版本</span>
          <span>兼容状态</span>
          <span>发布状态</span>
          <span>最近发布</span>
          <span className="text-center">操作</span>
        </div>

        <div className="divide-y divide-border">
          {channels.map((channel) => {
            const iconMeta = channelIcons[channel.id];
            const ChannelIcon = iconMeta.icon;
            const qrValue = getShareQrValue(channel);
            const isBusy = busyChannel === channel.id;
            const actionLabel =
              channel.actionLabel ?? (channel.status === "running" ? "查看状态" : "查看说明");

            return (
              <article
                key={channel.id}
                className={
                  "grid grid-cols-2 gap-x-4 gap-y-4 px-4 py-4 transition hover:bg-subtle/45 xl:items-center " +
                  desktopGridColumns
                }
              >
                <div className="col-span-2 flex min-w-0 items-center gap-3 xl:col-span-1">
                  <span
                    className={
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg " +
                      iconMeta.className
                    }
                  >
                    <ChannelIcon size={21} weight="bold" />
                  </span>
                  <div className="min-w-0">
                    <strong className="block truncate text-sm">{channel.name}</strong>
                    {channel.shareUrl && (
                      <p className="mt-1 truncate text-xs text-text-muted">公开分享链接已生成</p>
                    )}
                    {qrValue && <ShareQrButton url={qrValue} label={channel.name} />}
                  </div>
                </div>

                <div>
                  <span className="mb-1 block text-xs text-text-muted xl:hidden">适配版本</span>
                  <strong className="block text-sm font-medium">{channel.version}</strong>
                  <span className="text-xs text-text-muted">{channel.versionHint}</span>
                </div>

                <div>
                  <span className="mb-1 block text-xs text-text-muted xl:hidden">兼容状态</span>
                  <p
                    className={
                      "flex items-center gap-2 text-sm font-medium " +
                      compatibilityStyles[channel.compatibility]
                    }
                  >
                    <span className="h-2 w-2 rounded-full bg-current" />
                    {channel.compatibilityLabel}
                  </p>
                  <p className="mt-1 text-xs text-text-muted">{channel.compatibilityHint}</p>
                </div>

                <div>
                  <span className="mb-1 block text-xs text-text-muted xl:hidden">发布状态</span>
                  <span
                    className={
                      "inline-flex rounded px-2 py-1 text-xs font-medium ring-1 ring-inset " +
                      statusStyles[channel.status]
                    }
                  >
                    {channel.statusLabel}
                  </span>
                </div>

                <div className="min-w-0">
                  <span className="mb-1 block text-xs text-text-muted xl:hidden">最近发布</span>
                  {channel.publishedAt ? (
                    <>
                      <p className="text-xs text-text-muted">{channel.publishedAt}</p>
                      <p className="mt-1 text-xs text-text-muted">{channel.publishedBy}</p>
                    </>
                  ) : (
                    <span className="text-sm text-text-muted">—</span>
                  )}
                </div>

                <div className="col-span-2 flex items-center justify-end xl:col-span-1 xl:justify-center">
                  <button
                    type="button"
                    onClick={() => onAction(channel)}
                    disabled={isBusy}
                    className="inline-flex min-h-8 w-24 items-center justify-center rounded border border-primary/55 px-2 text-xs font-medium text-primary transition hover:bg-primary-soft disabled:opacity-50"
                  >
                    {isBusy ? "处理中…" : actionLabel}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <p className="mt-3 text-sm text-text-muted">共 {channels.length} 个应用端</p>
    </section>
  );
}
