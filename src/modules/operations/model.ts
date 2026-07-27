import type { SharedSessionRow } from "./types";

export const OPERATIONS_TABS = [
  ["sessions", "会话管理"],
  ["moments", "朋友圈管理"],
  ["feedback", "用户反馈"],
  ["memory", "记忆问题"],
  ["campaign", "活动与渠道"],
] as const;

export type OperationsModule = (typeof OPERATIONS_TABS)[number][0];

export function resolveOperationsModule(
  value: string | null,
): OperationsModule {
  return OPERATIONS_TABS.some(([id]) => id === value)
    ? (value as OperationsModule)
    : "sessions";
}

export function operationsModuleLabel(module: OperationsModule): string {
  return (
    OPERATIONS_TABS.find(([id]) => id === module)?.[1] || "应用运营模块"
  );
}

export function sessionLabel(row: SharedSessionRow): string {
  return row.session.title?.trim() || `${row.agent.name} · #${row.session.id}`;
}

export function humanLabel(row: SharedSessionRow): string {
  return row.human.display_name?.trim() || row.human.username;
}

export function filterSessions(rows: SharedSessionRow[], query: string, agentId: number | "", status: string): SharedSessionRow[] {
  const keyword = query.trim().toLowerCase();
  return rows.filter((row) => {
    const matchesQuery = !keyword || `${sessionLabel(row)} ${humanLabel(row)} ${row.agent.name}`.toLowerCase().includes(keyword);
    return matchesQuery && (!agentId || row.agent.id === agentId) && (status === "all" || row.session.status === status);
  });
}
