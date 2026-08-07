import type { Agent } from "@/modules/agents/types";
import { resolveAgentLifecycle, type AgentLifecycleState } from "@/modules/agents/lifecycle";

export interface WorkbenchTask {
  id: string;
  agentId: number;
  agentName: string;
  title: string;
  action: string;
  href: string;
  tone: "warning" | "info";
}

export interface WorkbenchStageSelection {
  focus?: Agent;
  previous?: Agent;
  next?: Agent;
  index: number;
}

export function orderWorkbenchAgents(agents: Agent[]): Agent[] {
  return [...agents].sort((left, right) => {
    const leftHasArtwork = Boolean(left.config?.metadata?.avatar);
    const rightHasArtwork = Boolean(right.config?.metadata?.avatar);
    if (leftHasArtwork !== rightHasArtwork) return rightHasArtwork ? 1 : -1;
    return (Date.parse(right.updated_at || "") || 0) - (Date.parse(left.updated_at || "") || 0);
  });
}

export function selectWorkbenchStage(agents: Agent[], selectedId: number | null): WorkbenchStageSelection {
  if (!agents.length) return { index: 0 };
  const index = Math.max(0, agents.findIndex((agent) => agent.id === selectedId));
  if (agents.length === 1) return { focus: agents[index], index };
  if (agents.length === 2) return { focus: agents[index], previous: agents[(index + 1) % 2], index };
  return {
    focus: agents[index],
    previous: agents[(index - 1 + agents.length) % agents.length],
    next: agents[(index + 1) % agents.length],
    index,
  };
}

export function countAgentLifecycles(agents: Agent[]): Record<AgentLifecycleState, number> {
  const counts: Record<AgentLifecycleState, number> = { creating: 0, draft: 0, published: 0, unpublished: 0, archived: 0 };
  agents.forEach((agent) => { counts[resolveAgentLifecycle(agent).state] += 1; });
  return counts;
}

export function suggestAgentCode(name: string): string {
  const source = name.trim().toLowerCase();
  const ascii = source.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48);
  if (ascii) return ascii;
  const hash = Array.from(source).reduce(
    (value, character) => ((value * 31) + character.charCodeAt(0)) >>> 0,
    7,
  );
  return source ? `agent-${hash.toString(36)}` : "";
}

export function deriveWorkbenchTasks(agents: Agent[]): WorkbenchTask[] {
  return agents.flatMap((agent) => {
    const tasks: WorkbenchTask[] = [];
    if (!agent.description || !agent.system_prompt) {
      tasks.push({ id: `${agent.id}-identity`, agentId: agent.id, agentName: agent.name, title: "身份与人设尚未完成", action: "继续构建", href: `/assets/${agent.id}/build`, tone: "warning" });
    }
    if (!agent.knowledge_base_id) {
      tasks.push({ id: `${agent.id}-knowledge`, agentId: agent.id, agentName: agent.name, title: "尚未绑定知识库", action: "去构建", href: `/assets/${agent.id}/build`, tone: "info" });
    }
    if (agent.status !== "active") {
      tasks.push({ id: `${agent.id}-test`, agentId: agent.id, agentName: agent.name, title: "草稿等待测试与发布", action: "进入测试", href: `/assets/${agent.id}/test`, tone: "info" });
    }
    return tasks;
  }).slice(0, 3);
}

export function readiness(agent: Agent): number {
  const parts = [
    Boolean(agent.name),
    Boolean(agent.description),
    Boolean(agent.system_prompt || agent.config?.system_prompt),
    Boolean(agent.knowledge_base_id),
    Boolean(agent.config?.skills?.length),
    Boolean(agent.llm_model_name || agent.model),
  ];
  return Math.round((parts.filter(Boolean).length / parts.length) * 100);
}
