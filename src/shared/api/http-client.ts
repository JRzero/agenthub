const API_OVERRIDE_KEY = "linkyun-api-url-override";

interface ApiEnvelope<T> {
  success?: boolean;
  data?: T | { code?: string; error?: string; message?: string; [key: string]: unknown };
  error?: { code?: string; message?: string };
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function normalizeBaseUrl(value: string): string {
  return value.trim().replace(/\/+$/, "");
}

export function getApiBaseUrl(): string {
  const fallback = normalizeBaseUrl(
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  );
  if (typeof window === "undefined") return fallback;
  const override =
    typeof window.localStorage?.getItem === "function"
      ? window.localStorage.getItem(API_OVERRIDE_KEY)
      : null;
  return override?.trim() ? normalizeBaseUrl(override) : fallback;
}

export interface ApiRequestOptions extends Omit<RequestInit, "headers"> {
  apiKey?: string;
  workspaceCode?: string;
  headers?: Record<string, string>;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { apiKey, workspaceCode, headers: extraHeaders, ...init } = options;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...extraHeaders,
  };

  if (apiKey) headers["X-API-Key"] = apiKey;
  if (workspaceCode && workspaceCode !== "default") {
    headers["X-Workspace-Code"] = workspaceCode;
  }

  const response = await fetch(`${getApiBaseUrl()}/api/v1${path}`, {
    ...init,
    headers,
  });
  const raw = await response.text();
  let envelope: ApiEnvelope<T> = {};

  if (raw) {
    try {
      envelope = JSON.parse(raw) as ApiEnvelope<T>;
    } catch {
      throw new ApiError(
        response.ok ? "服务返回了无法解析的数据" : `HTTP ${response.status}`,
        response.status,
      );
    }
  }

  if (!response.ok || envelope.success === false) {
    if (response.status === 401 && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("agenthub:unauthorized"));
    }
    const businessError =
      envelope.data && typeof envelope.data === "object"
        ? (envelope.data as Record<string, unknown>)
        : undefined;
    const businessMessage =
      typeof businessError?.error === "string"
        ? businessError.error
        : typeof businessError?.message === "string"
          ? businessError.message
          : undefined;
    const businessCode =
      typeof businessError?.code === "string" ? businessError.code : undefined;
    throw new ApiError(
      envelope.error?.message || businessMessage || `请求失败（${response.status}）`,
      response.status,
      envelope.error?.code || businessCode,
      businessError,
    );
  }

  return envelope.data as T;
}
