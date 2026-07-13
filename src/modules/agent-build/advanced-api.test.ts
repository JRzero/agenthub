import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getLLMProviderFamilies,
  getLLMProviderModelOptions,
  getRuntimeModelPatch,
  getRuntimeProviderPatch,
  getRuntimeProviderSelection,
  listStageSkills,
  resetEdgeToken,
  setStageSkills,
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
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => new Response(JSON.stringify({ success: true, data: { mid_skills: [] } }), { status: 200 }));
    await expect(listStageSkills("token", 32, "mid")).resolves.toEqual([]);
    await setStageSkills("token", 32, "mid", [{ creator_skill_id: 7, config: { city: "上海" } }]);
    expect(fetchMock.mock.calls[1][0]).toContain("/agents/32/mid-skills");
    expect((fetchMock.mock.calls[1][1] as RequestInit).body).toBe(JSON.stringify({ mid_skills: [{ creator_skill_id: 7, config: { city: "上海" } }] }));
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
});
