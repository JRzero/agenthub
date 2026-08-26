import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const liveSource = readFileSync(join(process.cwd(), "src/modules/living-worlds/live-event-workspace.tsx"), "utf8");
const detailSource = readFileSync(join(process.cwd(), "src/modules/living-worlds/detail-workspaces.tsx"), "utf8");

describe("Creator live-event component contract", () => {
  it("uses selectors and an explicit impact confirmation without a participant code textbox", () => {
    expect(liveSource).toContain('type="checkbox"');
    expect(liveSource).toContain('role="dialog"');
    expect(liveSource).toContain("确认投放一次");
    expect(liveSource).not.toContain("参与者 code（每行一项）");
  });

  it("reconciles unknown and known outcomes via GET and never invokes Tick", () => {
    expect(liveSource).toContain("worldApi.liveEvents(ctx, worldCode)");
    expect(liveSource).toContain("worldApi.liveEvent(ctx, worldCode, eventCode)");
    expect(liveSource).toContain("不会自动触发 Tick");
    expect(liveSource).not.toContain("worldApi.tick");
  });

  it("renders non-draft event cards as a read-only pre-opening contract", () => {
    expect(detailSource).toContain('detail.data.world.status !== "draft"');
    expect(detailSource).toContain("这些事件卡属于开演前冻结的运行契约");
    expect(detailSource).toContain("这里仅只读展示预开演配置");
  });
});
