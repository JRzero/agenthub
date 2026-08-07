"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DATA_MODE } from "@/config/capabilities";
import {
  passwordLogin,
  register,
  smsLogin,
  type AuthResult,
  type PasswordLoginInput,
  type RegistrationInput,
  type SmsLoginInput,
} from "./api";
import { clearAccountScopedCache } from "./account-cache";
import {
  AUTH_STORAGE_KEY,
  clearAuthSession,
  readAuthSession,
  writeAuthSession,
  type AuthSession,
} from "./storage";

interface AuthContextValue {
  session: AuthSession | null;
  ready: boolean;
  demo: boolean;
  signInSms: (input: SmsLoginInput) => Promise<void>;
  signInWithPassword: (input: PasswordLoginInput) => Promise<void>;
  signUp: (input: RegistrationInput) => Promise<void>;
  signOut: () => void;
  updateSessionUsername: (username: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const DEMO_SESSION: AuthSession = { apiKey: "demo-only", username: "李然" };

function toSession(result: AuthResult): AuthSession {
  return {
    apiKey: result.api_key,
    username: result.creator.username || result.creator.email || "AgentHub 用户",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [ready, setReady] = useState(false);
  const demo = DATA_MODE === "demo";

  useEffect(() => {
    setSession(demo ? DEMO_SESSION : readAuthSession());
    setReady(true);
  }, [demo]);

  const persistResult = useCallback((result: AuthResult) => {
    const next = toSession(result);
    clearAccountScopedCache(queryClient);
    writeAuthSession(next);
    setSession(next);
  }, [queryClient]);

  const signOut = useCallback(() => {
    clearAccountScopedCache(queryClient);
    if (!demo) clearAuthSession();
    setSession(demo ? DEMO_SESSION : null);
  }, [demo, queryClient]);

  const updateSessionUsername = useCallback((username: string) => {
    setSession((current) => {
      if (!current) return current;
      const next = { ...current, username };
      if (!demo) writeAuthSession(next);
      return next;
    });
  }, [demo]);

  useEffect(() => {
    const handleUnauthorized = () => signOut();
    window.addEventListener("agenthub:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("agenthub:unauthorized", handleUnauthorized);
  }, [signOut]);

  useEffect(() => {
    if (demo) return;
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== AUTH_STORAGE_KEY) return;
      clearAccountScopedCache(queryClient);
      setSession(readAuthSession());
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [demo, queryClient]);

  const persistOrDemo = useCallback(async (request: () => Promise<AuthResult>) => {
    if (demo) {
      setSession(DEMO_SESSION);
      return;
    }
    persistResult(await request());
  }, [demo, persistResult]);

  const signInSms = useCallback((input: SmsLoginInput) => persistOrDemo(() => smsLogin(input)), [persistOrDemo]);
  const signInWithPassword = useCallback(
    (input: PasswordLoginInput) => persistOrDemo(() => passwordLogin(input)),
    [persistOrDemo],
  );
  const signUp = useCallback((input: RegistrationInput) => persistOrDemo(() => register(input)), [persistOrDemo]);

  const value = useMemo(
    () => ({ session, ready, demo, signInSms, signInWithPassword, signUp, signOut, updateSessionUsername }),
    [demo, ready, session, signInSms, signInWithPassword, signOut, signUp, updateSessionUsername],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
