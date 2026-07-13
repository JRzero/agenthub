import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiRequest } from "@/shared/api/http-client";
import { login, register } from "./api";

vi.mock("@/shared/api/http-client", () => ({
  apiRequest: vi.fn(),
}));

describe("creator authentication API", () => {
  beforeEach(() => vi.mocked(apiRequest).mockReset());

  it("sends the existing login contract", async () => {
    vi.mocked(apiRequest).mockResolvedValue({} as never);
    await login("creator", "password");
    expect(apiRequest).toHaveBeenCalledWith("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username: "creator", password: "password" }),
    });
  });

  it("sends invitation-code registration fields", async () => {
    vi.mocked(apiRequest).mockResolvedValue({} as never);
    await register({
      username: " creator ",
      email: " creator@example.com ",
      password: "password",
      invitationCode: " invite-code ",
    });
    expect(apiRequest).toHaveBeenCalledWith("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        username: "creator",
        email: "creator@example.com",
        password: "password",
        invitation_code: "invite-code",
      }),
    });
  });
});
