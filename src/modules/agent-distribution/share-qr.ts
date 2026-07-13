import type { DistributionChannel } from "./types";

export function getShareQrValue(channel: DistributionChannel): string | null {
  return channel.id === "web-chat" && channel.status === "running" && channel.shareUrl?.trim() ? channel.shareUrl.trim() : null;
}
