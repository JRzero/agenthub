import type { Agent } from "@/modules/agents/types";
import type {
  DistributionChannel,
  DistributionChannelId,
  PublicAgentCard,
  ShareLink,
} from "./types";

export const DEMO_SHARE_LINK: ShareLink = {
  uuid: "demo-share-link",
  share_token: "lin-yue-demo",
  agent_id: 32,
  agent_name: "林月",
  enabled: true,
  share_url: "https://linkyun.co/sharedAgent/lin-yue-demo",
  created_at: "2026-07-10T09:58:00+08:00",
};

export function resolveShareUrl(
  link: ShareLink | null,
  baseUrl = "https://linkyun.co",
): string | undefined {
  if (!link) return undefined;
  if (link.share_url?.trim()) return link.share_url.trim();
  return `${baseUrl.replace(/\/+$/, "")}/sharedAgent/${encodeURIComponent(link.share_token)}`;
}

export function buildDistributionChannels(
  agent: Agent,
  options: {
    demo: boolean;
    shareLink: ShareLink | null;
    paused?: boolean;
    overrides?: Partial<Record<DistributionChannelId, Partial<DistributionChannel>>>;
  },
): DistributionChannel[] {
  const currentVersion = `${agent.version || 1}.0`;
  const shareUrl = resolveShareUrl(options.shareLink);
  const webRunning = Boolean(options.shareLink?.enabled && !options.paused);
  const demoRunning = options.demo && !options.paused;
  const channels: DistributionChannel[] = [
    {
      id: "oyiioyii",
      name: "OyiiOyii App",
      version: currentVersion,
      versionHint: "当前版本",
      compatibility: "compatible",
      compatibilityLabel: "完全兼容",
      compatibilityHint: "所有能力可用",
      status: demoRunning ? "running" : "unpublished",
      statusLabel: demoRunning ? "运行中" : "未发布",
      publishedAt: demoRunning ? "2026-07-10 10:24" : undefined,
      publishedBy: demoRunning ? "李然" : undefined,
      actionLabel: options.demo && !demoRunning ? "发布" : undefined,
    },
    {
      id: "web-chat",
      name: "网页聊天",
      version: currentVersion,
      versionHint: "当前版本",
      compatibility: "compatible",
      compatibilityLabel: "完全兼容",
      compatibilityHint: "公开分享能力可用",
      status: webRunning ? "running" : options.paused ? "paused" : "unpublished",
      statusLabel: webRunning ? "运行中" : options.paused ? "已暂停" : "未发布",
      publishedAt: webRunning ? "2026-07-10 09:58" : undefined,
      publishedBy: webRunning ? "王磊" : undefined,
      actionLabel: webRunning ? "复制链接" : options.shareLink ? "启用链接" : "生成链接",
      shareUrl,
    },
    {
      id: "brand-private",
      name: "品牌私域",
      version: `${Math.max((agent.version || 1) - 0.1, 1).toFixed(1)}`,
      versionHint: "可适配",
      compatibility: "upgrade",
      compatibilityLabel: "需降级",
      compatibilityHint: "部分能力不可用",
      status: "unpublished",
      statusLabel: "未发布",
      actionLabel: "配置适配",
    },
    {
      id: "api-runtime",
      name: "API 接入",
      version: currentVersion,
      versionHint: "可适配",
      compatibility: "configure",
      compatibilityLabel: "待配置",
      compatibilityHint: "需配置接口与权限",
      status: "unpublished",
      statusLabel: "未发布",
      actionLabel: "去配置",
    },
  ];

  return channels.map((channel) => ({
    ...channel,
    ...options.overrides?.[channel.id],
  }));
}

export function buildPublicAgentCard(
  agent: Agent,
  shareLink: ShareLink | null,
  generatedAt = new Date().toISOString(),
): PublicAgentCard {
  return {
    schema_version: "agenthub.public-card.v1",
    agent: {
      id: agent.id,
      code: agent.code,
      name: agent.name,
      description: agent.description || "",
      version: `v${agent.version || 1}.0`,
      avatar: agent.config?.metadata?.avatar,
    },
    distribution: {
      share_url: resolveShareUrl(shareLink),
      generated_at: generatedAt,
    },
  };
}
