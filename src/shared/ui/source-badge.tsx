import type { CapabilitySource } from "@/config/capabilities";

const sourceCopy: Record<CapabilitySource, { label: string; className: string }> = {
  live: { label: "实时数据", className: "status-success" },
  derived: { label: "前端派生", className: "status-info" },
  demo: { label: "演示数据", className: "status-warning" },
  unavailable: { label: "待接入", className: "status-neutral" },
};

export function SourceBadge({ source }: { source: CapabilitySource }) {
  const copy = sourceCopy[source];
  return <span className={`status-badge ${copy.className}`}>{copy.label}</span>;
}
