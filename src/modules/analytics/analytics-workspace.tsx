import { ChartLine, Devices, Gauge, UsersThree } from "@phosphor-icons/react";
import { FutureModulePage } from "@/shared/ui/future-module-page";

export function AnalyticsWorkspace() {
  return (
    <FutureModulePage
      eyebrow="运营"
      title="数据分析"
      description="了解 Agent 在不同应用端的使用与表现"
      capabilityTitle="数据分析能力尚未接入"
      capabilityDescription="当前后端还没有跨 Agent、应用端与版本的统一分析接口。为避免将设计指标误认为线上事实，V1 不展示趋势、报表或用户数据。"
      icon={ChartLine}
      features={[
        { icon: UsersThree, title: "Agent 表现对比", description: "活跃、对话与留存的统一口径" },
        { icon: Devices, title: "应用端趋势", description: "App、Web 与 API 渠道对比" },
        { icon: Gauge, title: "成本与质量", description: "基于可审计数据的质量分析" },
      ]}
      notice="此页面不会使用演示数据冒充生产分析；能力开放将以真实接口和指标口径为准。"
    />
  );
}
