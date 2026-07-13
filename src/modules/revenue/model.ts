export function netRevenue(income: number, cost: number): number {
  return Math.max(0, income - cost);
}

export function sourceShare(value: number, total: number): string {
  if (total <= 0) return "0.0%";
  return `${((value / total) * 100).toFixed(1)}%`;
}
