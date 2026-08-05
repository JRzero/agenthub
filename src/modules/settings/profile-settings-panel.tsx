"use client";

import { useEffect, useMemo, useState } from "react";
import { LockKey } from "@phosphor-icons/react";
import { useAuth } from "@/modules/auth/auth-provider";
import { AvatarEditor } from "./avatar-editor";
import { deleteCreatorAvatar, getCreatorAvatarUrl, getProfile, updateProfile, uploadCreatorAvatar } from "./api";
import { PasswordPanel } from "./password-panel";
import type { CreatorProfile } from "./types";

export function ProfileSettingsPanel() {
  const { session, demo, updateSessionUsername } = useAuth();
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"neutral" | "success" | "error">("neutral");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);
  const avatar = useMemo(() => localAvatar || getCreatorAvatarUrl(profile), [localAvatar, profile]);
  const dirty = Boolean(profile) && (
    username !== profile?.username
    || fullName !== (profile?.metadata?.full_name || "")
    || description !== (profile?.metadata?.description || "")
  );

  useEffect(() => {
    if (demo) {
      setLoading(false);
      return;
    }
    if (!session?.apiKey) {
      setMessage("当前会话无法读取个人资料");
      setMessageTone("error");
      setLoading(false);
      return;
    }
    let active = true;
    getProfile(session.apiKey)
      .then((result) => {
        if (!active) return;
        setProfile(result);
        setUsername(result.username);
        setFullName(result.metadata?.full_name || "");
        setDescription(result.metadata?.description || "");
      })
      .catch((error) => {
        setMessage(error instanceof Error ? error.message : "加载个人资料失败");
        setMessageTone("error");
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [demo, session?.apiKey]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!session?.apiKey || !username.trim() || !dirty) return;
    setSaving(true);
    setMessage("");
    try {
      const result = await updateProfile(session.apiKey, {
        username: username.trim(),
        full_name: fullName.trim() || undefined,
        description: description.trim() || undefined,
      });
      setProfile(result);
      setUsername(result.username);
      setFullName(result.metadata?.full_name || "");
      setDescription(result.metadata?.description || "");
      updateSessionUsername(result.username);
      setMessage("个人资料已更新");
      setMessageTone("success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "更新失败");
      setMessageTone("error");
    } finally {
      setSaving(false);
    }
  };

  const upload = async (file?: File) => {
    if (!file || !session?.apiKey) return;
    setMessage("");
    try {
      setProfile(await uploadCreatorAvatar(session.apiKey, file));
      setLocalAvatar(null);
      setMessage("头像已更新");
      setMessageTone("success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "头像上传失败");
      setMessageTone("error");
    }
  };

  const removeAvatar = async () => {
    if (!session?.apiKey) return;
    try {
      setProfile(await deleteCreatorAvatar(session.apiKey));
      setLocalAvatar(null);
      setMessage("头像已移除");
      setMessageTone("success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "移除头像失败");
      setMessageTone("error");
    }
  };

  if (demo) {
    return (
      <section className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-border bg-surface px-6 text-center">
        <span className="grid size-16 place-items-center rounded-xl border border-border text-text-muted"><LockKey size={28} /></span>
        <h2 className="mt-5 text-xl font-semibold">个人资料与安全仅连接真实账号</h2>
        <p className="mt-3 max-w-lg text-sm leading-6 text-text-muted">演示模式不会显示虚构个人资料，也不会模拟头像、资料或密码修改成功。请在真实登录会话中使用现有账号接口。</p>
      </section>
    );
  }

  if (loading) return <div className="panel p-8 text-text-muted">正在加载个人资料…</div>;
  if (!profile) return <div className="error-feedback" role="alert">{message || "个人资料暂时不可用"}</div>;

  return (
    <div className="grid gap-7 min-[1360px]:grid-cols-[minmax(0,1fr)_320px]">
      <section aria-labelledby="profile-title">
        <h2 id="profile-title" className="text-xl font-semibold">个人资料</h2>
        <p className="mt-2 text-sm text-text-muted">更新 Creator 账号的公开显示信息；邮箱仍保持只读。</p>
        <AvatarEditor avatar={avatar} fallback={username.slice(0, 1)} onUpload={(file) => void upload(file)} onRemove={() => void removeAvatar()} />
        <form onSubmit={save} className="mt-7 space-y-5">
          <TextField label="用户名" value={username} onChange={setUsername} required />
          <TextField label="显示名称" value={fullName} onChange={setFullName} />
          <label className="block"><span className="font-medium">个人描述</span><textarea aria-label="个人描述" rows={4} value={description} onChange={(event) => { setDescription(event.target.value); setMessage(""); }} className="mt-2 w-full resize-none rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>
          <label className="block"><span className="font-medium">邮箱</span><input aria-label="邮箱" readOnly value={profile.email} className="control-field mt-2 w-full bg-surface text-text-secondary" /><span className="mt-1 block text-xs text-text-muted">邮箱暂不支持修改</span></label>
          {message && <p role={messageTone === "error" ? "alert" : "status"} className={`rounded-lg border px-4 py-3 text-sm ${messageTone === "error" ? "border-danger text-danger" : "border-border text-text-secondary"}`}>{message}</p>}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5"><p className={`text-xs ${dirty ? "text-warning" : "text-text-muted"}`}>{dirty ? "有未保存的资料更改" : "当前资料已保存"}</p><button type="submit" className="button-primary" disabled={saving || !dirty}>{saving ? "保存中…" : "保存资料"}</button></div>
        </form>
      </section>
      <PasswordPanel apiKey={session?.apiKey || ""} />
    </div>
  );
}

function TextField({ label, value, onChange, required }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return <label className="block"><span className="font-medium">{label}</span><input aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} required={required} minLength={required ? 3 : undefined} className="control-field mt-2 w-full" /></label>;
}
