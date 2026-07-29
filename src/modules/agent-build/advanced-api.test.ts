import { afterEach, describe, expect, it, vi } from "vitest";
import {
  addBuiltinUpload,
  deleteAgentAvatar,
  getLLMProviderFamilies,
  getLLMProviderModelOptions,
  getRuntimeModelPatch,
  getRuntimeProviderPatch,
  getRuntimeProviderSelection,
  listStageSkills,
  resetEdgeToken,
  setStageSkills,
  uploadAgentAvatar,
  updateBuildCreatorSkill,
} from "./advanced-api";

afterEach(() => vi.restoreAllMocks());

const providers = [
  { name: "openai-gpt4o", display_name: "GPT-4o", description: "", model: "gpt-4o", skip_temperature: false, capabilities: ["text"] },
  { name: "gpt-5", display_name: "GPT5", description: "", model: "gpt-5", skip_temperature: false, capabilities: ["text"] },
  { name: "glm-5", display_name: "智谱 GLM-5", description: "", model: "glm-5", skip_temperature: true, capabilities: ["text"] },
  { name: "glm-4.7", display_name: "智谱 GLM-4.7", description: "", model: "glm-4.7", skip_temperature: false, capabilities: ["text"] },
];

describe("advanced build API", () => {
  it("reads and writes stage-specific skills", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: true, data: { mid_skills: [] } }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: true, data: { message: "Updated", draft_revision: 13 } }), { status: 200 }));
    await expect(listStageSkills("token", 32, "mid")).resolves.toEqual([]);
    await expect(
      setStageSkills("token", 32, "mid", 12, [
        { creator_skill_id: 7, config: { city: "上海" } },
      ]),
    ).resolves.toEqual({ message: "Updated", draft_revision: 13 });
    expect(fetchMock.mock.calls[1][0]).toContain("/agents/32/mid-skills");
    expect(JSON.parse(String((fetchMock.mock.calls[1][1] as RequestInit).body))).toEqual({
      expected_draft_revision: 12,
      mid_skills: [{ creator_skill_id: 7, config: { city: "上海" } }],
    });
  });

  it("sends draft revisions with avatar and built-in Skill mutations", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(
      async () =>
        new Response(
          JSON.stringify({
            success: true,
            data: { id: 32, draft_revision: 15, message: "Updated" },
          }),
          { status: 200 },
        ),
    );

    await uploadAgentAvatar("token", 32, new Blob(["avatar"]), 12);
    await deleteAgentAvatar("token", 32, 13);
    await addBuiltinUpload("token", 32, "image", 14);

    const uploadBody = fetchMock.mock.calls[0][1]?.body as FormData;
    expect(uploadBody.get("expected_draft_revision")).toBe("12");
    expect(String(fetchMock.mock.calls[1][0])).toContain(
      "/avatar?expected_draft_revision=13",
    );
    expect(String(fetchMock.mock.calls[2][0])).toContain(
      "add-builtin-image-upload?expected_draft_revision=14",
    );
  });

  it("preserves DRAFT_CONFLICT from multipart avatar responses", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: false,
          data: { code: "DRAFT_CONFLICT", error: "Draft revision changed" },
        }),
        { status: 409 },
      ),
    );

    await expect(
      uploadAgentAvatar("token", 32, new Blob(["avatar"]), 12),
    ).rejects.toMatchObject({ code: "DRAFT_CONFLICT", status: 409 });
  });

  it("groups concrete Provider configurations by supplier", () => {
    expect(getLLMProviderFamilies(providers).map((family) => ({
      key: family.key,
      label: family.label,
      providers: family.providers.map((provider) => provider.name),
    }))).toEqual([
      { key: "openai", label: "OpenAI", providers: ["openai-gpt4o", "gpt-5"] },
      { key: "zhipu", label: "智谱 AI", providers: ["glm-5", "glm-4.7"] },
    ]);
  });

  it("scopes model options to the selected supplier", () => {
    expect(getLLMProviderModelOptions(providers, "")).toEqual([]);
    expect(getLLMProviderModelOptions(providers, "openai-gpt4o")).toEqual(["gpt-4o", "gpt-5"]);
    expect(getLLMProviderModelOptions(providers, "glm-5", "legacy-model")).toEqual(["glm-5", "glm-4.7", "legacy-model"]);
  });

  it("maps supplier and model choices back to concrete backend Providers", () => {
    expect(getRuntimeProviderSelection("openai-gpt4o", "", providers)).toBe("catalogue:openai");
    expect(getRuntimeProviderSelection("", "anthropic", providers)).toBe("protocol:anthropic");
    expect(getRuntimeProviderPatch("catalogue:openai", providers)).toEqual({
      llmProvider: "openai-gpt4o",
      llmProviderType: "",
      llmModelName: "",
      llmBaseUrl: "",
    });
    expect(getRuntimeModelPatch("gpt-5", "catalogue:openai", providers)).toEqual({
      llmProvider: "gpt-5",
      llmModelName: "gpt-5",
    });
    expect(getRuntimeModelPatch("glm-5", "catalogue:zhipu", providers)).toEqual({
      llmProvider: "glm-5",
      llmModelName: "glm-5",
      llmTemperature: null,
    });
  });

  it("keeps custom compatibility protocols mutually exclusive", () => {
    expect(getRuntimeProviderPatch("protocol:anthropic", providers)).toEqual({
      llmProvider: "",
      llmProviderType: "anthropic",
      llmModelName: "",
    });
    expect(getRuntimeProviderPatch("", providers)).toEqual({
      llmProvider: "",
      llmProviderType: "",
      llmModelName: "",
      llmBaseUrl: "",
    });
  });

  it("resets the Edge token", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ success: true, data: { edge_token: "new-token" } }), { status: 200 }));
    await expect(resetEdgeToken("token", 32)).resolves.toEqual({ edge_token: "new-token" });
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/edge-token/reset"), expect.objectContaining({ method: "POST" }));
  });

  it("updates Creator Skill credentials only through top-level request fields", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: { id: 7, api_key_configured: true },
        }),
        { status: 200 },
      ),
    );

    await updateBuildCreatorSkill("token", 7, {
      config: { timeout_seconds: 15 },
      api_key: "new-secret-value",
    });

    const body = JSON.parse(
      String((fetchMock.mock.calls[0][1] as RequestInit).body),
    );
    expect(body).toEqual({
      config: { timeout_seconds: 15 },
      api_key: "new-secret-value",
    });
    expect(body.config).not.toHaveProperty("api_key");
  });

  it("omits unchanged credentials and sends null only when clearing", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(
      async () => new Response(
        JSON.stringify({
          success: true,
          data: { id: 7, api_key_configured: false },
        }),
        { status: 200 },
      ),
    );

    await updateBuildCreatorSkill("token", 7, {
      config: { max_results: 10 },
    });
    await updateBuildCreatorSkill("token", 7, { api_key: null });

    expect(
      JSON.parse(String((fetchMock.mock.calls[0][1] as RequestInit).body)),
    ).toEqual({ config: { max_results: 10 } });
    expect(
      JSON.parse(String((fetchMock.mock.calls[1][1] as RequestInit).body)),
    ).toEqual({ api_key: null });
  });
});
