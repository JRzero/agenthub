"use client";

import { useState } from "react";
import { changePassword } from "./api";

export function PasswordPanel({ apiKey }: { apiKey: string }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("");
    setError(false);
    if (newPassword.length < 8) { setError(true); setStatus("新密码至少需要 8 个字符"); return; }
    if (newPassword !== confirmation) { setError(true); setStatus("两次输入的新密码不一致"); return; }
    setSaving(true);
    try {
      await changePassword(apiKey, currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmation("");
      setStatus("密码已更新");
    } catch (caught) {
      setError(true);
      setStatus(caught instanceof Error ? caught.message : "修改密码失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="h-fit border-t border-border pt-6 min-[1360px]:border-l min-[1360px]:border-t-0 min-[1360px]:pl-7 min-[1360px]:pt-0" aria-labelledby="security-title">
      <h2 id="security-title" className="text-lg font-semibold">账户安全</h2>
      <p className="mt-2 text-xs leading-5 text-text-muted">密码修改通过现有账号安全接口完成。</p>
      <form className="mt-5 space-y-4" onSubmit={submit}>
        <PasswordField label="当前密码" value={currentPassword} onChange={setCurrentPassword} />
        <PasswordField label="新密码" value={newPassword} onChange={setNewPassword} />
        <PasswordField label="确认新密码" value={confirmation} onChange={setConfirmation} />
        {status && <p role={error ? "alert" : "status"} className={`rounded-lg border px-3 py-2 text-sm ${error ? "border-danger text-danger" : "border-border text-success"}`}>{status}</p>}
        <button type="submit" className="button-secondary w-full" disabled={saving}>{saving ? "修改中…" : "修改密码"}</button>
      </form>
    </section>
  );
}

function PasswordField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="block"><span className="text-sm font-medium">{label}</span><input aria-label={label} type="password" value={value} onChange={(event) => onChange(event.target.value)} required minLength={8} className="control-field mt-2 w-full" /></label>;
}
