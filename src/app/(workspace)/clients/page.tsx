import { capabilitySource } from "@/config/capabilities";
import { FutureModulePage } from "@/shared/ui/future-module-page";

export default function ClientsPage() {
  return <FutureModulePage eyebrow="工作空间" title="Clients 与 Adapters" source={capabilitySource("clientAdapters")} description="管理 Client 注册、运行边界、技能、Memory、计费和风控适配。演示模式只展示明确标识的 fixture。" />;
}
