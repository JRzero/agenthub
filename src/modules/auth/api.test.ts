import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiRequest } from "@/shared/api/http-client";
import {
  authErrorMessage,
  createPasswordLoginRequest,
  passwordLogin,
  register,
  sendSmsCode,
  smsLogin,
} from "./api";

vi.mock("@/shared/api/http-client", () => ({
  ApiError: class ApiError extends Error {
    constructor(message: string, public readonly status: number, public readonly code?: string) {
      super(message);
    }
  },
  apiRequest: vi.fn(),
}));

describe("AgentHub mobile authentication API", () => {
  beforeEach(() => vi.mocked(apiRequest).mockReset());

  it("sends SMS code requests with the selected purpose and default country code", async () => {
    vi.mocked(apiRequest).mockResolvedValue(undefined as never);
    await sendSmsCode({ phone: "13800000000", purpose: "login" });
    expect(apiRequest).toHaveBeenCalledWith("/auth/sms/send-code", {
      method: "POST",
      body: JSON.stringify({ phone: "13800000000", country_code: "+86", purpose: "login" }),
    });
  });

  it("omits country code for an explicit international phone and sends the SMS login contract", async () => {
    vi.mocked(apiRequest).mockResolvedValue({} as never);
    await smsLogin({ phone: "+8613800000000", smsCode: " 000000 " });
    expect(apiRequest).toHaveBeenCalledWith("/auth/sms/login", {
      method: "POST",
      body: JSON.stringify({ phone: "+8613800000000", sms_code: "000000" }),
    });
  });

  it("sends SMS registration with attribution and never includes a password", async () => {
    vi.mocked(apiRequest).mockResolvedValue({} as never);
    await register({
      phone: "13800000000",
      smsCode: "000000",
      invitationCode: " INVITE ",
      invitationSource: "share",
      landingPath: "/register?invitation_code=INVITE&invitation_source=share",
    });
    const options = vi.mocked(apiRequest).mock.calls[0]?.[1] as { body: string };
    expect(JSON.parse(options.body)).toEqual({
      phone: "13800000000",
      country_code: "+86",
      sms_code: "000000",
      invitation_code: "INVITE",
      invitation_source: "share",
      landing_path: "/register?invitation_code=INVITE&invitation_source=share",
    });
    expect(options.body).not.toContain("password");
  });

  it("classifies password accounts and preserves the password byte-for-byte", async () => {
    expect(createPasswordLoginRequest({ account: " 13800000000 ", password: " pass word " })).toEqual({
      phone: "13800000000",
      country_code: "+86",
      password: " pass word ",
    });
    vi.mocked(apiRequest).mockResolvedValue({} as never);
    await passwordLogin({ account: "creator@example.test", password: " pass word " });
    expect(apiRequest).toHaveBeenCalledWith("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username_or_email: "creator@example.test", password: " pass word " }),
    });
  });

  it("maps stable authentication codes without exposing provider details", () => {
    expect(authErrorMessage(new ApiError("provider detail", 503, "SMS_PROVIDER_ERROR"))).toBe("短信发送失败，请稍后重试");
    expect(authErrorMessage(new TypeError("offline"))).toBe("网络异常，请检查连接后重试");
  });
});
