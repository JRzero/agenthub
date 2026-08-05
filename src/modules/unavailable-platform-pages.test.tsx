import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AnalyticsWorkspace } from "./analytics/analytics-workspace";
import { GovernanceWorkspace } from "./governance/governance-workspace";
import { RevenueWorkspace } from "./revenue/revenue-workspace";

const forbiddenPageClaims = [
  "18,642",
  "24,680",
  "待处理 2",
  "导出演示报告",
  "查看演示结算单",
  "创建治理策略",
  "邀请成员",
  "申请开通",
];

Object.assign(globalThis, { React });

describe("unavailable platform pages", () => {
  it.each([
    ["analytics", AnalyticsWorkspace, "数据分析能力尚未接入"],
    ["revenue", RevenueWorkspace, "收益与结算能力尚未接入"],
    ["governance", GovernanceWorkspace, "成员与权限能力尚未接入"],
  ] as const)("renders %s as an honest unavailable state", (_name, Component, expectedCopy) => {
    const html = renderToStaticMarkup(React.createElement(Component));
    expect(html).toContain("暂未开放");
    expect(html).toContain(expectedCopy);
    forbiddenPageClaims.forEach((claim) => expect(html).not.toContain(claim));
  });

  it("keeps both governance concepts on the existing route without fake records", () => {
    const html = renderToStaticMarkup(React.createElement(GovernanceWorkspace));
    expect(html).toContain("角色权限");
    expect(html).toContain("内容安全");
    expect(html).not.toContain("演示启用");
    expect(html).not.toContain("高风险");
  });
});
