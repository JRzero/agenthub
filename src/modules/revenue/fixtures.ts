export const REVENUE_LABELS = ["07-01", "07-03", "07-05", "07-07", "07-09", "07-11", "07-13", "07-15", "07-17", "07-19", "07-21", "07-23", "07-25", "07-27", "07-29", "07-31"];
export const REVENUE_INCOME = [1500, 1650, 2250, 1850, 2350, 1900, 2850, 2250, 3400, 2600, 3500, 2750, 2450, 2950, 2300, 2250];
export const REVENUE_COST = [350, 520, 510, 700, 480, 650, 900, 600, 820, 680, 940, 820, 1110, 980, 790, 1030];

export const REVENUE_SOURCES = [
  { name: "运行调用", value: 14320, share: "58.1%", tone: "primary" },
  { name: "Agent 授权", value: 6480, share: "26.3%", tone: "violet" },
  { name: "OyiiOyii 分成", value: 2560, share: "10.4%", tone: "success" },
  { name: "活动转化", value: 1320, share: "5.2%", tone: "warning" },
] as const;

export const REVENUE_ROWS = [
  { date: "2026-07-10", agent: "林月 v3.2", source: "运行调用", income: 2860, cost: 860, share: 2000, status: "已入账" },
  { date: "2026-07-10", agent: "知识向导 v2.1", source: "Agent 授权", income: 1680, cost: 380, share: 1300, status: "核算中" },
  { date: "2026-07-09", agent: "品牌客服 v1.8", source: "运行调用", income: 1230, cost: 310, share: 920, status: "已入账" },
  { date: "2026-07-09", agent: "林月 v3.2", source: "OyiiOyii 分成", income: 980, cost: 240, share: 740, status: "核算中" },
  { date: "2026-07-08", agent: "知识向导 v2.1", source: "活动转化", income: 720, cost: 150, share: 570, status: "已入账" },
];
