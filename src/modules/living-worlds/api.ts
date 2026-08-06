import { apiRequest } from "@/shared/api/http-client";
import { eventCardDefinition } from "./model";
import type { CursorPage, DecisionResult, InvitationDetail, InvitableAgent, LaunchRequest, ParticipantBinding, PlatformPendingPage, PreflightResult, WorldActorProjection, WorldAgentOwnerBinding, WorldContent, WorldDetail, WorldEventCard, WorldEventCardDefinition, WorldInstance, WorldInvitation, WorldLimitedChange, WorldLimitedChangeDecision, WorldListItem, WorldOwnerReport, WorldPermissions, WorldRecapPage, WorldReviewSubmission, WorldRuntimeContract, WorldRuntimeFence, WorldSchedule, WorldTemplate, WorldView, WorldVisibility, WorldVisibilityView } from "./types";

export interface WorldApiContext { apiKey: string; workspaceCode: string }
const q = (value: string) => encodeURIComponent(value);
const request = <T>(ctx: WorldApiContext, path: string, init?: Omit<RequestInit, "headers">) => apiRequest<T>(path, { ...init, apiKey: ctx.apiKey, workspaceCode: ctx.workspaceCode });
const json = (value: unknown) => JSON.stringify(value);
const withItems = <TPage extends { items: unknown[] }>(promise: Promise<TPage>) => promise.then((page) => ({ ...page, items: Array.isArray(page.items) ? page.items : [] }) as TPage);
const withUniquePreflight = (promise: Promise<WorldDetail>) => promise.then((detail) => ({ ...detail, preflight: { ...detail.preflight, missing: [...new Set(detail.preflight.missing)] } }));

export const worldApi = {
  list: (ctx: WorldApiContext, status = "", cursor = "") => request<CursorPage<WorldListItem>>(ctx, `/worlds?status=${q(status)}&cursor=${q(cursor)}`),
  detail: (ctx: WorldApiContext, code: string) => withUniquePreflight(request<WorldDetail>(ctx, `/worlds/${q(code)}`)),
  create: (ctx: WorldApiContext, input: { world_code?: string; workspace_code: string; content: WorldContent; template_code?: string; template_version?: number; idempotency_key: string }) => request<WorldView>(ctx, "/worlds", { method: "POST", body: json(input) }),
  update: (ctx: WorldApiContext, code: string, expected_revision: number, content: WorldContent) => request<WorldView>(ctx, `/worlds/${q(code)}/draft`, { method: "PUT", body: json({ expected_revision, content }) }),
  publish: (ctx: WorldApiContext, code: string, expected_revision: number) => request<WorldView>(ctx, `/worlds/${q(code)}/publish`, { method: "POST", body: json({ expected_revision }) }),
  preflight: (ctx: WorldApiContext, code: string) => request<PreflightResult>(ctx, `/worlds/${q(code)}/preflight`),
  start: (ctx: WorldApiContext, code: string, expected_revision: number, seed: number) => request<WorldInstance>(ctx, `/worlds/${q(code)}/start`, { method: "POST", body: json({ expected_revision, seed }) }),
  templates: (ctx: WorldApiContext, cursor = "") => request<CursorPage<WorldTemplate>>(ctx, `/world-templates?cursor=${q(cursor)}`),
  template: (ctx: WorldApiContext, code: string, version: number) => request<WorldTemplate>(ctx, `/world-templates/${q(code)}?version_no=${version}`),
  searchAgents: (ctx: WorldApiContext, query: string, cursor = "") => request<CursorPage<InvitableAgent>>(ctx, `/world-agents/search?q=${q(query)}&cursor=${q(cursor)}`),
  invitations: (ctx: WorldApiContext, code: string, cursor = "") => request<CursorPage<WorldInvitation>>(ctx, `/worlds/${q(code)}/invitations?cursor=${q(cursor)}`),
  invite: (ctx: WorldApiContext, code: string, input: { agent_code: string; version_no: number; public_identity: string; permissions: WorldPermissions }) => request<WorldInvitation>(ctx, `/worlds/${q(code)}/invitations`, { method: "POST", body: json(input) }),
  withdraw: (ctx: WorldApiContext, code: string, invitationCode: string) => request<WorldInvitation>(ctx, `/worlds/${q(code)}/invitations/${q(invitationCode)}/withdraw`, { method: "POST", body: "{}" }),
  participants: (ctx: WorldApiContext, code: string, cursor = "") => request<CursorPage<ParticipantBinding>>(ctx, `/worlds/${q(code)}/participants?cursor=${q(cursor)}`),
  pendingInvitations: (ctx: WorldApiContext, cursor = "") => request<CursorPage<WorldInvitation>>(ctx, `/world-invitations?cursor=${q(cursor)}`),
  invitation: (ctx: WorldApiContext, code: string) => request<InvitationDetail>(ctx, `/world-invitations/${q(code)}`),
  saveDecisionDraft: (ctx: WorldApiContext, code: string, expected_revision: number, public_identity: string, permissions: WorldPermissions) => request<WorldInvitation>(ctx, `/world-invitations/${q(code)}/decision-draft`, { method: "PUT", body: json({ expected_revision, public_identity, permissions }) }),
  decide: (ctx: WorldApiContext, code: string, decision: "accepted" | "rejected", expected_revision: number, idempotency_key: string) => request<DecisionResult>(ctx, `/world-invitations/${q(code)}/decision`, { method: "POST", body: json({ decision, expected_revision, idempotency_key }) }),
  recall: (ctx: WorldApiContext, participantCode: string) => request<ParticipantBinding>(ctx, `/world-participants/${q(participantCode)}/recall`, { method: "POST", body: "{}" }),
  schedule: (ctx: WorldApiContext, code: string) => request<WorldSchedule>(ctx, `/worlds/${q(code)}/schedule`),
  saveSchedule: (ctx: WorldApiContext, code: string, input: { expected_revision: number; scheduled_start_at: string; seed: number; timezone: "Asia/Shanghai"; daily_window: { start: string; end: string }; review_time: string; idempotency_key: string }) => request<WorldSchedule>(ctx, `/worlds/${q(code)}/schedule`, { method: "POST", body: json(input) }),
  cancelSchedule: (ctx: WorldApiContext, code: string, expected_revision: number) => request<WorldSchedule>(ctx, `/worlds/${q(code)}/schedule`, { method: "DELETE", body: json({ expected_revision }) }),
  launch: (ctx: WorldApiContext, code: string, input: { source: "manual" | "schedule"; schedule_code?: string; seed?: number; expected_revision: number; idempotency_key: string }) => request<LaunchRequest>(ctx, `/worlds/${q(code)}/launch-requests`, { method: "POST", body: json(input) }),
  eventCards: (ctx: WorldApiContext, code: string) => request<{ items: WorldEventCard[] }>(ctx, `/worlds/${q(code)}/event-cards`),
  createEventCard: (ctx: WorldApiContext, code: string, expected_revision: number, card: WorldEventCardDefinition) => request<WorldEventCard>(ctx, `/worlds/${q(code)}/event-cards`, { method: "POST", body: json({ expected_revision, card: eventCardDefinition(card) }) }),
  updateEventCard: (ctx: WorldApiContext, code: string, eventCode: string, expected_revision: number, card: WorldEventCardDefinition) => request<WorldEventCard>(ctx, `/worlds/${q(code)}/event-cards/${q(eventCode)}`, { method: "PUT", body: json({ expected_revision, card: eventCardDefinition(card) }) }),
  deleteEventCard: (ctx: WorldApiContext, code: string, eventCode: string, expected_revision: number) => request<void>(ctx, `/worlds/${q(code)}/event-cards/${q(eventCode)}`, { method: "DELETE", body: json({ expected_revision }) }),
  bootstrap: (ctx: WorldApiContext, code: string, requestCode: string) => request<WorldInstance>(ctx, `/worlds/${q(code)}/launch-requests/${q(requestCode)}/bootstrap`, { method: "POST", body: "{}" }),
  runtimeContract: (ctx: WorldApiContext, code: string) => request<WorldRuntimeContract>(ctx, `/worlds/${q(code)}/runtime-contract`),
  projection: (ctx: WorldApiContext, code: string, cursor = "") => request<WorldActorProjection>(ctx, `/worlds/${q(code)}/projection?cursor=${q(cursor)}`),
  barrier: (ctx: WorldApiContext, code: string, action: "pause" | "resume" | "takedown" | "archive", fence: { run_epoch: number; fencing_token: number; expected_revision: number }) => request<WorldRuntimeFence>(ctx, `/worlds/${q(code)}/runtime/barrier`, { method: "POST", body: json({ action, ...fence }) }),
  publicRecaps: (ctx: WorldApiContext, code: string, businessDate = "") => withItems(request<WorldRecapPage>(ctx, `/public/worlds/${q(code)}/recaps${businessDate ? `?business_date=${q(businessDate)}` : ""}`)),
  setVisibility: (ctx: WorldApiContext, code: string, visibility: WorldVisibility, expected_revision: number, idempotency_key: string) => request<WorldVisibilityView>(ctx, `/worlds/${q(code)}/public-visibility`, { method: "PUT", body: json({ visibility, expected_revision, idempotency_key }) }),
  reviewSubmissions: (ctx: WorldApiContext, code: string) => withItems(request<PlatformPendingPage<WorldReviewSubmission>>(ctx, `/worlds/${q(code)}/review-submissions`)),
  submitReview: (ctx: WorldApiContext, code: string, material_summary: string, expected_revision: number, idempotency_key: string) => request<WorldReviewSubmission>(ctx, `/worlds/${q(code)}/review-submissions`, { method: "POST", body: json({ material_summary, expected_revision, idempotency_key }) }),
  ownerReports: (ctx: WorldApiContext, code: string) => withItems(request<PlatformPendingPage<WorldOwnerReport>>(ctx, `/worlds/${q(code)}/reports`)),
  agentOwnerBinding: (ctx: WorldApiContext, participantCode: string) => request<WorldAgentOwnerBinding>(ctx, `/world-agent-owner/participants/${q(participantCode)}`),
  narrowAgentOwnerPermissions: (ctx: WorldApiContext, participantCode: string, permissions: WorldPermissions, expected_revision: number, idempotency_key: string) => request<WorldAgentOwnerBinding>(ctx, `/world-agent-owner/participants/${q(participantCode)}/permissions`, { method: "PUT", body: json({ permissions, expected_revision, idempotency_key }) }),
  recallAgentOwner: (ctx: WorldApiContext, participantCode: string, expected_revision: number, idempotency_key: string) => request<WorldAgentOwnerBinding>(ctx, `/world-agent-owner/participants/${q(participantCode)}/recall`, { method: "POST", body: json({ expected_revision, idempotency_key }) }),
  agentOwnerLimitedChange: (ctx: WorldApiContext, changeCode: string) => request<WorldLimitedChange>(ctx, `/world-agent-owner/limited-changes/${q(changeCode)}`),
  decideLimitedChange: (ctx: WorldApiContext, code: string, changeCode: string, input: { decision: "approve" | "reject" | "choice"; candidate_code?: string; run_epoch: number; fencing_token: number; expected_revision: number; idempotency_key: string }) => request<WorldLimitedChangeDecision>(ctx, `/worlds/${q(code)}/runtime/limited-changes/${q(changeCode)}/decisions`, { method: "POST", body: json(input) }),
};
