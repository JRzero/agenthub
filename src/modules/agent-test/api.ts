import type { Agent } from "@/modules/agents/types";
import type { RuntimeAttachment, RuntimeMessageOptions } from "@/modules/agent-runtime/types";
import { apiRequest } from "@/shared/api/http-client";
import type { SimulationResponse, TestMessage, TestScenario } from "./types";

export interface SimulationPayload {
  content: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  system_prompt?: string;
  examples?: Array<{ role: "user" | "assistant"; content: string }>;
  skills?: string[];
  attachments?: RuntimeAttachment[];
  metadata?: RuntimeMessageOptions["metadata"];
}

export function buildSimulationPayload(agent: Agent, content: string, messages: TestMessage[], attachments: RuntimeAttachment[] = [], metadata?: RuntimeMessageOptions["metadata"]): SimulationPayload {
  const examples = Array.isArray(agent.config?.examples) ? agent.config.examples : [];
  const skills = Array.isArray(agent.config?.skills) ? agent.config.skills : [];
  return {
    content: content.trim(),
    messages: messages.map((item) => ({ role: item.role, content: item.content })),
    ...(agent.system_prompt || agent.config?.system_prompt ? { system_prompt: agent.system_prompt || agent.config?.system_prompt } : {}),
    ...(examples.length ? { examples } : {}),
    ...(skills.length ? { skills } : {}),
    ...(attachments.length ? { attachments } : {}),
    ...(metadata?.custom_fields && Object.keys(metadata.custom_fields).length ? { metadata } : {}),
  };
}

export function simulateAgent(apiKey: string, workspaceCode: string, agentId: number, payload: SimulationPayload): Promise<SimulationResponse> {
  return apiRequest<SimulationResponse>(`/agents/${agentId}/simulate`, { method: "POST", apiKey, workspaceCode, body: JSON.stringify(payload) });
}

const demoReplies: Record<string, string> = {
  "new-user": "你好，我是林月。很高兴认识你。我可以陪你梳理情绪、一起想办法，也会在需要专业帮助时提醒你寻找现实支持。",
  "long-term": "我可以记住你愿意分享的偏好，在每次交流里保持连贯；但我不会替代现实中的朋友和关系。",
  emotion: "听起来今天真的很难熬。我们可以先把最压着你的那件事说出来；如果你有伤害自己的想法，请马上联系可信任的人或专业支持。",
  boundary: "我能用温暖、尊重的方式陪你聊天，但不会扮演现实恋人，也不会提供越过安全边界的亲密互动。我们可以聊聊你现在最需要的陪伴是什么。",
  knowledge: "我会优先依据已经绑定的知识内容回答，并在没有可靠依据时明确说明不确定，而不是编造结论。",
};

export function getDemoSimulationResponse(scenario: TestScenario, input: string): SimulationResponse {
  const content = demoReplies[scenario.id] || `我理解你在测试“${scenario.name}”。这是演示模式下的确定性回答：${input.trim()}`;
  return { message_id: `demo-${scenario.id}-${input.trim().length}-${Date.now()}`, content, role: "assistant", model: "demo-fixture", usage: { input_tokens: 24, output_tokens: 62, total_tokens: 86 } };
}
