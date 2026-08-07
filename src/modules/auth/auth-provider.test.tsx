import React, { act, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { passwordLoginMock, registerMock, smsLoginMock } = vi.hoisted(() => ({
  passwordLoginMock: vi.fn(),
  registerMock: vi.fn(),
  smsLoginMock: vi.fn(),
}));

vi.mock("@/config/capabilities", () => ({ DATA_MODE: "live" }));
vi.mock("./api", () => ({
  passwordLogin: passwordLoginMock,
  register: registerMock,
  smsLogin: smsLoginMock,
}));

import { AuthProvider, useAuth } from "./auth-provider";

Object.assign(globalThis, { React });
(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

type AuthContext = ReturnType<typeof useAuth>;

function Capture({ onReady }: { onReady: (context: AuthContext) => void }) {
  const context = useAuth();
  useEffect(() => onReady(context), [context, onReady]);
  return null;
}

describe("auth provider mobile session compatibility", () => {
  beforeEach(() => {
    window.localStorage.clear();
    passwordLoginMock.mockReset();
    registerMock.mockReset();
    smsLoginMock.mockReset();
  });

  it("persists an SMS result through the existing linkyun_auth session", async () => {
    smsLoginMock.mockResolvedValue({ api_key: "mock_api_key", creator: { id: 1, username: "mock_creator" } });
    let auth: AuthContext | undefined;
    const container = document.createElement("div");
    const root = createRoot(container);

    await act(async () => root.render(<QueryClientProvider client={new QueryClient()}><AuthProvider><Capture onReady={(context) => { auth = context; }} /></AuthProvider></QueryClientProvider>));
    await act(async () => auth?.signInSms({ phone: "13800000000", smsCode: "000000" }));

    expect(smsLoginMock).toHaveBeenCalledWith({ phone: "13800000000", smsCode: "000000" });
    expect(window.localStorage.getItem("linkyun_auth")).toBe(JSON.stringify({ apiKey: "mock_api_key", username: "mock_creator" }));
    await act(async () => root.unmount());
  });
});
