import { describe, expect, it } from "vitest";
import { DEMO_DOCUMENTS } from "./fixtures";
import { filterKnowledgeDocuments, getDocumentSourceLabel, getKnowledgeStatusPresentation } from "./knowledge-presentation";
import type { KnowledgeDocument } from "./types";

describe("knowledge document presentation", () => {
  it.each([
    ["pending", "等待索引"],
    ["processing", "索引中"],
    ["ready", "已就绪"],
    ["failed", "索引失败"],
  ] as const)("uses an icon and text for %s", (status, label) => {
    const presentation = getKnowledgeStatusPresentation(status);
    expect(presentation.label).toBe(label);
    expect(presentation.icon).toBeTypeOf("object");
  });

  it("filters by query and explicit status", () => {
    const ready = DEMO_DOCUMENTS[8][0];
    const failed: KnowledgeDocument = { ...ready, id: 99, title: "FAQ URL", status: "failed" };
    expect(filterKnowledgeDocuments([ready, failed], "faq", "failed")).toEqual([failed]);
    expect(filterKnowledgeDocuments([ready, failed], "missing", "all")).toEqual([]);
  });

  it("does not expose a local file path in document details", () => {
    const document = { ...DEMO_DOCUMENTS[8][0], source_type: "file" as const, source: "/srv/private/uploads/guide.pdf" };
    expect(getDocumentSourceLabel(document)).toBe("guide.pdf");
  });
});
