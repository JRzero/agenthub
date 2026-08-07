import { ApiError, apiRequest } from "@/shared/api/http-client";

export const DEFAULT_COUNTRY_CODE = "+86";

export interface CreatorProfile {
  id: number;
  uuid?: string;
  username?: string;
  email?: string;
  status?: string;
  metadata?: {
    full_name?: string;
    avatar?: string;
  };
}

export interface AuthResult {
  api_key: string;
  creator: CreatorProfile;
}

export type SmsPurpose = "login" | "register";

export interface SendSmsCodeInput {
  phone: string;
  purpose: SmsPurpose;
}

export interface SmsLoginInput {
  phone: string;
  smsCode: string;
}

export interface PasswordLoginInput {
  account: string;
  password: string;
}

export interface RegistrationInput {
  phone: string;
  smsCode: string;
  invitationCode: string;
  invitationSource?: string;
  landingPath: string;
}

interface PhonePayload {
  phone: string;
  country_code?: string;
}

function phonePayload(phone: string): PhonePayload {
  const normalized = phone.trim();
  return {
    phone: normalized,
    ...(normalized.startsWith("+") ? {} : { country_code: DEFAULT_COUNTRY_CODE }),
  };
}

export function createPasswordLoginRequest(input: PasswordLoginInput) {
  const account = input.account.trim();
  if (/^\+?\d+$/.test(account)) {
    return { ...phonePayload(account), password: input.password };
  }
  return { username_or_email: account, password: input.password };
}

export function sendSmsCode(input: SendSmsCodeInput): Promise<void> {
  return apiRequest<void>("/auth/sms/send-code", {
    method: "POST",
    body: JSON.stringify({ ...phonePayload(input.phone), purpose: input.purpose }),
  });
}

export function smsLogin(input: SmsLoginInput): Promise<AuthResult> {
  return apiRequest<AuthResult>("/auth/sms/login", {
    method: "POST",
    body: JSON.stringify({ ...phonePayload(input.phone), sms_code: input.smsCode.trim() }),
  });
}

export function passwordLogin(input: PasswordLoginInput): Promise<AuthResult> {
  return apiRequest<AuthResult>("/auth/login", {
    method: "POST",
    body: JSON.stringify(createPasswordLoginRequest(input)),
  });
}

export function register(input: RegistrationInput): Promise<AuthResult> {
  return apiRequest<AuthResult>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      ...phonePayload(input.phone),
      sms_code: input.smsCode.trim(),
      invitation_code: input.invitationCode.trim(),
      ...(input.invitationSource ? { invitation_source: input.invitationSource } : {}),
      landing_path: input.landingPath,
    }),
  });
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  INVALID_SMS_CODE: "验证码错误，请重新输入",
  SMS_CODE_EXPIRED: "验证码已过期，请重新获取",
  SMS_SEND_COOLDOWN: "请求过于频繁，请稍后重试",
  SMS_VERIFY_TOO_MANY_ATTEMPTS: "验证码尝试次数过多，请重新获取",
  SMS_NOT_CONFIGURED: "短信服务暂不可用，请使用密码登录或稍后重试",
  SMS_TEMPLATE_MISSING: "短信服务暂不可用，请稍后重试",
  SMS_PROVIDER_ERROR: "短信发送失败，请稍后重试",
  ACCOUNT_NOT_REGISTERED: "该手机号未注册，请先注册",
  PHONE_ALREADY_EXISTS: "该手机号已注册，请直接登录",
  INVITATION_CODE_REQUIRED: "请输入邀请码",
  INVITATION_CODE_INVALID: "邀请码无效，请检查后重试",
  INVITATION_CODE_EXHAUSTED: "邀请码已失效，请联系邀请人",
  INVALID_CREDENTIALS: "账号或密码错误",
  ACCOUNT_INACTIVE: "该账号已停用，请联系客服",
};

export function authErrorMessage(reason: unknown): string {
  if (reason instanceof ApiError) {
    if (reason.code && AUTH_ERROR_MESSAGES[reason.code]) return AUTH_ERROR_MESSAGES[reason.code];
    return reason.message;
  }
  return "网络异常，请检查连接后重试";
}
