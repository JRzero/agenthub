"use client";

import { DATA_MODE } from "@/config/capabilities";
import { getAgentAvatarUrl } from "./api";
import type { Agent } from "./types";

export function AgentAvatar({
  agent,
  size = 48,
  className = "",
}: {
  agent: Agent;
  size?: number;
  className?: string;
}) {
  const raw = agent.config?.metadata?.avatar;
  const src = DATA_MODE === "demo" && raw?.startsWith("/") ? raw : getAgentAvatarUrl(agent);

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
