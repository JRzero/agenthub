"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  CaretDown,
  CaretRight,
  CircleNotch,
  HardDrives as Server,
  Key,
  LockKey,
  Phone,
  User,
} from "@phosphor-icons/react";
import { getApiBaseUrl } from "@/shared/api/http-client";
import { setApiBaseUrlOverride } from "@/shared/api/api-base";
import { authErrorMessage, sendSmsCode, type SmsPurpose } from "./api";
import { useAuth } from "./auth-provider";
import { DEFAULT_AUTH_REDIRECT, resolveAuthRedirect } from "./redirect";
import styles from "./auth-screen.module.css";

type AuthMode = "login" | "register";
type LoginMethod = "sms" | "password";

export function AuthScreen({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { session, ready, demo, signInSms, signInWithPassword, signUp } = useAuth();
  const registerMode = mode === "register";
  const next = resolveAuthRedirect(searchParams.get("next"));
  const invitationSource = searchParams.get("invitation_source") || undefined;
  const searchString = searchParams.toString();
  const landingPath = useMemo(
    () => `${pathname}${searchString ? `?${searchString}` : ""}`,
    [pathname, searchString],
  );
  const alternateHref = useMemo(() => {
    const base = registerMode ? "/login" : "/register";
    return next === DEFAULT_AUTH_REDIRECT ? base : `${base}?next=${encodeURIComponent(next)}`;
  }, [next, registerMode]);

  const [loginMethod, setLoginMethod] = useState<LoginMethod>("sms");
  const [phone, setPhone] = useState("");
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [invitationCode, setInvitationCode] = useState(() => searchParams.get("invitation_code")?.trim() || "");
  const [apiServiceUrl, setApiServiceUrl] = useState("");
  const [apiSettingsOpen, setApiSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [smsSending, setSmsSending] = useState(false);
  const [smsCooldown, setSmsCooldown] = useState(0);
  const [error, setError] = useState("");
  const [smsError, setSmsError] = useState("");
  const submitLock = useRef(false);
  const smsLock = useRef(false);

  const phoneId = useId();
  const accountId = useId();
  const passwordId = useId();
  const smsId = useId();
  const invitationId = useId();
  const apiServiceId = useId();
  const apiSettingsId = useId();
  const smsTabId = useId();
  const passwordTabId = useId();
  const loginPanelId = useId();

  useEffect(() => setApiServiceUrl(getApiBaseUrl()), []);

  useEffect(() => {
    if (ready && session) router.replace(next);
  }, [next, ready, router, session]);

  useEffect(() => {
    setSmsCode("");
    setPassword("");
    setSmsError("");
    setError("");
    setSmsCooldown(0);
  }, [mode]);

  useEffect(() => {
    if (smsCooldown <= 0) return undefined;
    const timer = window.setTimeout(() => setSmsCooldown((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [smsCooldown]);

  function clearTransientState() {
    setSmsCode("");
    setPassword("");
    setSmsError("");
    setError("");
    setSmsCooldown(0);
  }

  function selectLoginMethod(nextMethod: LoginMethod) {
    if (nextMethod === loginMethod) return;
    setLoginMethod(nextMethod);
    clearTransientState();
  }

  async function handleSendSmsCode() {
    if (smsLock.current || !phone.trim() || smsCooldown > 0) return;
    smsLock.current = true;
    setSmsSending(true);
    setSmsError("");
    try {
      const purpose: SmsPurpose = registerMode ? "register" : "login";
      await sendSmsCode({ phone, purpose });
      setSmsCooldown(60);
    } catch (reason) {
      setSmsError(authErrorMessage(reason));
    } finally {
      smsLock.current = false;
      setSmsSending(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitLock.current) return;
    submitLock.current = true;
    setError("");
    setLoading(true);

    try {
      setApiBaseUrlOverride(apiServiceUrl);
      if (registerMode) {
        await signUp({ phone, smsCode, invitationCode, invitationSource, landingPath });
      } else if (loginMethod === "sms") {
        await signInSms({ phone, smsCode });
      } else {
        await signInWithPassword({ account, password });
      }
      router.replace(next);
    } catch (reason) {
      setError(authErrorMessage(reason));
    } finally {
      submitLock.current = false;
      setLoading(false);
    }
  }

  async function enterDemo() {
    if (submitLock.current) return;
    submitLock.current = true;
    try {
      await signInSms({ phone: "demo", smsCode: "demo" });
      router.replace(next);
    } finally {
      submitLock.current = false;
    }
  }

  const smsFlow = registerMode || loginMethod === "sms";
  const submitDisabled = loading || (smsFlow
    ? !phone.trim() || !smsCode.trim() || (registerMode && !invitationCode.trim())
    : !account.trim() || password.length === 0);

  return (
    <main className={styles.authPage}>
      <section className={styles.storyPanel} aria-label="AgentHub 品牌介绍">
        <BrandLink className={styles.brandDesktop} />
        <div className={styles.storyCopy}>
          <p className={styles.eyebrow}>AGENT-FIRST WORKSPACE</p>
          <span className={styles.storyRule} aria-hidden="true" />
          <p className={styles.storyTitle}>为创作而生，</p>
          <p className={styles.storyTitle}>让智能体持续进化。</p>
          <p className={styles.storyDescription}>AgentHub 是面向创作者与团队的智能体工作空间，连接想法、工具与交付，陪伴每一次从 0 到 1 的突破。</p>
        </div>
        <span className={styles.editionMark} aria-hidden="true">N</span>
      </section>

      <section className={styles.portraitPanel} aria-label="AgentHub 创作主视觉">
        <Image src="/images/login-agent-portrait.png" alt="创作者与智能体协作的原创人物主视觉" fill sizes="(min-width: 1100px) 36vw, 0px" priority className={styles.portraitImage} />
        <div className={styles.portraitCopy} aria-hidden="true"><span className={styles.portraitRule} /><div><span className={styles.makeAgents}>MAKE AGENTS</span><span className={styles.workLine}>WORK</span><span className={styles.forYouLine}>FOR YOU</span></div></div>
      </section>

      <section className={styles.formPanel}>
        <div className={`${styles.formWrap} ${registerMode ? styles.registerFormWrap : ""}`}>
          <BrandLink className={styles.brandMobile} />
          <p className={styles.formEyebrow}>{registerMode ? "WORKSPACE ACCESS" : "WORKSPACE LOGIN"}</p>
          <h1 className={styles.formTitle}>{registerMode ? "创建 AgentHub 账号" : "登录 AgentHub"}</h1>

          {demo ? (
            <div className={styles.demoPanel}><p className={styles.demoTitle}>当前运行在演示数据模式</p><p className={styles.demoDescription}>不会向登录或注册接口发送请求。</p><button type="button" className={styles.submitButton} onClick={() => void enterDemo()}>进入演示工作区 <ArrowRight size={19} weight="bold" /></button></div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.authForm} aria-busy={loading}>
              {!registerMode && (
                <div className={styles.loginTabs} role="tablist" aria-label="登录方式">
                  <button id={smsTabId} type="button" role="tab" aria-selected={loginMethod === "sms"} aria-controls={loginPanelId} className={loginMethod === "sms" ? styles.loginTabActive : styles.loginTab} onClick={() => selectLoginMethod("sms")}>验证码登录</button>
                  <button id={passwordTabId} type="button" role="tab" aria-selected={loginMethod === "password"} aria-controls={loginPanelId} className={loginMethod === "password" ? styles.loginTabActive : styles.loginTab} onClick={() => selectLoginMethod("password")}>密码登录</button>
                </div>
              )}

              <div id={loginPanelId} role={!registerMode ? "tabpanel" : undefined} aria-labelledby={!registerMode ? (loginMethod === "sms" ? smsTabId : passwordTabId) : undefined}>
                {smsFlow ? (
                  <PhoneField id={phoneId} value={phone} onChange={setPhone} />
                ) : (
                  <AuthField label="手机号 / 用户名 / 邮箱" htmlFor={accountId} icon={<User size={19} />}><input id={accountId} value={account} onChange={(event) => setAccount(event.target.value)} className={styles.fieldInput} autoComplete="username" placeholder="输入手机号、用户名或邮箱" required /></AuthField>
                )}

                {smsFlow ? (
                  <div className={styles.smsRow}>
                    <AuthField label="验证码" htmlFor={smsId} icon={<Key size={19} />}><input id={smsId} value={smsCode} onChange={(event) => setSmsCode(event.target.value)} className={styles.fieldInput} autoComplete="one-time-code" inputMode="numeric" placeholder="输入 6 位验证码" required /></AuthField>
                    <button type="button" className={styles.smsButton} disabled={smsSending || smsCooldown > 0 || !phone.trim()} onClick={() => void handleSendSmsCode()}>{smsSending ? "发送中…" : smsCooldown > 0 ? `${smsCooldown}s 后重发` : "获取验证码"}</button>
                  </div>
                ) : (
                  <div className={styles.passwordField}>
                    <AuthField label="密码" htmlFor={passwordId} icon={<LockKey size={19} />}><input id={passwordId} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className={styles.fieldInput} autoComplete="current-password" placeholder="输入密码" required /></AuthField>
                  </div>
                )}
              </div>

              {registerMode && <AuthField label="邀请码" htmlFor={invitationId} icon={<Key size={19} />}><input id={invitationId} value={invitationCode} onChange={(event) => setInvitationCode(event.target.value)} className={styles.fieldInput} autoComplete="off" placeholder="输入邀请码" required /></AuthField>}

              {smsError && <p role="alert" className={styles.errorMessage}>{smsError}</p>}
              {error && <p role="alert" className={styles.errorMessage}>{error}</p>}

              <button type="submit" className={styles.submitButton} disabled={submitDisabled}>
                {loading ? <><CircleNotch className={styles.spinner} size={19} /> 正在处理…</> : <>{registerMode ? "注册并进入 AgentHub" : "登录"} <ArrowRight size={20} weight="bold" /></>}
              </button>

              <ApiServiceSettings id={apiSettingsId} inputId={apiServiceId} open={apiSettingsOpen} value={apiServiceUrl} onToggle={() => setApiSettingsOpen((current) => !current)} onChange={setApiServiceUrl} />
            </form>
          )}

          {!demo && <p className={styles.alternateLink}>{registerMode ? "已有账号？" : "还没有账号？"} <Link href={alternateHref}>{registerMode ? "返回登录" : "使用邀请码注册"}</Link></p>}
        </div>
      </section>
    </main>
  );
}

function PhoneField({ id, value, onChange }: { id: string; value: string; onChange: (value: string) => void }) {
  return <AuthField label="手机号" htmlFor={id} icon={<Phone size={19} />}><span className={styles.phonePrefix}>+86</span><input id={id} value={value} onChange={(event) => onChange(event.target.value)} className={`${styles.fieldInput} ${styles.phoneInput}`} autoComplete="tel" inputMode="tel" type="tel" placeholder="输入手机号" required /></AuthField>;
}

function ApiServiceSettings({ id, inputId, open, value, onToggle, onChange }: { id: string; inputId: string; open: boolean; value: string; onToggle: () => void; onChange: (value: string) => void }) {
  return <div className={styles.apiSettings}><button type="button" className={styles.apiSettingsTrigger} aria-expanded={open} aria-controls={id} onClick={onToggle}><span className={styles.apiSettingsLabel}>{open ? <CaretDown size={17} weight="fill" /> : <CaretRight size={17} weight="fill" />}API Service 设置</span><CaretDown className={open ? styles.caretOpen : undefined} size={18} /></button>{open && <div id={id} className={styles.apiSettingsBody}><label htmlFor={inputId} className={styles.apiLabel}>后端服务地址</label><span className={styles.inputFrame}><Server className={styles.fieldIcon} size={18} /><input id={inputId} value={value} onChange={(event) => onChange(event.target.value)} className={styles.fieldInput} placeholder="http://localhost:8080" required inputMode="url" /></span><p className={styles.apiHelp}>地址保存在当前浏览器，并兼容旧 Creator 的运行时覆盖键。</p></div>}</div>;
}

function BrandLink({ className }: { className: string }) {
  return <Link href="/" className={className} aria-label="AgentHub 首页"><Image src="/images/agenthub-logo.png" alt="" width={31} height={31} priority className={styles.brandMark} /><span>Agent<span>Hub</span></span></Link>;
}

function AuthField({ label, htmlFor, icon, children }: { label: string; htmlFor: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <div className={styles.fieldGroup}><label htmlFor={htmlFor} className={styles.fieldLabel}>{label}</label><span className={styles.inputFrame}><span className={styles.fieldIcon} aria-hidden="true">{icon}</span>{children}</span></div>;
}
