import type { CapabilitySource } from "@/config/capabilities";

const sourceCopy: Record<CapabilitySource, { label: string; className: string }> = {
  live: { label: "实时数据", className: "status-success" },
  derived: { label: "前端派生", className: "bg-indigo-50 text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-300 dark:ring-1 dark:ring-inset dark:ring-indigo-400/20" },
  demo: { label: "演示数据", className: "status-warning" },
  unavailable: { label: "待接入", className: "status-neutral" },
};

export function SourceBadge({ source }: { source: CapabilitySource }) {
  const copy = sourceCopy[source];
  return <span className={`status-badge ${copy.className}`}>{copy.label}</span>;
}
