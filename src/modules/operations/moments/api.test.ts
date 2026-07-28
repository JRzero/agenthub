import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { apiRequest } from "@/shared/api/http-client";
import {
  addMomentComment,
  createMoment,
  deleteMoment,
  deleteMomentSchedule,
  generateMomentSchedule,
  getMoment,
  getMomentDraft,
  getMomentSchedule,
  listMomentComments,
  listMoments,
  uploadMomentImage,
} from "./api";

vi.mock("@/shared/api/http-client", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/shared/api/http-client")>()),
  apiRequest: vi.fn(),
  getApiBaseUrl: () => "http://localhost:8080",
}));

const auth = { apiKey: "et_test_moments", workspaceCode: "studio" };

describe("OyiiOyii Moment contracts", () => {
  beforeEach(() => vi.mocked(apiRequest).mockReset());
  afterEach(() => vi.unstubAllGlobals());

  it("lists global or Agent-scoped published Moments with pagination", async () => {
    vi.mocked(apiRequest).mockResolvedValueOnce({
      moments: [{ id: 1, image_urls: [], video_urls: [] }],
      total: 31,
    } as never);
    vi.mocked(apiRequest).mockResolvedValueOnce({ moments: [] } as never);

    await expect(listMoments(auth, { limit: 20, offset: 20 })).resolves.toMatchObject({
      total: 31,
      offset: 20,
    });
    await listMoments(auth, { agentId: 32, limit: 10 });

    expect(apiRequest).toHaveBeenNthCalledWith(
      1,
      "/moments?limit=20&offset=20",
      auth,
    );
    expect(apiRequest).toHaveBeenNthCalledWith(
      2,
      "/agents/32/moments?limit=10&offset=0",
      auth,
    );
  });

  it("generates, reads, publishes and deletes without draft status", async () => {
    vi.mocked(apiRequest).mockResolvedValue({
      id: 7,
      agent_id: 32,
      content: "新动态",
      image_urls: [],
      video_urls: [],
    } as never);

    await getMomentDraft(auth, 32);
    await getMoment(auth, 7);
    await createMoment(auth, 32, { content: "新动态", auto_image: true });
    await deleteMoment(auth, 32, 7);

    expect(apiRequest).toHaveBeenNthCalledWith(
      3,
      "/agents/32/moments",
      expect.objectContaining({ method: "POST" }),
    );
    expect(apiRequest).toHaveBeenNthCalledWith(
      4,
      "/agents/32/moments/7",
      expect.objectContaining({ method: "DELETE" }),
    );
  });

  it("lists and adds comments", async () => {
    vi.mocked(apiRequest).mockResolvedValue({ comments: [] } as never);
    await listMomentComments(auth, 7);
    await addMomentComment(auth, 7, "很棒");
    expect(apiRequest).toHaveBeenNthCalledWith(1, "/moments/7/comments", auth);
    expect(apiRequest).toHaveBeenNthCalledWith(
      2,
      "/moments/7/comments",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("reads, generates and disables Agent-scoped automatic schedules", async () => {
    vi.mocked(apiRequest).mockResolvedValue({
      config: null,
      schedules: [],
    } as never);

    await getMomentSchedule(auth, 32);
    await generateMomentSchedule(auth, 32);
    await deleteMomentSchedule(auth, 32);

    expect(apiRequest).toHaveBeenNthCalledWith(
      1,
      "/agents/32/moments/auto-schedule",
      auth,
    );
    expect(apiRequest).toHaveBeenNthCalledWith(
      2,
      "/agents/32/moments/auto-schedule",
      expect.objectContaining({ method: "POST", workspaceCode: "studio" }),
    );
    expect(apiRequest).toHaveBeenNthCalledWith(
      3,
      "/agents/32/moments/auto-schedule",
      expect.objectContaining({ method: "DELETE", workspaceCode: "studio" }),
    );
  });

  it("uploads images with auth and workspace headers", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            success: true,
            data: { token: "img-1", url_800: "/800.jpg", url_240: "/240.jpg" },
          }),
          { status: 200 },
        ),
      ),
    );

    await uploadMomentImage(
      auth,
      new File(["image"], "moment.jpg", { type: "image/jpeg" }),
    );

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/files/upload-moment-image",
      expect.objectContaining({
        method: "POST",
        headers: {
          "X-API-Key": "et_test_moments",
          "X-Workspace-Code": "studio",
        },
      }),
    );
  });
});
