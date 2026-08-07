import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(join(process.cwd(), "src/shared/layout/workspace-shell.tsx"), "utf8");

describe("workspace wide collection surfaces", () => {
  it("gives only the Workbench and Agent library the wider reference canvas", () => {
    expect(source).toContain('pathname === "/assets" || pathname === "/workbench"');
    expect(source).toContain('wideCollectionWorkspace ? "max-w-[1760px]" : "max-w-[1510px]"');
  });
});
