export type RiskLevel = "high" | "medium" | "low";
export type RiskStatus = "pending" | "reviewing" | "resolved";

export interface GovernanceRisk {
  id: string;
  object: string;
  kind: string;
  level: RiskLevel;
  source: string;
  status: RiskStatus;
  updatedAt: string;
  title: string;
  impact: string;
  suggestion: string;
  affectedUsers: number;
}

export const GOVERNANCE_RISKS: GovernanceRisk[] = [
  { id: "risk-1", object: "林月 v3.2", kind: "记忆边界", level: "high", source: "网页聊天", status: "pending", updatedAt: "2026-07-10 10:24", title: "用户关系记忆可能进入导出包", impact: "导出包可能包含用户关系记忆，带来隐私数据泄露风险。", suggestion: "收紧记忆导出策略，排除用户关系记忆类别。", affectedUsers: 637 },
  { id: "risk-2", object: "品牌客服", kind: "知识授权", level: "medium", source: "知识库", status: "reviewing", updatedAt: "2026-07-09 16:45", title: "知识库授权范围待复核", impact: "部分资料缺少明确的再分发许可。", suggestion: "补充授权凭证并限制未确认资料进入发布包。", affectedUsers: 184 },
  { id: "risk-3", object: "知识向导", kind: "导出权限", level: "low", source: "API 接入", status: "resolved", updatedAt: "2026-07-09 11:40", title: "API 导出权限已收紧", impact: "旧 Token 曾拥有过宽的导出范围。", suggestion: "保持最小权限并按季度轮换 Token。", affectedUsers: 29 },
];

export const GOVERNANCE_POLICIES = ["敏感词过滤", "个人信息保护", "禁止暴力/仇恨言论", "版权内容拦截", "医疗建议免责声明"];
export const GOVERNANCE_AUDIT = ["导出权限变更", "记忆边界策略更新", "知识库授权审核通过", "内容安全策略更新", "IP 授权续期"];
