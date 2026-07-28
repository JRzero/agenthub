"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/modules/auth/auth-provider";
import { AvatarEditor } from "./avatar-editor";
import { deleteCreatorAvatar, getCreatorAvatarUrl, getProfile, updateProfile, uploadCreatorAvatar } from "./api";
import { PasswordPanel } from "./password-panel";
import type { CreatorProfile } from "./types";

const DEMO_PROFILE: CreatorProfile = {
  id: 1,
  uuid: "demo-creator",
  username: "李然",
  email: "liran@example.com",
  status: "active",
  metadata: { full_name: "李然", description: "星海内容工作室 Creator" },
};

export function ProfileSettingsPanel() {
  const { session, demo, updateSessionUsername } = useAuth();
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);
  const avatar = useMemo(() => localAvatar || getCreatorAvatarUrl(profile), [localAvatar, profile]);

  useEffect(() => {
    if (!session?.apiKey) return;
    let active = true;
    (demo ? Promise.resolve(DEMO_PROFILE) : getProfile(session.apiKey))
      .then((result) => {
        if (!active) return;
        setProfile(result);
        setUsername(result.username);
        setFullName(result.metadata?.full_name || "");
        setDescription(result.metadata?.description || "");
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "加载个人资料失败"))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [demo, session?.apiKey]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!session?.apiKey || !username.trim()) return;
    setSaving(true);
    setMessage("");
    try {
      const result = demo
        ? { ...(profile || DEMO_PROFILE), username: username.trim(), metadata: { ...profile?.metadata, full_name: fullName.trim(), description: description.trim() } }
        : await updateProfile(session.apiKey, { username: username.trim(), full_name: fullName.trim() || undefined, description: description.trim() || undefined });
      setProfile(result);
      updateSessionUsername(result.username);
      setMessage(demo ? "演示资料已在当前页面更新" : "个人资料已更新");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "更新失败");
    } finally {
      setSaving(false);
    }
  };

  const upload = async (file?: File) => {
    if (!file || !session?.apiKey) return;
    setMessage("");
    if (demo) {
      setLocalAvatar(URL.createObjectURL(file));
      setMessage("演示头像仅在当前页面预览");
      return;
    }
    try {
      setProfile(await uploadCreatorAvatar(session.apiKey, file));
      setLocalAvatar(null);
      setMessage("头像已更新");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "头像上传失败");
    }
  };

  const removeAvatar = async () => {
    if (!session?.apiKey) return;
    if (demo) {
      setLocalAvatar(null);
      setMessage("演示头像已移除");
      return;
    }
    try {
      setProfile(await deleteCreatorAvatar(session.apiKey));
      setLocalAvatar(null);
      setMessage("头像已移除");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "移除头像失败");
    }
  };

  if (loading) return <div className="panel p-8 text-text-muted">正在加载个人资料…</div>;

  return <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]"><section className="panel p-6"><h2 className="text-xl font-semibold">个人资料</h2><AvatarEditor avatar={avatar} fallback={username.slice(0, 1)} onUpload={(file) => void upload(file)} onRemove={() => void removeAvatar()} /><form onSubmit={save} className="mt-7 space-y-5"><TextField label="用户名" value={username} onChange={setUsername} required /><TextField label="显示名称" value={fullName} onChange={setFullName} /><label className="block"><span className="font-medium">个人描述</span><textarea rows={4} value={description} onChange={(event) => setDescription(event.target.value)} className="mt-2 w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-sm" /></label><label className="block"><span className="font-medium">邮箱</span><input readOnly value={profile?.email || ""} className="control-field mt-2 w-full bg-subtle text-text-muted" /><span className="mt-1 block text-xs text-text-muted">邮箱暂不支持修改</span></label>{message && <p className="rounded-md border border-primary/20 bg-primary-soft px-4 py-3 text-sm text-text-muted">{message}</p>}<div className="flex justify-end"><button type="submit" className="button-primary" disabled={saving}>{saving ? "保存中…" : "保存资料"}</button></div></form></section><PasswordPanel apiKey={session?.apiKey || ""} demo={demo} /></div>;
}

function TextField({ label, value, onChange, required }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return <label className="block"><span className="font-medium">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} required={required} minLength={required ? 3 : undefined} className="control-field mt-2 w-full" /></label>;
}
