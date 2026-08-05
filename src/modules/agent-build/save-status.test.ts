import { describe, expect, it } from "vitest";
import { resolveBuildSaveStatus } from "./save-status";

describe("build save status", () => {
  it.each([
    [{ dirty: false, saving: false, error: "" }, "saved", "所有更改已保存", "status-saved"],
    [{ dirty: true, saving: false, error: "" }, "unsaved", "有未保存更改", "status-warning"],
    [{ dirty: true, saving: true, error: "" }, "saving", "保存中…", "status-info"],
    [{ dirty: true, saving: false, error: "网络错误" }, "failed", "保存失败", "status-danger"],
  ] as const)("presents %s", (input, status, label, className) => {
    expect(resolveBuildSaveStatus(input)).toMatchObject({ status, label, className });
  });
});
