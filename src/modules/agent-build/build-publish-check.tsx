"use client";

import {
  CaretRight,
  CheckCircle,
  CircleNotch,
  Info,
  WarningCircle,
} from "@phosphor-icons/react";
import type {
  PublishCheckAction,
  PublishCheckItem,
  PublishCheckResult,
} from "./publish-check-model";

function StateIcon({ item }: { item: PublishCheckItem }) {
  if (item.state === "passed") {
    return <CheckCircle size={16} weight="fill" className="text-success" />;
  }
  if (item.state === "blocked") {
    return <WarningCircle size={16} weight="fill" className="text-warning" />;
  }
  if (item.state === "pending") {
    return <CircleNotch size={16} className="animate-spin text-text-muted" />;
  }
  return <Info size={16} className="text-text-muted" />;
}

function statusClass(item: PublishCheckItem) {
  if (item.state === "passed") return "text-success";
  if (item.state === "blocked") return "text-warning";
  return "text-text-muted";
}

export function BuildPublishCheck({
  result,
  onAction,
}: {
  result: PublishCheckResult;
  onAction: (action: PublishCheckAction) => void;
}) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-text-strong">发布检查</h2>
        <p className="mt-1 text-xs leading-5 text-text-muted">
          发布前确认当前草稿是否可用
        </p>
      </div>

      <div className="border-y border-border">
        {result.items.map((item) => (
          <div
            key={item.id}
            className="border-b border-border py-4 last:border-b-0"
          >
            <div className="flex items-center gap-2">
              <StateIcon item={item} />
              <strong className="min-w-0 flex-1 text-sm font-medium text-text-strong">
                {item.label}
              </strong>
              <span className={`shrink-0 text-xs ${statusClass(item)}`}>
                {item.status}
              </span>
              {!item.action && (
                <CaretRight size={14} className="shrink-0 text-text-muted" />
              )}
            </div>
            {(item.detail || item.action) && (
              <div className="mt-2 flex items-start gap-3 pl-6">
                {item.detail && (
                  <p className="min-w-0 flex-1 text-xs leading-5 text-text-muted">
                    {item.detail}
                  </p>
                )}
                {item.action && (
                  <button
                    type="button"
                    className="shrink-0 text-xs font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                    onClick={() => onAction(item.action!)}
                  >
                    {item.action.label}
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div
        role="status"
        className={`mt-5 flex items-start gap-2 text-xs leading-5 ${
          result.blockers ? "text-warning" : "text-success"
        }`}
      >
        {result.blockers ? (
          <WarningCircle size={16} weight="fill" className="mt-0.5 shrink-0" />
        ) : (
          <CheckCircle size={16} weight="fill" className="mt-0.5 shrink-0" />
        )}
        <span>
          {result.blockers
            ? `完成 ${result.blockers} 项待处理内容后即可发布`
            : "当前没有阻塞项，可继续发布"}
        </span>
      </div>
    </div>
  );
}
