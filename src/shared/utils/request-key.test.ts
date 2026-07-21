import { afterEach, describe, expect, it, vi } from "vitest";
import { createRequestKey } from "./request-key";

describe("createRequestKey", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uses crypto.randomUUID when it is available", () => {
    const randomUUID = vi.fn(() => "native-request-key");
    vi.stubGlobal("crypto", { randomUUID });

    expect(createRequestKey()).toBe("native-request-key");
    expect(randomUUID).toHaveBeenCalledOnce();
  });

  it("creates a UUID v4 when randomUUID is unavailable", () => {
    vi.stubGlobal("crypto", {
      getRandomValues: (bytes: Uint8Array) => {
        bytes.fill(0);
        return bytes;
      },
    });

    expect(createRequestKey()).toBe("00000000-0000-4000-8000-000000000000");
  });
});
