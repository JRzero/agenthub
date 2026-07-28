"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CheckCircle,
  DesktopTower,
  Info,
  Plus,
} from "@phosphor-icons/react";
import { DATA_MODE } from "@/config/capabilities";
import { AgentAvatar } from "@/modules/agents/agent-avatar";
import { useAgents } from "@/modules/agents/queries";
import { createAgentClient } from "@/modules/agent-versions/api";
import { useAuth } from "@/modules/auth/auth-provider";
import { useWorkspace } from "@/modules/workspace/workspace-provider";
import { ErrorState, LoadingState } from "@/shared/ui/request-state";
import { Select } from "@/shared/ui/select";

const CLIENT_TYPES = [
  { value: "web_chat", label: "Web Chat" },
  { value: "h5_remote", label: "H5 远程端" },
  { value: "mobile_app", label: "移动应用" },
  { value: "local_desktop", label: "本地桌面端" },
  { value: "api", label: "API / SDK" },
];

export function ClientCreateWorkspace() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const agentsQuery = useAgents();
  const { session } = useAuth();
  const { workspaceCode } = useWorkspace();
  const initialAgentId = Number(searchParams.get("agentId"));
  const [agentId, setAgentId] = useState<number | "">(
    Number.isFinite(initialAgentId) && initialAgentId > 0 ? initialAgentId : "",
  );
  const [name, setName] = useState("");
  const [clientType, setClientType] = useState("web_chat");
  const [clientKey, setClientKey] = useState("");
  const [interactionMode, setInteractionMode] = useState("");
  const [companionMode, setCompanionMode] = useState("");
  const [credentialRef, setCredentialRef] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [demoDone, setDemoDone] = useState(false);
  const selectedAgent = agentsQuery.data?.find((agent) => agent.id === agentId);
  const keyValid = /^[a-z0-9][a-z0-9_-]*$/.test(clientKey);
  const canSubmit = useMemo(
    () => Boolean(agentId && name.trim() && keyValid && clientType),
    [agentId, clientType, keyValid, name],
  );

  if (agentsQuery.isLoading) {
    return <LoadingState label="正在读取可接入的 Agent…" />;
  }
  if (agentsQuery.isError) {
    return (
      <ErrorState
        message={agentsQuery.error.message}
        onRetry={() => void agentsQuery.refetch()}
      />
    );
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit || !agentId) return;
    setSaving(true);
    setError("");
    try {
      if (DATA_MODE === "demo") {
        setDemoDone(true);
        return;
      }
      const config = {
        ...(interactionMode.trim()
          ? { interaction_mode: interactionMode.trim() }
          : {}),
        ...(companionMode.trim()
          ? { companion_mode: companionMode.trim() }
          : {}),
        ...(credentialRef.trim()
          ? { credential_ref: credentialRef.trim() }
          : {}),
      };
      const client = await createAgentClient(
        { apiKey: session?.apiKey || "", workspaceCode },
        agentId,
        {
          client_key: clientKey.trim(),
          client_type: clientType,
          name: name.trim(),
          config: Object.keys(config).length ? config : null,
        },
      );
      await queryClient.invalidateQueries({
        queryKey: ["agent-version-clients", agentId],
      });
      router.push(`/clients/${client.id}?agentId=${agentId}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "创建 Client 接入失败");
    } finally {
      setSaving(false);
    }
  }

  if (demoDone) {
    return (
      <section className="mx-auto max-w-2xl pb-8">
        <div className="panel grid min-h-[480px] place-items-center p-8 text-center">
          <div>
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-50 text-success dark:bg-emerald-400/10">
              <CheckCircle size={30} weight="fill" />
            </span>
            <h1 className="mt-4 text-xl font-bold">Demo 接入信息已确认</h1>
            <p className="mt-2 max-w-md text-sm leading-6 text-text-muted">
              Demo 模式不会向后端写入记录。切换到 Live 模式后可使用相同表单创建真实 Client 接入。
            </p>
            <Link href="/clients" className="button-primary mt-6">
              返回接入管理
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl space-y-5 pb-8">
      <header>
        <Link
          href="/clients"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary"
        >
          <ArrowLeft size={16} />
          返回接入管理
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">
          新建 Client 接入
        </h1>
        <p className="mt-1.5 text-sm text-text-muted">
          为一个 Agent 创建独立的运行端接入记录
        </p>
      </header>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-danger dark:border-rose-400/20 dark:bg-rose-400/10">
          {error}
        </div>
      )}

      <form className="panel overflow-hidden" onSubmit={(event) => void submit(event)}>
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-semibold">基础信息</h2>
          <p className="mt-1 text-xs text-text-muted">
            Client Key 和类型创建后不可修改
          </p>
        </div>
        <div className="space-y-6 p-5 sm:p-6">
          <fieldset>
            <legend className="text-sm font-semibold">
              1. 选择所属 Agent
            </legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {(agentsQuery.data || []).map((agent) => (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() => setAgentId(agent.id)}
                  className={`flex items-center gap-3 rounded-lg border p-3 text-left transition ${
                    agentId === agent.id
                      ? "border-primary bg-primary-soft"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <AgentAvatar agent={agent} size={38} />
                  <span className="min-w-0 flex-1">
                    <strong className="block truncate">{agent.name}</strong>
                    <span className="mt-0.5 block truncate text-xs text-text-muted">
                      {agent.current_version_id
                        ? `平台当前版本 v${agent.version}`
                        : "尚未发布"}
                    </span>
                  </span>
                  {agentId === agent.id && (
                    <CheckCircle size={20} weight="fill" className="text-primary" />
                  )}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="border-t border-border pt-6">
            <legend className="text-sm font-semibold">
              2. 填写 Client 信息
            </legend>
            <div className="mt-3 grid gap-5 sm:grid-cols-2">
              <Field label="显示名称" required>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="例如：OyiiOyii"
                  className="control-field w-full"
                />
              </Field>
              <Field label="Client 类型" required>
                <Select
                  ariaLabel="Client 类型"
                  value={clientType}
                  onValueChange={setClientType}
                  options={CLIENT_TYPES.map((type) => ({
                    value: type.value,
                    label: type.label,
                  }))}
                  className="w-full"
                />
              </Field>
              <Field
                label="Client Key"
                hint="仅使用小写字母、数字、中划线或下划线"
                required
              >
                <input
                  value={clientKey}
                  onChange={(event) =>
                    setClientKey(event.target.value.toLowerCase())
                  }
                  placeholder="oyiioyii-primary"
                  className={`control-field w-full font-mono ${
                    clientKey && !keyValid ? "border-danger" : "border-border"
                  }`}
                />
              </Field>
              <Field label="互动方式">
                <input
                  value={interactionMode}
                  onChange={(event) => setInteractionMode(event.target.value)}
                  placeholder="例如：对话"
                  className="control-field w-full"
                />
              </Field>
              <Field label="运行模式">
                <input
                  value={companionMode}
                  onChange={(event) => setCompanionMode(event.target.value)}
                  placeholder="例如：陪伴模式"
                  className="control-field w-full"
                />
              </Field>
              <Field
                label="凭据引用"
                hint="不填写 API Key、Token 或密钥明文"
              >
                <input
                  value={credentialRef}
                  onChange={(event) => setCredentialRef(event.target.value)}
                  placeholder="vault:client-reference"
                  className="control-field w-full font-mono"
                />
              </Field>
            </div>
          </fieldset>

          <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-200">
            <Info size={18} className="mt-0.5 shrink-0" />
            <p>
              Client 将跟随所选 Agent 的平台当前版本，不会建立独立版本。
              {selectedAgent && !selectedAgent.current_version_id
                ? " 当前 Agent 尚未发布，接入创建后需先发布 Agent 版本才能运行。"
                : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-border bg-subtle/50 px-5 py-4 sm:px-6">
          <Link href="/clients" className="button-secondary">
            取消
          </Link>
          <button
            type="submit"
            disabled={!canSubmit || saving}
            className="button-primary"
          >
            <Plus size={17} />
            {saving ? "正在创建…" : "创建 Client 接入"}
          </button>
        </div>
      </form>

      <div className="flex items-center gap-2 text-xs text-text-muted">
        <DesktopTower size={15} />
        每条 Client 接入记录只属于一个 Agent，重复名称不会被自动合并。
      </div>
    </section>
  );
}

function Field({
  label,
  hint,
  required = false,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">
        {label}
        {required && <span className="ml-1 text-danger">*</span>}
      </span>
      {hint && <span className="mt-1 block text-xs text-text-muted">{hint}</span>}
      <span className="mt-2 block">{children}</span>
    </label>
  );
}
