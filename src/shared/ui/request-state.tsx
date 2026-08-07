"use client";

import { ArrowClockwise, WarningCircle } from "@phosphor-icons/react";

export function LoadingState({ label = "正在加载…" }: { label?: string }) {
  return (
    <div className="panel flex min-h-[320px] items-center justify-center" role="status" aria-live="polite">
      <div className="flex items-center gap-3 text-sm text-text-secondary">
        <span className="loading-spin h-5 w-5 rounded-full border-2 border-primary/20 border-t-primary" aria-hidden="true" />
        {label}
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="panel flex min-h-[320px] flex-col items-center justify-center px-6 text-center" role="alert">
      <WarningCircle size={30} className="text-danger" />
      <h2 className="mt-3 text-base font-semibold">暂时无法加载</h2>
      <p className="mt-2 max-w-md text-sm text-text-secondary">{message}</p>
      <button type="button" onClick={onRetry} className="button-secondary mt-5">
        <ArrowClockwise size={17} />
        重试
      </button>
    </div>
  );
}
