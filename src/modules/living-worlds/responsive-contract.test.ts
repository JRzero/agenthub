import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { workspaceNavigation } from "@/shared/layout/navigation";

const detailSource = readFileSync(
  join(process.cwd(), "src/modules/living-worlds/detail-workspaces.tsx"),
  "utf8",
);
const runtimeSource = readFileSync(
  join(process.cwd(), "src/modules/living-worlds/runtime-workspaces.tsx"),
  "utf8",
);
const uiSource = readFileSync(
  join(process.cwd(), "src/modules/living-worlds/ui.tsx"),
  "utf8",
);

describe("Living World Creator responsive contract", () => {
  it("keeps the current V1 navigation entry hidden while deep links remain routable", () => {
    expect(workspaceNavigation.some((item) => item.href === "/worlds")).toBe(false);
  });

  it("pins detail request and populated roots to the available width", () => {
    expect(detailSource).toContain('className="panel w-full min-w-0 p-8"');
    expect(detailSource).toContain('return <div className="w-full min-w-0"><WorldPageHeader');
    expect(uiSource).toContain('className="w-full min-w-0 rounded-lg');
    expect(runtimeSource).toContain('className="mt-5 grid w-full min-w-0 gap-4');
  });

  it("keeps mobile key actions operable and long public codes inside their cards", () => {
    expect(detailSource).toContain('className="button-secondary min-h-11 w-full sm:w-auto"');
    expect(detailSource).toContain('className="button-secondary mt-3 min-h-11 w-full text-danger sm:w-auto"');
    expect(detailSource).toContain('className="mt-1 break-all font-mono text-xs text-text-muted"');
    expect(detailSource).toContain('flex-col items-start gap-1');
    expect(runtimeSource).toContain('triggerClassName="min-h-11"');
    expect(runtimeSource).toContain('triggerClassName="min-h-11" disabled={barrierUnknown}');
    expect(runtimeSource).toContain('disabled={!fence.data || barrierBusy || barrierUnknown} aria-disabled={!fence.data || barrierBusy || barrierUnknown}');
    expect(uiSource).toContain('className="button-secondary min-h-11 w-full sm:w-auto"');
  });
});
