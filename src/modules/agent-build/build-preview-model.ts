import type { TestMessage } from "@/modules/agent-test/types";
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
