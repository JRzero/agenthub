import { ChartPieSlice, Coins, FileText, Wallet } from "@phosphor-icons/react";
import { FutureModulePage } from "@/shared/ui/future-module-page";

export function RevenueWorkspace() {
  return (
    <FutureModulePage
      eyebrow="运营"
      title="收益中心"
      description="查看 Agent 使用、授权与结算信息"
      capabilityTitle="收益与结算能力尚未接入"
      capabilityDescription="使用量、计价、授权收益和人工结算表必须来自可审计的数据源。V1 仅保留产品入口，不展示演示金额或模拟账单。"
      icon={Coins}
      features={[
        { icon: ChartPieSlice, title: "收入与成本", description: "按 Agent 与来源核对使用收支" },
        { icon: Wallet, title: "授权收益", description: "查看授权与分成记录" },
        { icon: FileText, title: "结算明细", description: "获取可审计的入账与对账状态" },
      ]}
      notice="此页面不会使用演示金额冒充真实收益；账单与结算开放将以可审计的服务端数据为准。"
    />
  );
}
