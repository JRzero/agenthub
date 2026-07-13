import type { Agent } from "@/modules/agents/types";

export interface WorkbenchTask {
  id: string;
  agentId: number;
  agentName: string;
  title: string;
  action: string;
  href: string;
  tone: "warning" | "info";
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
