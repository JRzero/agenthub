import { readFileSync, readdirSync } from "node:fs";
import { extname, join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "src/shared/ui/select.tsx"),
  "utf8",
);

function collectTsxFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectTsxFiles(path);
    return extname(entry.name) === ".tsx" ? [path] : [];
  });
}

describe("shared Select", () => {
  it("uses an app-rendered combobox and listbox contract", () => {
    expect(source).toContain('role="combobox"');
    expect(source).toContain('role="listbox"');
    expect(source).toContain('role="option"');
    expect(source).toContain("createPortal");
  });

  it("supports keyboard navigation and dismissal", () => {
    expect(source).toContain('"ArrowDown"');
    expect(source).toContain('"ArrowUp"');
    expect(source).toContain('"Home"');
    expect(source).toContain('"End"');
    expect(source).toContain('"Escape"');
  });

  it("keeps feature modules off native single-select popovers", () => {
    const nativeSelectFiles = collectTsxFiles(join(process.cwd(), "src"))
      .filter((path) => path !== join(process.cwd(), "src/shared/ui/select.tsx"))
      .filter((path) => readFileSync(path, "utf8").includes("<select"));

    expect(nativeSelectFiles).toEqual([]);
  });
});
