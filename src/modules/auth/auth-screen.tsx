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
    <main className="grid min-h-screen bg-surface lg:grid-cols-[minmax(430px,0.9fr)_1.1fr]">
      <section className="flex items-center justify-center px-6 py-10 sm:px-10">
        <div className="w-full max-w-[430px]">
          <Link href="/" className="mb-9 inline-flex items-center gap-3" aria-label="AgentHub 首页">
            <Image src="/images/agenthub-logo.png" alt="" width={40} height={40} priority />
            <span className="text-2xl font-bold tracking-tight">AgentHub</span>
          </Link>

          <p className="text-xs font-bold tracking-[0.16em] text-primary">CREATOR WORKSPACE</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-text-strong">
            {registerMode ? "创建 Creator 账号" : "欢迎回到 AgentHub"}
          </h1>
          <p className="mt-3 text-sm leading-6 text-text-muted">
            {registerMode
              ? "使用邀请码注册，开始构建可跨 Client 发行的 Agent 资产。"
              : "登录后继续管理 Agent 的构建、测试、版本与发行。"}
          </p>

          {demo ? (
            <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-900">当前运行在演示数据模式</p>
              <p className="mt-1 text-xs leading-5 text-amber-700">不会向登录或注册接口发送请求。</p>
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
                  placeholder={registerMode ? "设置 Creator 用户名" : "输入用户名或邮箱"}
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
                <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
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

      <section className="relative hidden overflow-hidden border-l border-border bg-[#111326] p-12 text-white lg:flex lg:items-end">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute bottom-20 left-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative max-w-[620px] rounded-2xl border border-white/10 bg-white/[0.06] p-8 shadow-2xl backdrop-blur">
          <p className="text-sm font-semibold text-indigo-300">Build once, adapt everywhere.</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight">Agent 不再只是某个 App 里的功能。</h2>
          <p className="mt-4 max-w-[540px] leading-7 text-slate-300">
            在统一资产源头管理身份、人设、知识、技能、记忆策略、版本和 Client 适配，再以受控方式完成测试和多端发行。
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3 text-xs text-slate-300">
            {[
              ["01", "统一构建"],
              ["02", "持续评估"],
              ["03", "多端发行"],
            ].map(([index, label]) => (
              <div key={index} className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3">
                <span className="text-indigo-300">{index}</span>
                <strong className="mt-1 block text-sm text-white">{label}</strong>
              </div>
            ))}
          </div>
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


