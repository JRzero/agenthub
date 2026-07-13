"use client";

import { useState } from "react";
import { changePassword } from "./api";

export function PasswordPanel({ apiKey, demo }: { apiKey: string; demo: boolean }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("");
    if (newPassword.length < 8) return setStatus("新密码至少需要 8 个字符");
    if (newPassword !== confirmation) return setStatus("两次输入的新密码不一致");
    setSaving(true);
    try {
      if (!demo) await changePassword(apiKey, currentPassword, newPassword);
      setCurrentPassword(""); setNewPassword(""); setConfirmation("");
      setStatus(demo ? "演示模式未修改真实密码" : "密码已更新");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "修改密码失败");
    } finally {
      setSaving(false);
    }
  };

  return <section className="panel p-6"><h2 className="text-lg font-semibold">账户安全</h2><form className="mt-5 space-y-4" onSubmit={submit}><PasswordField label="当前密码" value={currentPassword} onChange={setCurrentPassword} /><PasswordField label="新密码" value={newPassword} onChange={setNewPassword} /><PasswordField label="确认新密码" value={confirmation} onChange={setConfirmation} />{status && <p className="rounded-md bg-subtle px-3 py-2 text-sm text-text-muted">{status}</p>}<div className="flex justify-end"><button type="submit" className="button-secondary" disabled={saving}>{saving ? "修改中…" : "修改密码"}</button></div></form></section>;
}

function PasswordField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="block"><span className="text-sm font-medium">{label}</span><input type="password" value={value} onChange={(event) => onChange(event.target.value)} required minLength={8} className="mt-2 w-full rounded-md border border-border bg-surface px-4 py-2.5" /></label>; }
