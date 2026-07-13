import { apiRequest } from "@/shared/api/http-client";
import type { Agent } from "@/modules/agents/types";

export interface CreateAgentInput {
  name: string;
  code: string;
  description: string;
  model: string;
}

export function createAgent(
  apiKey: string,
  workspaceCode: string,
  input: CreateAgentInput,
): Promise<Agent> {
  return apiRequest<Agent>("/agents", {
    method: "POST",
    apiKey,
    workspaceCode,
    body: JSON.stringify({
      name: input.name.trim(),
      code: input.code.trim(),
      description: input.description.trim(),
      model: input.model.trim() || "claude-3-5-sonnet-20241022",
      system_prompt: "你是一个有帮助的助手。",
      temperature: 0.7,
      agent_type: "cloud",
    }),
  });
}
