"use client";

import { CheckCircle, Info, Moon } from "@phosphor-icons/react";

export function AppearancePanel() {
  return (
    <section aria-labelledby="appearance-title">
      <h2 id="appearance-title" className="text-xl font-semibold">外观</h2>
      <p className="mt-2 text-sm text-text-muted">AgentHub V1 使用统一深色工作区，以保持创作与运营页面的一致视觉层级。</p>
      <div className="mt-6 max-w-xl rounded-xl border border-primary/60 bg-surface p-5 ring-1 ring-primary/15">
        <div className="flex items-start justify-between gap-4">
          <span className="grid size-11 place-items-center rounded-lg bg-surface-elevated text-primary"><Moon size={22} aria-hidden="true" /></span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success"><CheckCircle size={16} />当前外观</span>
        </div>
        <h3 className="mt-5 text-base font-semibold">V1 深色</h3>
        <p className="mt-1.5 text-sm leading-6 text-text-muted">使用固定的深色画布、低对比度表面与青柠色关键状态。</p>
      </div>
      <p className="mt-5 flex max-w-xl items-start gap-2 rounded-lg border border-border bg-surface px-4 py-3 text-xs leading-5 text-text-muted">
        <Info size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
        亮色主题尚未纳入 V1 设计令牌，因此此处不提供不会产生真实视觉变化的主题切换。
      </p>
    </section>
  );
}
