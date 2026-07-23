"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  At,
  Eye,
  EyeSlash,
  Key,
  LockKey,
  HardDrives as Server,
  User,
} from "@phosphor-icons/react";
import { getApiBaseUrl } from "@/shared/api/http-client";
import { setApiBaseUrlOverride } from "@/shared/api/api-base";
import { useAuth } from "./auth-provider";
import { resolveAuthRedirect } from "./redirect";

type AuthMode = "login" | "register";

const fieldClass =
  "h-11 w-full rounded-lg border border-border bg-surface pl-10 pr-11 text-sm text-text-strong outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/15";

export function AuthScreen({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session, ready, demo, signIn, signUp } = useAuth();
  const registerMode = mode === "register";
  const next = resolveAuthRedirect(searchParams.get("next"));
  const alternateHref = useMemo(() => {
    const base = registerMode ? "/login" : "/register";
    return next === "/assets" ? base : `${base}?next=${encodeURIComponent(next)}`;
  }, [next, registerMode]);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invitationCode, setInvitationCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [apiServiceUrl, setApiServiceUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setApiServiceUrl(getApiBaseUrl()), []);

  useEffect(() => {
    if (ready && session) router.replace(next);
  }, [next, ready, router, session]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      setApiBaseUrlOverride(apiServiceUrl);
      if (registerMode) {
        if (username.trim().length < 3) throw new Error("用户名至少需要 3 个字符");
        if (password.length < 8) throw new Error("密码至少需要 8 位");
        if (!invitationCode.trim()) throw new Error("请输入邀请码");
        await signUp({ username, email, password, invitationCode });
      } else {
        await signIn(username.trim(), password);
      }
      router.replace(next);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "操作失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  async function enterDemo() {
    await signIn("demo", "demo");
    router.replace(next);
  }

  return (
    <main className="grid min-h-screen bg-[#0f1224] lg:grid-cols-[minmax(0,1.08fr)_minmax(460px,0.92fr)]">
      <section className="relative hidden min-h-screen overflow-hidden px-10 py-10 text-white lg:flex lg:flex-col">
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <Link href="/" className="relative inline-flex items-center gap-3 self-start" aria-label="AgentHub 首页">
          <Image src="/images/agenthub-logo.png" alt="" width={38} height={38} priority />
          <span className="text-2xl font-bold tracking-tight">AgentHub</span>
        </Link>

        <div className="relative flex flex-1 items-center justify-center">
          <div className="w-full max-w-[860px] rounded-[32px] border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-black/20 backdrop-blur">
            <Image
              src="/images/login-agent-asset-hero.png"
              alt="AgentHub Agent 资产平台概念图"
              width={1536}
              height={1024}
              priority
              className="h-auto w-full rounded-[24px] object-cover"
            />
          </div>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center bg-surface px-6 py-10 sm:px-10">
        <div className="w-full max-w-[480px] rounded-[28px] border border-border bg-white p-8 shadow-2xl shadow-slate-200/70 dark:bg-surface dark:shadow-black/30 sm:p-10">
          <Link href="/" className="mb-8 inline-flex items-center gap-3 lg:hidden" aria-label="AgentHub 首页">
            <Image src="/images/agenthub-logo.png" alt="" width={36} height={36} priority />
            <span className="text-2xl font-bold tracking-tight">AgentHub</span>
          </Link>

          <p className="text-xs font-bold tracking-[0.16em] text-primary">WORKSPACE LOGIN</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-text-strong">
            {registerMode ? "创建 AgentHub 账号" : "登录 AgentHub"}
          </h1>
          <p className="mt-3 text-sm leading-6 text-text-muted">
            {registerMode
              ? "使用邀请码加入工作空间，开始构建和发行 Agent 资产。"
              : "进入工作空间，继续管理 Agent 资产、测试评估和多端发行。"}
          </p>

          {demo ? (
            <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-400/20 dark:bg-amber-400/10">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">当前运行在演示数据模式</p>
              <p className="mt-1 text-xs leading-5 text-amber-700 dark:text-amber-200/80">不会向登录或注册接口发送请求。</p>
              <button type="button" className="button-primary mt-4 w-full" onClick={() => void enterDemo()}>
                进入演示工作区 <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <AuthField label={registerMode ? "用户名（3–100 个字符）" : "用户名或邮箱"} icon={<User size={19} />}>
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className={fieldClass}
                  autoComplete="username"
                  placeholder={registerMode ? "设置用户名" : "输入用户名或邮箱"}
                  required
                  minLength={registerMode ? 3 : 1}
                  maxLength={100}
                />
              </AuthField>

              {registerMode && (
                <AuthField label="邮箱" icon={<At size={19} />}>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className={fieldClass}
                    autoComplete="email"
                    placeholder="creator@example.com"
                    required
                  />
                </AuthField>
              )}

              <AuthField label={registerMode ? "密码（至少 8 位）" : "密码"} icon={<LockKey size={19} />}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={fieldClass}
                  autoComplete={registerMode ? "new-password" : "current-password"}
                  placeholder="输入密码"
                  required
                  minLength={registerMode ? 8 : 1}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-text-muted hover:text-text-strong"
                  aria-label={showPassword ? "隐藏密码" : "显示密码"}
                >
                  {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </AuthField>

              {registerMode && (
                <AuthField label="邀请码" icon={<Key size={19} />}>
                  <input
                    value={invitationCode}
                    onChange={(event) => setInvitationCode(event.target.value)}
                    className={fieldClass}
                    autoComplete="off"
                    placeholder="输入邀请码"
                    required
                  />
                </AuthField>
              )}

              <details className="rounded-lg border border-border bg-subtle/70 px-4 py-3">
                <summary className="cursor-pointer text-sm font-medium text-text-strong">API Service 设置</summary>
                <label className="mt-3 block">
                  <span className="mb-2 block text-xs text-text-muted">后端服务地址</span>
                  <span className="relative block">
                    <Server className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input
                      value={apiServiceUrl}
                      onChange={(event) => setApiServiceUrl(event.target.value)}
                      className={fieldClass}
                      placeholder="http://localhost:8080"
                      required
                      inputMode="url"
                    />
                  </span>
                </label>
                <p className="mt-2 text-xs leading-5 text-text-muted">
                  地址保存在当前浏览器，并兼容旧 Creator 的运行时覆盖键。
                </p>
              </details>

              {error && (
                <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-400/10 dark:text-red-200">
                  {error}
                </p>
              )}

              <button type="submit" className="button-primary w-full" disabled={loading}>
                {loading ? "正在处理…" : registerMode ? "注册并进入 AgentHub" : "登录"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          )}

          {!demo && (
            <p className="mt-6 text-center text-sm text-text-muted">
              {registerMode ? "已有账号？" : "还没有账号？"}{" "}
              <Link href={alternateHref} className="font-semibold text-primary hover:underline">
                {registerMode ? "返回登录" : "使用邀请码注册"}
              </Link>
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

function AuthField({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-text-strong">{label}</span>
      <span className="relative block">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">{icon}</span>
        {children}
      </span>
    </label>
  );
}
