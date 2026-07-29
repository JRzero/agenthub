import type { Agent } from "./types";

export type AgentLifecycleState =
  | "creating"
  | "draft"
  | "published"
  | "unpublished"
  | "archived";

export interface AgentLifecyclePresentation {
  state: AgentLifecycleState;
  label: string;
  badgeClassName: string;
  listed: boolean;
}

export function resolveAgentLifecycle(
  agent: Pick<
    Agent,
    "creation_completed" | "status" | "current_version_id"
  >,
): AgentLifecyclePresentation {
  if (agent.creation_completed === false) {
    return {
      state: "creating",
      label: "创建中",
      badgeClassName: "status-info",
      listed: false,
    };
  }
  if (agent.status === "archived") {
    return {
      state: "archived",
      label: "已归档",
      badgeClassName: "status-neutral",
      listed: false,
    };
  }
  if (agent.status === "private" && agent.current_version_id) {
    return {
      state: "unpublished",
      label: "已下架",
      badgeClassName: "status-warning",
      listed: false,
    };
  }
  if (agent.status === "active" && agent.current_version_id) {
    return {
      state: "published",
      label: "已发布",
      badgeClassName: "status-success",
      listed: true,
    };
  }
  return {
    state: "draft",
    label: "草稿",
    badgeClassName: "status-warning",
    listed: false,
  };
}
