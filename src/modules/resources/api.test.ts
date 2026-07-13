import { beforeEach, describe, expect, it, vi } from "vitest";
import { DEMO_AGENTS } from "@/fixtures/demo-data";
import { DEMO_MARKETPLACE_SKILLS } from "./fixtures";
import {
  attachSkillToAgent,
  createCreatorSkill,
  createKnowledgeBase,
  getSkillDefaults,
  listDocumentChunks,
  listMarketplaceSkills,
  updateCreatorSkill,
  updateKnowledgeBase,
} from "./api";
import { uploadKnowledgeDocument } from "./upload-api";

describe("resource APIs", () => {
  beforeEach(() => { window.localStorage.clear(); vi.restoreAllMocks(); });

  it("scopes marketplace reads to the workspace", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ success: true, data: { skills: [] } }), { status: 200 }));
    await listMarketplaceSkills("key", "studio");
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/skills/marketplace"), expect.objectContaining({ headers: expect.objectContaining({ "X-Workspace-Code": "studio" }) }));
  });

  it("attaches a skill without dropping existing skills", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ success: true, data: DEMO_AGENTS[0] }), { status: 200 }));
    await attachSkillToAgent("key", "studio", DEMO_AGENTS[0], DEMO_MARKETPLACE_SKILLS[0]);
    const body = JSON.parse(String((fetchMock.mock.calls[0][1] as RequestInit).body));
    expect(body.skills).toContain("知识检索");
    expect(body.skills).toContain("realtime_weather");
  });

  it("installs schema defaults with a Creator Skill", async () => {
    const skill = { ...DEMO_MARKETPLACE_SKILLS[0], config_schema: { properties: { count: { type: "number", default: 3 }, query: { type: "string" } } } };
    expect(getSkillDefaults(skill)).toEqual({ count: 3 });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ success: true, data: {} }), { status: 200 }));
    await createCreatorSkill("key", "studio", skill);
    expect(JSON.parse(String((fetchMock.mock.calls[0][1] as RequestInit).body)).config).toEqual({ count: 3 });
  });

  it("updates Creator Skill configuration and status", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ success: true, data: {} }), { status: 200 }));
    await updateCreatorSkill("key", "studio", 9, { name: "检索", status: "inactive", config: { limit: 5 } });
    expect(fetchMock.mock.calls[0][0]).toContain("/creator-skills/9");
    expect(JSON.parse(String((fetchMock.mock.calls[0][1] as RequestInit).body))).toMatchObject({ status: "inactive", config: { limit: 5 } });
  });

  it("creates and updates knowledge bases through compatible contracts", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => new Response(JSON.stringify({ success: true, data: {} }), { status: 200 }));
    await createKnowledgeBase("key", "studio", { name: "FAQ", description: "常见问题" });
    await updateKnowledgeBase("key", "studio", 2, { name: "产品 FAQ" });
    expect((fetchMock.mock.calls[0][1] as RequestInit).method).toBe("POST");
    expect((fetchMock.mock.calls[1][1] as RequestInit).method).toBe("PUT");
  });

  it("loads a bounded document chunk page", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ success: true, data: { chunks: [], total: 0, page: 2, page_size: 10 } }), { status: 200 }));
    await listDocumentChunks("key", "studio", 12, 2, 10);
    expect(fetchMock.mock.calls[0][0]).toContain("/documents/12/chunks?page=2&page_size=10");
  });

  it("uploads multipart documents with auth and workspace headers", async () => {
    const data = { id: 3, uuid: "doc", knowledge_base_id: 1, source_type: "file", source: "guide.pdf", title: "guide.pdf", chunk_count: 0, status: "pending", progress: 0, created_at: "now", updated_at: "now" };
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ success: true, data }), { status: 200 }));
    await uploadKnowledgeDocument("key", "studio", 1, new File(["hello"], "guide.pdf", { type: "application/pdf" }));
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect(init.body).toBeInstanceOf(FormData);
    expect(init.headers).toEqual({ "X-API-Key": "key", "X-Workspace-Code": "studio" });
  });
});
