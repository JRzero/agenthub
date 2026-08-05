import { describe, expect, it } from "vitest";
import { getSafeResourceError } from "./resource-feedback";

describe("resource error feedback", () => {
  it("keeps short actionable messages", () => {
    expect(getSafeResourceError(new Error("上传文档失败"), "保存失败")).toBe("上传文档失败");
  });

  it("does not expose server internals, credentials, paths, or URLs", () => {
    expect(getSafeResourceError(new Error("Internal Server Error: token=secret /Users/dev/private.log"), "加载失败")).toBe("加载失败");
    expect(getSafeResourceError(new Error("https://internal.example/api failed"), "加载失败")).toBe("failed");
  });
});
