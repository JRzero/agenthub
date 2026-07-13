import { afterEach, describe, expect, it, vi } from "vitest";
import { changePassword, getProfile, updateProfile } from "./api";

afterEach(() => vi.restoreAllMocks());

describe("settings API", () => {
  it("reads the creator profile", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ success: true, data: { id: 1, uuid: "u", username: "creator", email: "creator@example.com", status: "active" } }), { status: 200 }));
    await expect(getProfile("token")).resolves.toMatchObject({ username: "creator" });
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/api/v1/profile"), expect.objectContaining({ method: "GET", headers: expect.objectContaining({ "X-API-Key": "token" }) }));
  });

  it("updates profile and password with the legacy contract", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ success: true, data: { id: 1, uuid: "u", username: "new-name", email: "creator@example.com", status: "active" } }), { status: 200 }));
    await updateProfile("token", { username: "new-name", full_name: "New Name" });
    expect(JSON.parse(String((fetchMock.mock.calls[0][1] as RequestInit).body))).toEqual({ username: "new-name", full_name: "New Name" });
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ success: true, data: { message: "ok" } }), { status: 200 }));
    await changePassword("token", "old-password", "new-password");
    expect(JSON.parse(String((fetchMock.mock.calls[1][1] as RequestInit).body))).toEqual({ current_password: "old-password", new_password: "new-password" });
  });
});
