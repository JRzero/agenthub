import type { TestMessage } from "@/modules/agent-test/types";
import type { SimulationResponse } from "@/modules/agent-test/types";
import type { AgentBuildDraft } from "./types";

export function buildDraftSimulationPayload(
  draft: AgentBuildDraft,
  content: string,
  messages: TestMessage[],
) {
  return {
    content,
    messages: messages.map(({ role, content: messageContent }) => ({
      role,
      content: messageContent,
    })),
    ...(draft.systemPrompt ? { system_prompt: draft.systemPrompt } : {}),
    ...(draft.examples.length ? { examples: draft.examples } : {}),
    ...(draft.skills.length ? { skills: draft.skills } : {}),
  };
}

export function latestPreviewExchange(messages: TestMessage[]) {
  const latestAssistantIndex = messages.findLastIndex(
    (message) => message.role === "assistant",
  );
  if (latestAssistantIndex < 0) return messages.slice(-1);

  const latestUserIndex = messages
    .slice(0, latestAssistantIndex)
    .findLastIndex((message) => message.role === "user");
  if (latestUserIndex < 0) return messages.slice(latestAssistantIndex);

  return messages.slice(latestUserIndex, latestAssistantIndex + 1);
}

export function createPreviewAssistantMessage(
  response: SimulationResponse,
  fallbackId: string,
): TestMessage {
  return {
    id: response.message_id || fallbackId,
    role: "assistant",
    content: response.content,
    model: response.model,
    usage: response.usage,
    attachments: response.attachments,
    audio_url: response.audio_url,
    docx_url: response.docx_url,
    image_url: response.image_url,
  };
}
