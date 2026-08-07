import { useEffect, useState } from "react";
import type { WorkbenchTransitionPhase } from "./workbench-transition";

export const WORKBENCH_AUTOPLAY_MS = 6_000;

export type WorkbenchAutoplayConditions = {
  agentCount: number;
  phase: WorkbenchTransitionPhase;
  pausedByUser: boolean;
  hovered: boolean;
  focusWithin: boolean;
  documentHidden: boolean;
  reducedMotion: boolean;
};

export function shouldRunWorkbenchAutoplay({
  agentCount,
  phase,
  pausedByUser,
  hovered,
  focusWithin,
  documentHidden,
  reducedMotion,
}: WorkbenchAutoplayConditions): boolean {
  return agentCount > 1
    && phase === "idle"
    && !pausedByUser
    && !hovered
    && !focusWithin
    && !documentHidden
    && !reducedMotion;
}

export function scheduleWorkbenchAutoplay(
  conditions: WorkbenchAutoplayConditions,
  onAdvance: () => void,
  delay = WORKBENCH_AUTOPLAY_MS,
): () => void {
  if (!shouldRunWorkbenchAutoplay(conditions)) return () => undefined;
  const timer = globalThis.setTimeout(onAdvance, delay);
  return () => globalThis.clearTimeout(timer);
}

export function usePrefersReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener?.("change", sync);
    return () => query.removeEventListener?.("change", sync);
  }, []);

  return reducedMotion;
}

export function useDocumentHidden(): boolean {
  const [documentHidden, setDocumentHidden] = useState(
    () => typeof document !== "undefined" && document.hidden,
  );

  useEffect(() => {
    const sync = () => setDocumentHidden(document.hidden);
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  return documentHidden;
}

export function useWorkbenchAutoplay(
  conditions: WorkbenchAutoplayConditions,
  resetGeneration: number,
  onAdvance: () => void,
): void {
  const {
    agentCount,
    phase,
    pausedByUser,
    hovered,
    focusWithin,
    documentHidden,
    reducedMotion,
  } = conditions;

  useEffect(() => scheduleWorkbenchAutoplay({
    agentCount,
    phase,
    pausedByUser,
    hovered,
    focusWithin,
    documentHidden,
    reducedMotion,
  }, onAdvance), [
    agentCount,
    documentHidden,
    focusWithin,
    hovered,
    onAdvance,
    pausedByUser,
    phase,
    reducedMotion,
    resetGeneration,
  ]);
}
