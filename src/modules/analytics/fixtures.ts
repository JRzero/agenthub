export const ANALYTICS_LABELS = [
  "06-11", "06-13", "06-15", "06-17", "06-19", "06-21", "06-23", "06-25",
  "06-27", "06-29", "07-01", "07-03", "07-05", "07-07", "07-09", "07-10",
];

export const ANALYTICS_SERIES = {
  users: [7100, 7600, 8050, 8700, 7900, 8300, 8500, 9100, 9600, 9350, 10300, 10100, 9050, 9000, 9800, 9900],
  conversations: [3900, 4200, 4100, 4450, 4300, 4380, 4500, 4700, 4950, 4700, 5100, 5150, 4550, 4450, 4700, 4800],
  retention: [34, 35, 36, 35, 37, 38, 37, 38, 39, 38, 39, 40, 38, 37, 39, 38.6],
};

export const ANALYTICS_AGENTS = [
  { id: 32, name: "林月", users: 8642, conversations: 20318, retention: "41.2%", cost: "0.25 积分", trend: "+15.6%" },
  { id: 19, name: "知识向导", users: 5021, conversations: 12864, retention: "36.7%", cost: "0.31 积分", trend: "+9.3%" },
  { id: 14, name: "品牌客服", users: 3876, conversations: 8926, retention: "34.8%", cost: "0.28 积分", trend: "+6.2%" },
];

export const ANALYTICS_INSIGHTS = [
  { title: "OyiiOyii App 活跃用户增长明显", detail: "近 30 天活跃用户较前一周期提升 18.3%。", tone: "primary" },
  { title: "网页聊天留存需优化", detail: "次日留存低于 App 渠道，建议优化对话引导。", tone: "success" },
  { title: "API 接入成本偏高", detail: "每次对话成本高于平均水平，建议复核模型策略。", tone: "warning" },
] as const;
