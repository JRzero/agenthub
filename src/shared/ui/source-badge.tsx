import type { CapabilitySource } from "@/config/capabilities";

const sourceCopy: Record<CapabilitySource, { label: string; className: string }> = {
  live: { label: "实时数据", className: "bg-emerald-50 text-emerald-700" },
  derived: { label: "前端派生", className: "bg-indigo-50 text-indigo-700" },
  demo: { label: "演示数据", className: "bg-amber-50 text-amber-700" },
  unavailable: { label: "待接入", className: "bg-slate-100 text-slate-600" },
};

export function SourceBadge({ source }: { source: CapabilitySource }) {
  const copy = sourceCopy[source];
  return <span className={`status-badge ${copy.className}`}>{copy.label}</span>;
}
