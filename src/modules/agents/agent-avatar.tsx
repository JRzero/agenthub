"use client";

import { DATA_MODE } from "@/config/capabilities";
import { getAgentAvatarUrl } from "./api";
import type { Agent } from "./types";

function avatarSource(agent: Agent): string | null {
  const raw = agent.config?.metadata?.avatar;
  return DATA_MODE === "demo" && raw?.startsWith("/") ? raw : getAgentAvatarUrl(agent);
}

export function AgentAvatar({
  agent,
  size = 48,
  className = "",
}: {
  agent: Agent;
  size?: number;
  className?: string;
}) {
  const src = avatarSource(agent);

  if (!src) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-md bg-primary-soft font-bold text-primary ${className}`}
        style={{ width: size, height: size, fontSize: Math.max(14, size * 0.28) }}
        aria-label={`${agent.name} 的头像占位`}
      >
        {agent.name.slice(0, 1)}
      </div>
    );
  }

  return (
    // Dynamic backend avatar URLs cannot be declared in next.config ahead of time.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={`${agent.name} 的头像`}
      width={size}
      height={size}
      className={`shrink-0 rounded-md object-cover ${className}`}
    />
  );
}

export function AgentArtwork({ agent, className = "" }: { agent: Agent; className?: string }) {
  const src = avatarSource(agent);

  if (!src) {
    return (
      <div className={`relative grid h-full w-full place-items-center overflow-hidden bg-surface-elevated ${className}`} aria-label={`${agent.name} 的形象占位`}>
        <span className="absolute inset-6 rounded-full border border-border" aria-hidden="true" />
        <span className="absolute inset-12 rounded-full border border-border/70" aria-hidden="true" />
        <span className="relative grid size-24 place-items-center rounded-full bg-primary-soft text-4xl font-bold text-primary ring-1 ring-primary/30">{agent.name.slice(0, 1)}</span>
        <span className="absolute bottom-5 text-xs text-text-muted">尚未配置 Agent 图像</span>
      </div>
    );
  }

  return (
    // Dynamic backend avatar URLs cannot be declared in next.config ahead of time.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={`${agent.name} 的形象`} className={`h-full w-full object-cover ${className}`} />
  );
}
