"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { CaretDown, Check } from "@phosphor-icons/react";

export type SelectOption = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
  group?: string;
};

export function Select({
  value,
  options,
  onValueChange,
  ariaLabel,
  placeholder = "请选择",
  className = "",
  triggerClassName = "",
  disabled = false,
  compact = false,
}: {
  value: string;
  options: SelectOption[];
  onValueChange: (value: string) => void;
  ariaLabel: string;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  disabled?: boolean;
  compact?: boolean;
}) {
  const generatedId = useId();
  const listboxId = `${generatedId}-listbox`;
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(
    selectedIndex >= 0 ? selectedIndex : 0,
  );
  const [menuStyle, setMenuStyle] = useState<CSSProperties>();
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  useEffect(() => {
    if (!open) return;

    function closeOnOutsidePointer(event: PointerEvent) {
      const target = event.target as Node;
      if (
        !rootRef.current?.contains(target) &&
        !listboxRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }

    function positionMenu() {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const gap = 4;
      const below = window.innerHeight - rect.bottom - gap - 8;
      const above = rect.top - gap - 8;
      const openUp = below < 160 && above > below;
      const available = openUp ? above : below;
      setMenuStyle({
        left: Math.max(8, Math.min(rect.left, window.innerWidth - rect.width - 8)),
        minWidth: rect.width,
        maxWidth: Math.max(rect.width, window.innerWidth - 16),
        maxHeight: Math.max(96, Math.min(256, available)),
        ...(openUp
          ? { bottom: window.innerHeight - rect.top + gap }
          : { top: rect.bottom + gap }),
      });
    }

    positionMenu();
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    window.addEventListener("resize", positionMenu);
    window.addEventListener("scroll", positionMenu, true);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      window.removeEventListener("resize", positionMenu);
      window.removeEventListener("scroll", positionMenu, true);
    };
  }, [open]);

  useEffect(() => {
    if (open && menuStyle && document.activeElement !== listboxRef.current) {
      listboxRef.current?.focus();
    }
  }, [menuStyle, open]);

  useEffect(() => {
    if (selectedIndex >= 0) setActiveIndex(selectedIndex);
  }, [selectedIndex]);

  function nextEnabledIndex(start: number, direction: 1 | -1) {
    if (options.length === 0) return -1;
    let index = start;
    for (let count = 0; count < options.length; count += 1) {
      index = (index + direction + options.length) % options.length;
      if (!options[index]?.disabled) return index;
    }
    return -1;
  }

  function choose(index: number) {
    const option = options[index];
    if (!option || option.disabled) return;
    onValueChange(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (!["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowUp" ? -1 : 1;
    const start = selectedIndex >= 0 ? selectedIndex : direction === 1 ? -1 : 0;
    setActiveIndex(nextEnabledIndex(start, direction));
    setOpen(true);
  }

  function handleListboxKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" || event.key === "Tab") {
      setOpen(false);
      if (event.key === "Escape") triggerRef.current?.focus();
      return;
    }
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const start = event.key === "Home" ? -1 : 0;
      setActiveIndex(nextEnabledIndex(start, event.key === "Home" ? 1 : -1));
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex(
        nextEnabledIndex(activeIndex, event.key === "ArrowDown" ? 1 : -1),
      );
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(activeIndex);
    }
  }

  return (
    <div ref={rootRef} className={`relative inline-block ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-label={ariaLabel}
        aria-controls={listboxId}
        aria-expanded={open}
        aria-haspopup="listbox"
        disabled={disabled}
        className={`control-select flex w-full min-w-max items-center justify-between gap-3 pr-3 text-left ${
          compact ? "control-compact" : ""
        } ${triggerClassName}`}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleTriggerKeyDown}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <CaretDown
          size={compact ? 13 : 15}
          className={`shrink-0 text-text-muted transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && menuStyle && typeof document !== "undefined" && createPortal(
        <div
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel}
          aria-activedescendant={`${listboxId}-option-${activeIndex}`}
          tabIndex={-1}
          className="fixed z-[80] overflow-y-auto rounded-lg border border-border bg-surface p-1 shadow-xl outline-none"
          style={menuStyle}
          onKeyDown={handleListboxKeyDown}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;
            return (
              <div key={`${option.group ?? ""}-${option.value}`} role="presentation">
                {option.group &&
                  option.group !== options[index - 1]?.group && (
                    <div className="px-2.5 pb-1 pt-2 text-[11px] font-semibold text-text-muted first:pt-1">
                      {option.group}
                    </div>
                  )}
                <button
                  id={`${listboxId}-option-${index}`}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={option.disabled}
                  className={`flex min-h-8 w-full items-center gap-2 whitespace-nowrap rounded-md px-2.5 text-left text-sm transition ${
                    isSelected
                      ? "bg-primary-soft font-medium text-primary"
                      : isActive
                        ? "bg-subtle text-text-strong"
                        : "text-text-strong hover:bg-subtle"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                  onPointerMove={() => setActiveIndex(index)}
                  onClick={() => choose(index)}
                >
                  <span className="grid w-4 shrink-0 place-items-center">
                    {isSelected && <Check size={14} weight="bold" />}
                  </span>
                  <span className="truncate">{option.label}</span>
                </button>
              </div>
            );
          })}
        </div>,
        document.body,
      )}
    </div>
  );
}
