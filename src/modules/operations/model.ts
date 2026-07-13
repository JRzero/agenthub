import type { SharedSessionRow } from "./types";

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
