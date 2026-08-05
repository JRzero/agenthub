"use client";

import { useLayoutEffect, useRef } from "react";
import type { Icon } from "@phosphor-icons/react";
import {
  ArrowSquareOut,
  Brain,
  Database,
  Flask,
  IdentificationCard,
  ImageSquare,
  MagicWand,
  Robot,
  ShieldCheck,
  SlidersHorizontal,
  Stack,
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import {
  getBuildLifecyclePath,
  PROFESSIONAL_BUILD_GROUPS,
} from "./professional-navigation";
import type { BuildLifecycleDestination, BuildSectionId } from "./types";

const EDITOR_ICONS: Record<BuildSectionId, Icon> = {
  identity: IdentificationCard,
  persona: Robot,
  runtime: SlidersHorizontal,
  skills: MagicWand,
  knowledge: Database,
  memory: Brain,
  media: ImageSquare,
  safety: ShieldCheck,
};

const ROUTE_ICONS: Record<BuildLifecycleDestination, Icon> = {
  test: Flask,
  versions: Stack,
};

export function BuildSectionRail({
  agentId,
  active,
  onChange,
}: {
  agentId: number;
  active: BuildSectionId;
  onChange: (section: BuildSectionId) => void;
}) {
  const router = useRouter();
  const navRef = useRef<HTMLElement>(null);
  const resetDesktopHorizontalOffset = () => {
    if (
      window.matchMedia("(min-width: 1024px)").matches &&
      navRef.current?.scrollLeft
    ) {
      navRef.current.scrollLeft = 0;
    }
  };

  useLayoutEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const resetHorizontalOffset = () => {
      if (desktop.matches && navRef.current) navRef.current.scrollLeft = 0;
    };

    resetHorizontalOffset();
    desktop.addEventListener("change", resetHorizontalOffset);
    window.addEventListener("resize", resetHorizontalOffset);
    return () => {
      desktop.removeEventListener("change", resetHorizontalOffset);
      window.removeEventListener("resize", resetHorizontalOffset);
    };
  }, []);

  return (
    <aside className="min-h-0 min-w-0 border-b border-border bg-canvas lg:h-full lg:border-b-0 lg:border-r">
      <nav
        ref={navRef}
        aria-label="专业配置"
        onScroll={resetDesktopHorizontalOffset}
        onFocusCapture={resetDesktopHorizontalOffset}
        className="scrollbar-hidden h-full overflow-x-auto p-2 lg:overflow-x-hidden lg:overflow-y-auto lg:overscroll-contain"
      >
        <div className="flex min-w-max gap-3 lg:w-full lg:min-w-0 lg:flex-col lg:gap-2">
          {PROFESSIONAL_BUILD_GROUPS.map((group) => (
            <section key={group.id} className="min-w-max lg:min-w-0">
              <h2 className="mb-1 px-2 text-[10px] font-semibold tracking-[0.08em] text-text-muted">
                {group.label}
              </h2>
              <div className="flex gap-1 lg:flex-col">
                {group.items.map((item) => {
                  const selected = item.kind === "editor" && item.id === active;
                  const Icon =
                    item.kind === "editor"
                      ? EDITOR_ICONS[item.id]
                      : ROUTE_ICONS[item.id];
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={
                        item.kind === "editor" ? selected : undefined
                      }
                      onClick={() => {
                        if (item.kind === "editor") onChange(item.id);
                        else
                          router.push(getBuildLifecyclePath(agentId, item.id));
                      }}
                      className={`group flex min-h-10 min-w-max items-center gap-1.5 rounded-md px-2 py-1 text-left text-[13px] leading-5 transition lg:w-full ${selected ? "bg-primary-soft font-semibold text-primary" : "text-text-muted hover:bg-subtle hover:text-text-strong"}`}
                    >
                      <span
                        className={`grid size-[22px] shrink-0 place-items-center rounded-full border ${selected ? "border-primary bg-primary text-white" : "border-border bg-surface"}`}
                      >
                        <Icon size={13} />
                      </span>
                      <span className="flex-1">{item.label}</span>
                      {item.kind === "route" && (
                        <ArrowSquareOut size={12} className="text-text-muted" />
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </nav>
    </aside>
  );
}
