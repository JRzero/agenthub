import { describe, expect, it } from "vitest";
import {
  NEXT_DEVELOPMENT_DIST_DIR,
  NEXT_PRODUCTION_DIST_DIR,
  resolveNextDistDir,
} from "./next-build-output";

describe("resolveNextDistDir", () => {
  it("isolates development artifacts", () => {
    expect(resolveNextDistDir("development")).toBe(
      NEXT_DEVELOPMENT_DIST_DIR,
    );
    expect(NEXT_DEVELOPMENT_DIST_DIR).toBe(".next-dev");
  });

  it.each(["production", "test", undefined])(
    "preserves the production output contract for %s",
    (nodeEnv) => {
      expect(resolveNextDistDir(nodeEnv)).toBe(NEXT_PRODUCTION_DIST_DIR);
      expect(NEXT_PRODUCTION_DIST_DIR).toBe(".next");
    },
  );
});
