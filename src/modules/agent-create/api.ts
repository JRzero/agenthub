import { generateAvatarPreview, generateCharacterSheet, generateCharacterSpec, optimizeNarrative, saveCharacterDesign } from "@/modules/agent-build/co-creation-api";
import { resolveGeneratedMediaUrl } from "@/modules/agent-build/media-assets";
import { setStageSkills, uploadAgentAvatar, type SkillStage } from "@/modules/agent-build/advanced-api";
import type { Agent, ExampleMessage } from "@/modules/agents/types";
import type { CreatorSkill } from "@/modules/resources/types";
import { apiRequest } from "@/shared/api/http-client";
import { createRequestKey } from "@/shared/utils/request-key";
import type { BasicRoleContent, BasicRoleInput, ImageCandidate } from "./types";

export interface GuidedCreationProgress {
  agent_id: number;
  current_step: "avatar" | "character_sheet" | "skills" | "complete";
  creation_completed: boolean;
  draft_revision: number;
  steps: {
    basic_profile: boolean;
    avatar: boolean;
    character_sheet: boolean;
    skills: boolean;
  };
}

export function generateBasicProfile(
  apiKey: string,
  workspaceCode: string,
  input: BasicRoleInput,
): Promise<Agent> {
  return apiRequest<Agent>("/agents/generate-basic-profile", {
    method: "POST",
    apiKey,
    workspaceCode,
    body: JSON.stringify({
      name: input.name.trim(),
      role_identity: input.identity.trim(),
      user_relationship: input.relationship.trim(),
      primary_interactions: input.primaryInteraction.trim(),
      personality_tags: input.personalityTags,
    }),
  });
}

function pairExamples(messages: ExampleMessage[]): BasicRoleContent["examples"] {
  const pairs: BasicRoleContent["examples"] = [];
  for (let index = 0; index < messages.length - 1 && pairs.length < 3; index += 1) {
    const current = messages[index];
    const next = messages[index + 1];
    if (current.role === "user" && next.role === "assistant") {
      pairs.push({ user: current.content, assistant: next.content });
      index += 1;
    }
  }
  return pairs;
}

export function mapAgentToBasicRoleContent(agent: Agent): BasicRoleContent {
  const examples = agent.config?.examples || [];
  const opening = agent.config?.opening_message || `你好，我是${agent.name}。`;
  return {
    description: agent.description || "",
    systemPrompt: agent.system_prompt || agent.config?.system_prompt || "",
    opening,
    examples: pairExamples(examples),
  };
}

function toExampleMessages(content: BasicRoleContent): ExampleMessage[] {
  return content.examples.flatMap((example) => [
      { role: "user" as const, content: example.user.trim() },
      { role: "assistant" as const, content: example.assistant.trim() },
    ]).filter((message) => message.content);
}

export function saveBasicRoleContent(
  apiKey: string,
  workspaceCode: string,
  agentId: number,
  expectedDraftRevision: number,
  name: string,
  content: BasicRoleContent,
): Promise<Agent> {
  return apiRequest<Agent>(`/agents/${agentId}`, {
    method: "PUT",
    apiKey,
    workspaceCode,
    body: JSON.stringify({
      expected_draft_revision: expectedDraftRevision,
      name: name.trim(),
      description: content.description.trim(),
      system_prompt: content.systemPrompt.trim(),
      opening_message: content.opening.trim(),
      examples: toExampleMessages(content),
    }),
  });
}

export async function regenerateBasicRoleContent(
  apiKey: string,
  agentId: number,
  input: BasicRoleInput,
  current: BasicRoleContent,
): Promise<BasicRoleContent> {
  const instruction = [
    `保持 Agent 名称为「${input.name.trim()}」。`,
    `角色身份：${input.identity.trim()}。`,
    `与用户的关系：${input.relationship.trim()}。`,
    input.primaryInteraction.trim() ? `重点互动：${input.primaryInteraction.trim()}。` : "",
    input.personalityTags.length ? `表达风格：${input.personalityTags.join("、")}。` : "",
    "重新组织角色系统提示词，使角色定位、行为边界和表达方式更完整。",
  ].filter(Boolean).join("\n");
  const result = await optimizeNarrative(apiKey, agentId, current.systemPrompt, instruction);
  return { ...current, systemPrompt: result.optimized_prompt };
}

function avatarPrompt(input: BasicRoleInput, content: BasicRoleContent): string {
  return [
    `${input.name}，${input.identity}`,
    input.personalityTags.length ? `性格与表达：${input.personalityTags.join("、")}` : "",
    `角色简介：${content.description}`,
    "生成适合作为 Agent 头像的正方形单人头像，主体清晰，不要文字和水印。",
  ].filter(Boolean).join("\n");
}

export async function generateAvatarCandidate(
  apiKey: string,
  agentId: number,
  input: BasicRoleInput,
  content: BasicRoleContent,
): Promise<ImageCandidate> {
  const prompt = avatarPrompt(input, content);
  const response = await generateAvatarPreview(apiKey, agentId, prompt);
  return {
      id: `generated-avatar-${createRequestKey()}`,
      url: resolveGeneratedMediaUrl(response.image_url, "avatar"),
      sourceUrl: response.image_url,
      alt: `${input.name} 的头像候选`,
  };
}

export function getAgentCreationProgress(apiKey: string, workspaceCode: string, agentId: number): Promise<GuidedCreationProgress> {
  return apiRequest<GuidedCreationProgress>(`/agents/${agentId}/creation-progress`, { apiKey, workspaceCode });
}

export function completeAgentCreation(
  apiKey: string,
  workspaceCode: string,
  agentId: number,
  expectedDraftRevision: number,
): Promise<Agent> {
  return apiRequest<Agent>(`/agents/${agentId}/complete-creation`, {
    method: "POST",
    apiKey,
    workspaceCode,
    body: JSON.stringify({ expected_draft_revision: expectedDraftRevision }),
  });
}

export async function confirmAvatarCandidate(
  apiKey: string,
  agentId: number,
  expectedDraftRevision: number,
  candidate: ImageCandidate,
): Promise<Agent> {
  const response = await fetch(candidate.url);
  if (!response.ok) throw new Error("无法读取头像候选，请重新生成或上传");
  return uploadAgentAvatar(
    apiKey,
    agentId,
    await response.blob(),
    expectedDraftRevision,
  );
}

export async function generateCharacterSheetCandidate(
  apiKey: string,
  agentId: number,
  input: BasicRoleInput,
  content: BasicRoleContent,
): Promise<ImageCandidate> {
  const spec = await generateCharacterSpec(apiKey, agentId, content.systemPrompt);
  const sheet = await generateCharacterSheet(apiKey, agentId, spec.spec_text);
  return {
    id: `generated-sheet-${createRequestKey()}`,
    url: resolveGeneratedMediaUrl(sheet.image_url, "character-sheet"),
    sourceUrl: sheet.image_url,
    alt: `${input.name} 的角色设定稿候选`,
    specText: spec.spec_text,
  };
}

export function confirmCharacterSheetCandidate(
  apiKey: string,
  agentId: number,
  expectedDraftRevision: number,
  candidate: ImageCandidate,
): Promise<Agent> {
  if (!candidate.specText || !candidate.sourceUrl) throw new Error("角色设定稿候选信息不完整，请重新生成");
  return saveCharacterDesign(
    apiKey,
    agentId,
    candidate.specText,
    candidate.sourceUrl,
    expectedDraftRevision,
  );
}

function creatorSkillStage(skill: CreatorSkill): SkillStage {
  if (skill.stage === "pre_conversation") return "pre";
  if (skill.stage === "post_conversation") return "post";
  return "mid";
}

export async function saveGuidedCreationSkills(
  apiKey: string,
  agentId: number,
  expectedDraftRevision: number,
  selectedSkills: CreatorSkill[],
): Promise<number> {
  const grouped: Record<SkillStage, CreatorSkill[]> = { pre: [], mid: [], post: [] };
  selectedSkills.forEach((skill) => grouped[creatorSkillStage(skill)].push(skill));
  let draftRevision = expectedDraftRevision;
  for (const stage of Object.keys(grouped) as SkillStage[]) {
    const result = await setStageSkills(
      apiKey,
      agentId,
      stage,
      draftRevision,
      grouped[stage].map((skill) => ({
        creator_skill_id: skill.id,
        config: {},
      })),
    );
    draftRevision = result.draft_revision;
  }
  return draftRevision;
}
