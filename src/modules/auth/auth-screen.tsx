"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  At,
  CaretDown,
  CaretRight,
  CircleNotch,
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
import styles from "./auth-screen.module.css";

type AuthMode = "login" | "register";

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
  const [apiSettingsOpen, setApiSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const usernameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const invitationId = useId();
  const apiServiceId = useId();
  const apiSettingsId = useId();

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
    <main className={styles.authPage}>
      <section className={styles.storyPanel} aria-label="AgentHub 品牌介绍">
        <BrandLink className={styles.brandDesktop} />

        <div className={styles.storyCopy}>
          <p className={styles.eyebrow}>AGENT-FIRST WORKSPACE</p>
          <span className={styles.storyRule} aria-hidden="true" />
          <p className={styles.storyTitle}>为创作而生，</p>
          <p className={styles.storyTitle}>让智能体持续进化。</p>
          <p className={styles.storyDescription}>
            AgentHub 是面向创作者与团队的智能体工作空间，连接想法、工具与交付，陪伴每一次从 0 到 1 的突破。
          </p>
        </div>

        <span className={styles.editionMark} aria-hidden="true">N</span>
      </section>

      <section className={styles.portraitPanel} aria-label="AgentHub 创作主视觉">
        <Image
          src="/images/login-agent-portrait.png"
          alt="创作者与智能体协作的原创人物主视觉"
          fill
          sizes="(min-width: 1100px) 36vw, 0px"
          priority
          className={styles.portraitImage}
        />
        <div className={styles.portraitCopy} aria-hidden="true">
          <span className={styles.portraitRule} />
          <div>
            <span className={styles.makeAgents}>MAKE AGENTS</span>
            <span className={styles.workLine}>WORK</span>
            <span className={styles.forYouLine}>FOR YOU</span>
          </div>
        </div>
      </section>

      <section className={styles.formPanel}>
        <div className={`${styles.formWrap} ${registerMode ? styles.registerFormWrap : ""}`}>
          <BrandLink className={styles.brandMobile} />
          <p className={styles.formEyebrow}>{registerMode ? "WORKSPACE ACCESS" : "WORKSPACE LOGIN"}</p>
          <h1 className={styles.formTitle}>{registerMode ? "创建 AgentHub 账号" : "登录 AgentHub"}</h1>
          <p className={styles.formDescription}>
            {registerMode
              ? "使用邀请码加入工作空间，开始构建和发行 Agent 资产。"
              : "进入工作空间，继续管理 Agent 资产、测试评估和多端发行。"}
          </p>

          {demo ? (
            <div className={styles.demoPanel}>
              <p className={styles.demoTitle}>当前运行在演示数据模式</p>
              <p className={styles.demoDescription}>不会向登录或注册接口发送请求。</p>
              <button type="button" className={styles.submitButton} onClick={() => void enterDemo()}>
                进入演示工作区 <ArrowRight size={19} weight="bold" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.authForm} aria-busy={loading}>
              <AuthField label={registerMode ? "用户名（3–100 个字符）" : "用户名或邮箱"} htmlFor={usernameId} icon={<User size={19} />}>
                <input
                  id={usernameId}
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className={styles.fieldInput}
                  autoComplete="username"
                  placeholder={registerMode ? "设置用户名" : "输入用户名或邮箱"}
                  required
                  minLength={registerMode ? 3 : 1}
                  maxLength={100}
                />
              </AuthField>

              {registerMode && (
                <AuthField label="邮箱" htmlFor={emailId} icon={<At size={19} />}>
                  <input
                    id={emailId}
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className={styles.fieldInput}
                    autoComplete="email"
                    placeholder="creator@example.com"
                    required
                  />
                </AuthField>
              )}

              <AuthField label={registerMode ? "密码（至少 8 位）" : "密码"} htmlFor={passwordId} icon={<LockKey size={19} />}>
                <input
                  id={passwordId}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={styles.fieldInput}
                  autoComplete={registerMode ? "new-password" : "current-password"}
                  placeholder="输入密码"
                  required
                  minLength={registerMode ? 8 : 1}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className={styles.passwordToggle}
                  aria-label={showPassword ? "隐藏密码" : "显示密码"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeSlash size={19} /> : <Eye size={19} />}
                </button>
              </AuthField>

              {registerMode && (
                <AuthField label="邀请码" htmlFor={invitationId} icon={<Key size={19} />}>
                  <input
                    id={invitationId}
                    value={invitationCode}
                    onChange={(event) => setInvitationCode(event.target.value)}
                    className={styles.fieldInput}
                    autoComplete="off"
                    placeholder="输入邀请码"
                    required
                  />
                </AuthField>
              )}

              <div className={styles.apiSettings}>
                <button
                  type="button"
                  className={styles.apiSettingsTrigger}
                  aria-expanded={apiSettingsOpen}
                  aria-controls={apiSettingsId}
                  onClick={() => setApiSettingsOpen((value) => !value)}
                >
                  <span className={styles.apiSettingsLabel}>
                    {apiSettingsOpen ? <CaretDown size={17} weight="fill" /> : <CaretRight size={17} weight="fill" />}
                    API Service 设置
                  </span>
                  <CaretDown className={apiSettingsOpen ? styles.caretOpen : undefined} size={18} />
                </button>
                {apiSettingsOpen && (
                  <div id={apiSettingsId} className={styles.apiSettingsBody}>
                    <label htmlFor={apiServiceId} className={styles.apiLabel}>后端服务地址</label>
                    <span className={styles.inputFrame}>
                      <Server className={styles.fieldIcon} size={18} />
                      <input
                        id={apiServiceId}
                        value={apiServiceUrl}
                        onChange={(event) => setApiServiceUrl(event.target.value)}
                        className={styles.fieldInput}
                        placeholder="http://localhost:8080"
                        required
                        inputMode="url"
                      />
                    </span>
                    <p className={styles.apiHelp}>地址保存在当前浏览器，并兼容旧 Creator 的运行时覆盖键。</p>
                  </div>
                )}
              </div>

              {error && <p role="alert" className={styles.errorMessage}>{error}</p>}

              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? (
                  <><CircleNotch className={styles.spinner} size={19} /> 正在处理…</>
                ) : (
                  <>{registerMode ? "注册并进入 AgentHub" : "登录"} <ArrowRight size={20} weight="bold" /></>
                )}
              </button>
            </form>
          )}

          {!demo && (
            <p className={styles.alternateLink}>
              {registerMode ? "已有账号？" : "还没有账号？"}{" "}
              <Link href={alternateHref}>{registerMode ? "返回登录" : "使用邀请码注册"}</Link>
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

function BrandLink({ className }: { className: string }) {
  return (
    <Link href="/" className={className} aria-label="AgentHub 首页">
      <Image src="/images/agenthub-logo.png" alt="" width={31} height={31} priority className={styles.brandMark} />
      <span>Agent<span>Hub</span></span>
    </Link>
  );
}

function AuthField({
  label,
  htmlFor,
  icon,
  children,
}: {
  label: string;
  htmlFor: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.fieldGroup}>
      <label htmlFor={htmlFor} className={styles.fieldLabel}>{label}</label>
      <span className={styles.inputFrame}>
        <span className={styles.fieldIcon} aria-hidden="true">{icon}</span>
        {children}
      </span>
    </div>
  );
}
