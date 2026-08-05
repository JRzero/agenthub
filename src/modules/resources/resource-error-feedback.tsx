import React from "react";
import { ArrowClockwise } from "@phosphor-icons/react";

export function ResourceErrorFeedback({ message, onRetry, className = "" }: { message: string; onRetry: () => void; className?: string }) {
  if (!message) return null;
  return <div role="alert" className={`error-feedback flex items-center justify-between gap-4 ${className}`}><span>{message}</span><button type="button" onClick={onRetry} className="inline-flex shrink-0 items-center gap-2 font-semibold"><ArrowClockwise size={16} />重试</button></div>;
}
