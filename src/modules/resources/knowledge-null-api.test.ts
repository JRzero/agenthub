import { beforeEach, describe, expect, it, vi } from "vitest";
import { listDocumentChunks, listDocuments, listKnowledgeBases } from "./api";

function nullDataResponse(): Response {
  return new Response(JSON.stringify({ success: true, data: null }), { status: 200 });
}

describe("knowledge API empty response compatibility", () => {
  beforeEach(() => { window.localStorage.clear(); vi.restoreAllMocks(); });

  it("normalizes null knowledge-base and document lists to empty arrays", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async () => nullDataResponse());
    await expect(listKnowledgeBases("key", "default")).resolves.toEqual([]);
    await expect(listDocuments("key", "default", 1)).resolves.toEqual([]);
  });

  it("normalizes a null chunk page to the requested empty page", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(nullDataResponse());
    await expect(listDocumentChunks("key", "default", 1, 2, 10)).resolves.toEqual({
      chunks: [], total: 0, page: 2, page_size: 10,
    });
  });
});
