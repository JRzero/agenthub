import { describe, expect, it } from "vitest";
import type { DistributionChannel } from "./types";
import { getShareQrValue } from "./share-qr";

const channel = { id: "web-chat", name: "Web Chat", version: "1.0", versionHint: "", compatibility: "compatible", compatibilityLabel: "兼容", compatibilityHint: "", status: "running", statusLabel: "运行中", shareUrl: "https://example.com/shared/abc" } as DistributionChannel;

describe("share QR visibility", () => {
  it("encodes exactly the active Web Chat share URL", () => {
    expect(getShareQrValue(channel)).toBe("https://example.com/shared/abc");
  });

  it("hides QR for paused, missing, or non-Web channels", () => {
    expect(getShareQrValue({ ...channel, status: "paused" })).toBeNull();
    expect(getShareQrValue({ ...channel, shareUrl: undefined })).toBeNull();
    expect(getShareQrValue({ ...channel, id: "oyiioyii" })).toBeNull();
  });
});
