import { apiRequest } from "@/shared/api/http-client";
import { worldDecoders, projectEventCardDefinition, projectWorldContent, projectWorldPermissions } from "./decoders";
import { guardWorldMutation, worldMutationKeys } from "./state";
import type { WorldContent, WorldEventCardDefinition, WorldPermissions, WorldVisibility } from "./types";

export interface WorldApiContext { apiKey: string; workspaceCode: string }
const q = (value: string) => encodeURIComponent(value);
const request = (ctx: WorldApiContext, path: string, init?: Omit<RequestInit, "headers">) => apiRequest<unknown>(path, { ...init, apiKey: ctx.apiKey, workspaceCode: ctx.workspaceCode });
const json = (value: unknown) => JSON.stringify(value);
const decoded = <T>(promise: Promise<unknown>, decoder: (value: unknown) => T) => promise.then(decoder);

export const isWorldOwnerRole = (role: string | undefined) => role === "owner" || role === "world_owner";

export const worldApi = {
  list: (ctx: WorldApiContext, status = "", cursor = "") => decoded(request(ctx, `/worlds?status=${q(status)}&cursor=${q(cursor)}`), worldDecoders.list),
  detail: (ctx: WorldApiContext, code: string) => decoded(request(ctx, `/worlds/${q(code)}`), worldDecoders.detail),
  create: (ctx: WorldApiContext, input: { world_code?: string; workspace_code: string; content: WorldContent; template_code?: string; template_version?: number; idempotency_key: string }) => decoded(request(ctx, "/worlds", { method: "POST", body: json({ world_code: input.world_code, workspace_code: input.workspace_code, content: projectWorldContent(input.content), template_code: input.template_code, template_version: input.template_version, idempotency_key: input.idempotency_key }) }), worldDecoders.world),
  update: (ctx: WorldApiContext, code: string, expected_revision: number, content: WorldContent) => decoded(request(ctx, `/worlds/${q(code)}/draft`, { method: "PUT", body: json({ expected_revision, content: projectWorldContent(content) }) }), worldDecoders.world),
  publish: (ctx: WorldApiContext, code: string, expected_revision: number) => guardWorldMutation(worldMutationKeys.publish(ctx.workspaceCode, code), () => decoded(request(ctx, `/worlds/${q(code)}/publish`, { method: "POST", body: json({ expected_revision }) }), worldDecoders.world)),
  preflight: (ctx: WorldApiContext, code: string) => decoded(request(ctx, `/worlds/${q(code)}/preflight`), worldDecoders.preflight),
  start: (ctx: WorldApiContext, code: string, expected_revision: number, seed: number) => decoded(request(ctx, `/worlds/${q(code)}/start`, { method: "POST", body: json({ expected_revision, seed }) }), worldDecoders.instance),
  templates: (ctx: WorldApiContext, cursor = "") => decoded(request(ctx, `/world-templates?cursor=${q(cursor)}`), worldDecoders.templates),
  template: (ctx: WorldApiContext, code: string, version: number) => decoded(request(ctx, `/world-templates/${q(code)}?version_no=${version}`), worldDecoders.template),
  searchAgents: (ctx: WorldApiContext, query: string, cursor = "") => decoded(request(ctx, `/world-agents/search?q=${q(query)}&cursor=${q(cursor)}`), worldDecoders.agents),
  invitations: (ctx: WorldApiContext, code: string, cursor = "") => decoded(request(ctx, `/worlds/${q(code)}/invitations?cursor=${q(cursor)}`), worldDecoders.invitations),
  invite: (ctx: WorldApiContext, code: string, input: { agent_code: string; version_no: number; public_identity: string; permissions: WorldPermissions }) => guardWorldMutation(worldMutationKeys.invite(ctx.workspaceCode, code), () => decoded(request(ctx, `/worlds/${q(code)}/invitations`, { method: "POST", body: json({ agent_code: input.agent_code, version_no: input.version_no, public_identity: input.public_identity, permissions: projectWorldPermissions(input.permissions) }) }), worldDecoders.invitation)),
  withdraw: (ctx: WorldApiContext, code: string, invitationCode: string) => decoded(request(ctx, `/worlds/${q(code)}/invitations/${q(invitationCode)}/withdraw`, { method: "POST", body: "{}" }), worldDecoders.invitation),
  participants: (ctx: WorldApiContext, code: string, cursor = "") => decoded(request(ctx, `/worlds/${q(code)}/participants?cursor=${q(cursor)}`), worldDecoders.participants),
  pendingInvitations: (ctx: WorldApiContext, cursor = "") => decoded(request(ctx, `/world-invitations?cursor=${q(cursor)}`), worldDecoders.invitations),
  invitation: (ctx: WorldApiContext, code: string) => decoded(request(ctx, `/world-invitations/${q(code)}`), worldDecoders.invitationDetail),
  saveDecisionDraft: (ctx: WorldApiContext, code: string, expected_revision: number, public_identity: string, permissions: WorldPermissions) => decoded(request(ctx, `/world-invitations/${q(code)}/decision-draft`, { method: "PUT", body: json({ expected_revision, public_identity, permissions: projectWorldPermissions(permissions) }) }), worldDecoders.invitation),
  decide: (ctx: WorldApiContext, code: string, decision: "accepted" | "rejected", expected_revision: number, idempotency_key: string) => decoded(request(ctx, `/world-invitations/${q(code)}/decision`, { method: "POST", body: json({ decision, expected_revision, idempotency_key }) }), worldDecoders.decision),
  recall: (ctx: WorldApiContext, participantCode: string) => guardWorldMutation(worldMutationKeys.recall(ctx.workspaceCode, participantCode), () => decoded(request(ctx, `/world-participants/${q(participantCode)}/recall`, { method: "POST", body: "{}" }), worldDecoders.participant)),
  schedule: (ctx: WorldApiContext, code: string) => decoded(request(ctx, `/worlds/${q(code)}/schedule`), worldDecoders.schedule),
  saveSchedule: (ctx: WorldApiContext, code: string, input: { expected_revision: number; scheduled_start_at: string; seed: number; timezone: "Asia/Shanghai"; daily_window: { start: string; end: string }; review_time: string; idempotency_key: string }) => decoded(request(ctx, `/worlds/${q(code)}/schedule`, { method: "POST", body: json({ expected_revision: input.expected_revision, scheduled_start_at: input.scheduled_start_at, seed: input.seed, timezone: input.timezone, daily_window: { start: input.daily_window.start, end: input.daily_window.end }, review_time: input.review_time, idempotency_key: input.idempotency_key }) }), worldDecoders.schedule),
  cancelSchedule: (ctx: WorldApiContext, code: string, expected_revision: number) => decoded(request(ctx, `/worlds/${q(code)}/schedule`, { method: "DELETE", body: json({ expected_revision }) }), worldDecoders.schedule),
  launch: (ctx: WorldApiContext, code: string, input: { source: "manual" | "schedule"; schedule_code?: string; seed?: number; expected_revision: number; idempotency_key: string }) => decoded(request(ctx, `/worlds/${q(code)}/launch-requests`, { method: "POST", body: json({ source: input.source, schedule_code: input.schedule_code, seed: input.seed, expected_revision: input.expected_revision, idempotency_key: input.idempotency_key }) }), worldDecoders.launch),
  eventCards: (ctx: WorldApiContext, code: string) => decoded(request(ctx, `/worlds/${q(code)}/event-cards`), worldDecoders.eventCards),
  createEventCard: (ctx: WorldApiContext, code: string, expected_revision: number, card: WorldEventCardDefinition) => guardWorldMutation(worldMutationKeys.eventCardCreate(ctx.workspaceCode, code), () => decoded(request(ctx, `/worlds/${q(code)}/event-cards`, { method: "POST", body: json({ expected_revision, card: projectEventCardDefinition(card) }) }), worldDecoders.eventCard)),
  updateEventCard: (ctx: WorldApiContext, code: string, eventCode: string, expected_revision: number, card: WorldEventCardDefinition) => decoded(request(ctx, `/worlds/${q(code)}/event-cards/${q(eventCode)}`, { method: "PUT", body: json({ expected_revision, card: projectEventCardDefinition(card) }) }), worldDecoders.eventCard),
  deleteEventCard: (ctx: WorldApiContext, code: string, eventCode: string, expected_revision: number) => request(ctx, `/worlds/${q(code)}/event-cards/${q(eventCode)}`, { method: "DELETE", body: json({ expected_revision }) }).then(() => undefined),
  bootstrap: (ctx: WorldApiContext, code: string, requestCode: string) => decoded(request(ctx, `/worlds/${q(code)}/launch-requests/${q(requestCode)}/bootstrap`, { method: "POST", body: "{}" }), worldDecoders.instance),
  runtimeContract: (ctx: WorldApiContext, code: string) => decoded(request(ctx, `/worlds/${q(code)}/runtime-contract`), worldDecoders.runtimeContract),
  projection: (ctx: WorldApiContext, code: string, confirmedRole: string, cursor = "") => decoded(request(ctx, `/worlds/${q(code)}/projection?cursor=${q(cursor)}`), (value) => worldDecoders.projection(value, confirmedRole)),
  barrier: (ctx: WorldApiContext, code: string, action: "pause" | "resume" | "takedown" | "archive", fence: { run_epoch: number; fencing_token: number; expected_revision: number }) => guardWorldMutation(worldMutationKeys.barrier(ctx.workspaceCode, code), () => decoded(request(ctx, `/worlds/${q(code)}/runtime/barrier`, { method: "POST", body: json({ action, run_epoch: fence.run_epoch, fencing_token: fence.fencing_token, expected_revision: fence.expected_revision }) }), worldDecoders.fence)),
  publicRecaps: (ctx: WorldApiContext, code: string, businessDate = "") => decoded(request(ctx, `/public/worlds/${q(code)}/recaps${businessDate ? `?business_date=${q(businessDate)}` : ""}`), worldDecoders.recaps),
  setVisibility: (ctx: WorldApiContext, code: string, visibility: WorldVisibility, expected_revision: number, idempotency_key: string) => decoded(request(ctx, `/worlds/${q(code)}/public-visibility`, { method: "PUT", body: json({ visibility, expected_revision, idempotency_key }) }), worldDecoders.visibility),
  reviewSubmissions: (ctx: WorldApiContext, code: string) => decoded(request(ctx, `/worlds/${q(code)}/review-submissions`), worldDecoders.reviews),
  submitReview: (ctx: WorldApiContext, code: string, material_summary: string, expected_revision: number, idempotency_key: string) => decoded(request(ctx, `/worlds/${q(code)}/review-submissions`, { method: "POST", body: json({ material_summary, expected_revision, idempotency_key }) }), worldDecoders.review),
  ownerReports: (ctx: WorldApiContext, code: string) => decoded(request(ctx, `/worlds/${q(code)}/reports`), worldDecoders.reports),
  agentOwnerBinding: (ctx: WorldApiContext, participantCode: string) => decoded(request(ctx, `/world-agent-owner/participants/${q(participantCode)}`), worldDecoders.binding),
  narrowAgentOwnerPermissions: (ctx: WorldApiContext, participantCode: string, permissions: WorldPermissions, expected_revision: number, idempotency_key: string) => decoded(request(ctx, `/world-agent-owner/participants/${q(participantCode)}/permissions`, { method: "PUT", body: json({ permissions: projectWorldPermissions(permissions), expected_revision, idempotency_key }) }), worldDecoders.binding),
  recallAgentOwner: (ctx: WorldApiContext, participantCode: string, expected_revision: number, idempotency_key: string) => decoded(request(ctx, `/world-agent-owner/participants/${q(participantCode)}/recall`, { method: "POST", body: json({ expected_revision, idempotency_key }) }), worldDecoders.binding),
  agentOwnerLimitedChange: (ctx: WorldApiContext, changeCode: string) => decoded(request(ctx, `/world-agent-owner/limited-changes/${q(changeCode)}`), worldDecoders.limitedChange),
  decideLimitedChange: (ctx: WorldApiContext, code: string, changeCode: string, input: { decision: "approve" | "reject" | "choice"; candidate_code?: string; run_epoch: number; fencing_token: number; expected_revision: number; idempotency_key: string }) => decoded(request(ctx, `/worlds/${q(code)}/runtime/limited-changes/${q(changeCode)}/decisions`, { method: "POST", body: json({ decision: input.decision, candidate_code: input.candidate_code, run_epoch: input.run_epoch, fencing_token: input.fencing_token, expected_revision: input.expected_revision, idempotency_key: input.idempotency_key }) }), worldDecoders.limitedDecision),
};

export async function loadWorldOwnerResources(ctx: WorldApiContext, code: string, confirmedRole: string | undefined) {
  if (!isWorldOwnerRole(confirmedRole)) return { reviews: undefined, reports: undefined };
  const [reviews, reports] = await Promise.all([worldApi.reviewSubmissions(ctx, code), worldApi.ownerReports(ctx, code)]);
  return { reviews, reports };
}
