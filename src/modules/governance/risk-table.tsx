import type { GovernanceRisk } from "./fixtures";
import { riskLevelLabel } from "./model";

const levelStyle = { high: "bg-danger/10 text-danger", medium: "bg-warning/10 text-warning", low: "bg-success/10 text-success" };
const statusCopy = { pending: "待处理", reviewing: "审核中", resolved: "已解决" };

export function RiskTable({ risks, selectedId, onSelect }: { risks: GovernanceRisk[]; selectedId: string; onSelect: (risk: GovernanceRisk) => void }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="bg-subtle text-xs text-text-muted"><tr><th className="px-5 py-3">对象</th><th>风险类型</th><th>级别</th><th>来源</th><th>状态</th><th>更新时间</th></tr></thead><tbody>{risks.map((risk) => <tr key={risk.id} onClick={() => onSelect(risk)} className={`cursor-pointer border-t border-border transition hover:bg-subtle ${selectedId === risk.id ? "bg-primary-soft/70" : ""}`}><td className="px-5 py-4 font-medium">{risk.object}</td><td>{risk.kind}</td><td><span className={`status-badge ${levelStyle[risk.level]}`}>{riskLevelLabel(risk.level)}</span></td><td>{risk.source}</td><td>{statusCopy[risk.status]}</td><td className="text-text-muted">{risk.updatedAt}</td></tr>)}</tbody></table></div>;
}
