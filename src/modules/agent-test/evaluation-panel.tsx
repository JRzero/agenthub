import type { Icon } from "@phosphor-icons/react";
import {
  BookOpenText,
  Brain,
  ChatCircleDots,
  CheckCircle,
  Coins,
  Database,
  IdentificationCard,
  ListMagnifyingGlass,
  Play,
  ShieldCheck,
  Smiley,
  Warning,
  Wrench,
} from "@phosphor-icons/react";
import { SourceBadge } from "@/shared/ui/source-badge";
import type {
  EvaluationMetricId,
  EvaluationResult,
  TestMessage,
} from "./types";

const metricIcons: Record<EvaluationMetricId, Icon> = {
  character: IdentificationCard,
  emotion: Smiley,
  safety: ShieldCheck,
  knowledge: BookOpenText,
  fluency: ChatCircleDots,
};

export function EvaluationPanel({
  result,
  messages,
  canEvaluate,
  onRun,
  onReset,
}: {
  result: EvaluationResult | null;
  messages: TestMessage[];
  canEvaluate: boolean;
  onRun: () => void;
  onReset: () => void;
}) {
  const tokenUsage = messages.reduce((total, message) => total + (message.usage?.total_tokens || 0), 0);
  return (
    <aside className="flex min-h-0 flex-col border-t border-border bg-surface xl:border-l xl:border-t-0">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="font-semibold">评估结果</h2>
          <div className="mt-1"><SourceBadge source="derived" /></div>
        </div>
        <button type="button" disabled={!canEvaluate} onClick={onRun} className="button-primary min-h-9 px-4"><Play size={16} />运行评估</button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {!result ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-border p-6 text-center">
            <Brain size={30} className="text-primary" />
            <h3 className="mt-3 font-semibold">等待评估</h3>
            <p className="mt-2 max-w-xs text-sm leading-6 text-text-muted">完成至少一轮 Agent 回答后运行前端派生评估。它不是模型裁判或后端质量分。</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-5 border-b border-border pb-5">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-[7px] border-primary text-3xl font-semibold text-primary">
                {result.overall}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">综合得分</h3>
                  <span className={`status-badge ${result.status === "good" ? "status-success" : "status-warning"}`}>
                    {result.status === "good" ? "良好" : "需优化"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-text-muted">通过 {result.passed} 项，部分通过 {result.partial} 项</p>
                <p className="mt-1 text-xs text-text-muted">{new Date(result.generatedAt).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })} · 前端规则</p>
              </div>
            </div>

            <div className="divide-y divide-border">
              {result.metrics.map((item) => {
                const Icon = metricIcons[item.id];
                return (
                  <div key={item.id} className="grid grid-cols-[24px_1fr_auto] items-center gap-3 py-4" title={item.reason}>
                    <Icon size={20} className="text-text-muted" />
                    <div className="min-w-0">
                      <strong className="block text-sm font-medium">{item.label}</strong>
                      <span className="block truncate text-xs text-text-muted">{item.reason}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <strong className={item.status === "passed" ? "text-success" : "text-warning"}>{item.score}</strong>
                      {item.status === "passed" ? <CheckCircle size={17} weight="fill" className="text-success" /> : <Warning size={17} weight="fill" className="text-warning" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <div className="mt-5 divide-y divide-border border-y border-border">
          <Diagnostic icon={ListMagnifyingGlass} label="调用轨迹" value="后端未返回" />
          <Diagnostic icon={Database} label="记忆命中" value="未采集" />
          <Diagnostic icon={Wrench} label="工具调用" value="未采集" />
          <Diagnostic icon={ChatCircleDots} label="Token 用量" value={tokenUsage ? `${tokenUsage} tokens` : "未返回"} />
          <Diagnostic icon={Coins} label="本轮成本" value="不可用" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-border p-4">
        <button type="button" disabled className="button-secondary" title="等待后端测试集接口">保存为测试集</button>
        <button type="button" onClick={onReset} className="button-secondary">重新测试</button>
      </div>
    </aside>
  );
}

function Diagnostic({ icon: Icon, label, value }: { icon: Icon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-3 text-sm">
      <Icon size={18} className="text-text-muted" />
      <span className="flex-1">{label}</span>
      <span className="text-text-muted">{value}</span>
    </div>
  );
}
