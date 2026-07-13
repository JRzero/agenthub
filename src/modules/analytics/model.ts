import { ANALYTICS_SERIES } from "./fixtures";

export type AnalyticsMetric = keyof typeof ANALYTICS_SERIES;

export function metricSummary(metric: AnalyticsMetric) {
  const values = ANALYTICS_SERIES[metric];
  const current = values[values.length - 1];
  const baseline = values[0];
  const change = baseline ? ((current - baseline) / baseline) * 100 : 0;
  return { current, change };
}

export function formatMetric(metric: AnalyticsMetric, value: number): string {
  if (metric === "retention") return `${value.toFixed(1)}%`;
  return new Intl.NumberFormat("zh-CN").format(Math.round(value));
}
