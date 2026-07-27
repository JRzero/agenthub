"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowSquareOut,
  CheckCircle,
  Copy,
  DownloadSimple,
  FloppyDisk,
  PauseCircle,
  PlayCircle,
  WarningCircle,
} from "@phosphor-icons/react";
import { DATA_MODE } from "@/config/capabilities";
import { AgentAvatar } from "@/modules/agents/agent-avatar";
import { useAgent } from "@/modules/agents/queries";
import {
  createAgentClientExport,
  disableAgentClient,
  downloadAgentExport,
  enableAgentClient,
  updateAgentClient,
} from "@/modules/agent-versions/api";
import {
  useAgentClients,
  useAgentClientRuntimeVersion,
} from "@/modules/agent-versions/queries";
import type { AgentClient } from "@/modules/agent-versions/types";
import { useAuth } from "@/modules/auth/auth-provider";
import { useWorkspace } from "@/modules/workspace/workspace-provider";
import { ApiError } from "@/shared/api/http-client";
import { ErrorState, LoadingState } from "@/shared/ui/request-state";
import { ClientIcon } from "./client-icon";
import {
  clientTypeLabel,
  formatClientDate,
  resolveClientSyncStatus,
  clientSyncLabel,
} from "./model";

type EditableConfig = {
  name: string;
  interactionMode: string;
  companionMode: string;
  credentialRef: string;
};

function editableConfig(client: AgentClient): EditableConfig {
  return {
    name: client.name,
    interactionMode: String(client.config?.interaction_mode || ""),
    companionMode: String(client.config?.companion_mode || ""),
    credentialRef: String(client.config?.credential_ref || ""),
  };
}

function formatHash(value?: string | null) {
  return value ? value.slice(0, 12) : "—";
}

function savePackage(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function ClientDetailWorkspace() {
  const params = useParams<{ clientId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const clientId = Number(params.clientId);
  const agentId = Number(searchParams.get("agentId"));
  const agentQuery = useAgent(Number.isFinite(agentId) ? agentId : null);
  const clientsQuery = useAgentClients(Number.isFinite(agentId) ? agentId : 0);
  const runtimeQuery = useAgentClientRuntimeVersion(
    Number.isFinite(clientId) ? clientId : null,
  );
  const { session } = useAuth();
  const { workspaceCode } = useWorkspace();
  const serverClient = clientsQuery.data?.clients.find(
    (item) => item.id === clientId,
  );
  const [demoClient, setDemoClient] = useState<AgentClient | null>(null);
  const client = DATA_MODE === "demo" ? demoClient || serverClient : serverClient;
  const [form, setForm] = useState<EditableConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!serverClient) return;
    setDemoClient(serverClient);
    setForm(editableConfig(serverClient));
  }, [serverClient]);

  const changed = useMemo(() => {
    if (!client || !form) return false;
    return JSON.stringify(form) !== JSON.stringify(editableConfig(client));
  }, [client, form]);

  if (
    !Number.isFinite(agentId) ||
    !Number.isFinite(clientId) ||
    agentQuery.isLoading ||
    clientsQuery.isLoading
  ) {
    return <LoadingState label="正在加载 Client 接入详情…" />;
  }
  if (agentQuery.isError || clientsQuery.isError || !agentQuery.data || !client) {
    return (
      <ErrorState
        message={
          agentQuery.error?.message ||
          clientsQuery.error?.message ||
          "没有找到这条 Client 接入记录，请从 Clients 列表重新进入。"
        }
        onRetry={() => router.push("/clients")}
      />
    );
  }

  const agent = agentQuery.data;
  const syncStatus = resolveClientSyncStatus(
    client,
    agent.current_version_id,
  );
  const capabilities = client.capability_manifest?.capabilities || [];
  const auth = {
    apiKey: session?.apiKey || "",
    username: session?.username,
    workspaceCode,
  };

  async function refreshClient() {
    await queryClient.invalidateQueries({
      queryKey: ["agent-version-clients", agentId],
    });
    await clientsQuery.refetch();
  }

  async function save() {
    if (!form || !client || !changed) return;
    setSaving(true);
    setError("");
    setMessage("");
    const config = {
      ...(client.config || {}),
      interaction_mode: form.interactionMode || undefined,
      companion_mode: form.companionMode || undefined,
      credential_ref: form.credentialRef || undefined,
    };
    try {
      const next =
        DATA_MODE === "demo"
          ? {
              ...client,
              name: form.name.trim(),
              config,
              capability_hash: `${client.capability_hash}-demo`,
            }
          : await updateAgentClient(auth, client.id, {
              expected_capability_hash: client.capability_hash,
              name: form.name.trim(),
              config,
            });
      if (DATA_MODE === "demo") {
        setDemoClient(next);
      } else {
        await refreshClient();
      }
      setForm(editableConfig(next));
      setMessage("Client 接入设置已保存。");
    } catch (caught) {
      if (
        caught instanceof ApiError &&
        (caught.status === 409 || caught.code === "DRAFT_CONFLICT")
      ) {
        await refreshClient();
        setError("Client 能力已在其他位置更新，已加载最新状态，请确认后重试。");
      } else {
        setError(caught instanceof Error ? caught.message : "保存失败");
      }
    } finally {
      setSaving(false);
    }
  }

  async function toggleEnabled() {
    if (!client) return;
    const disabling = client.status === "enabled";
    if (
      disabling &&
      !window.confirm(
        "确定停用这条 Client 接入？停用后将停止跟随平台当前版本，历史记录会保留。",
      )
    ) {
      return;
    }
    setSaving(true);
    setError("");
    setMessage("");
    try {
      if (DATA_MODE === "demo") {
        setDemoClient({
          ...client,
          status: disabling ? "disabled" : "enabled",
        });
      } else if (disabling) {
        await disableAgentClient(auth, client.id);
        await refreshClient();
      } else {
        await enableAgentClient(auth, client);
        await refreshClient();
      }
      setMessage(disabling ? "Client 接入已停用。" : "Client 接入已重新启用。");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "操作失败");
    } finally {
      setSaving(false);
    }
  }

  async function exportCurrent() {
    if (!client) return;
    setExporting(true);
    setError("");
    setMessage("");
    try {
      const result = await createAgentClientExport(auth, client.id);
      const download = await downloadAgentExport(auth, result.id);
      savePackage(download.blob, download.filename);
      setMessage(`当前版本运行包已导出，Hash ${formatHash(result.package_hash)}。`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "导出失败");
    } finally {
      setExporting(false);
    }
  }

  return (
    <section className="space-y-5 pb-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/clients"
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary"
          >
            <ArrowLeft size={16} />
            返回 Clients
          </Link>
          <div className="mt-3 flex items-center gap-3">
            <span
              className={`grid size-11 place-items-center rounded-xl ${
                client.status === "enabled"
                  ? "bg-primary text-white"
                  : "bg-slate-200 text-slate-500 dark:bg-slate-700"
              }`}
            >
              <ClientIcon type={client.client_type} size={22} />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{client.name}</h1>
              <p className="mt-0.5 text-sm text-text-muted">
                {clientTypeLabel(client.client_type)} · {agent.name}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/assets/${agent.id}/distribution`}
            className="button-secondary"
          >
            前往 Agent 发行
            <ArrowSquareOut size={16} />
          </Link>
          <button
            type="button"
            className="button-secondary"
            disabled={exporting || !agent.current_version_id}
            onClick={() => void exportCurrent()}
          >
            <DownloadSimple size={17} />
            {exporting ? "正在导出…" : "导出当前版本"}
          </button>
        </div>
      </header>

      {(message || error) && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            error
              ? "border-rose-200 bg-rose-50 text-danger dark:border-rose-400/20 dark:bg-rose-400/10"
              : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300"
          }`}
        >
          {error || message}
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,.75fr)]">
        <div className="space-y-4">
          <div className="panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h2 className="font-semibold">接入配置</h2>
                <p className="mt-1 text-xs text-text-muted">
                  Client 类型和 Client Key 创建后保持不变
                </p>
              </div>
              <span
                className={`status-badge ${
                  client.status === "enabled"
                    ? "status-success"
                    : "status-neutral"
                }`}
              >
                {client.status === "enabled" ? "已启用" : "已停用"}
              </span>
            </div>
            {form && (
              <div className="grid gap-5 p-5 md:grid-cols-2">
                <Field label="显示名称">
                  <input
                    value={form.name}
                    onChange={(event) =>
                      setForm((current) =>
                        current ? { ...current, name: event.target.value } : current,
                      )
                    }
                    className="h-10 w-full rounded-md border border-border bg-surface px-3 focus:border-primary"
                  />
                </Field>
                <ReadOnly label="Client 类型" value={clientTypeLabel(client.client_type)} />
                <ReadOnly label="Client Key" value={client.client_key} mono />
                <Field label="互动方式">
                  <input
                    value={form.interactionMode}
                    onChange={(event) =>
                      setForm((current) =>
                        current
                          ? { ...current, interactionMode: event.target.value }
                          : current,
                      )
                    }
                    placeholder="例如：网页对话"
                    className="h-10 w-full rounded-md border border-border bg-surface px-3 focus:border-primary"
                  />
                </Field>
                <Field label="运行模式">
                  <input
                    value={form.companionMode}
                    onChange={(event) =>
                      setForm((current) =>
                        current
                          ? { ...current, companionMode: event.target.value }
                          : current,
                      )
                    }
                    placeholder="例如：标准模式"
                    className="h-10 w-full rounded-md border border-border bg-surface px-3 focus:border-primary"
                  />
                </Field>
                <Field
                  label="凭据引用"
                  hint="只填写安全存储引用，不填写 API Key 或密钥明文"
                >
                  <input
                    value={form.credentialRef}
                    onChange={(event) =>
                      setForm((current) =>
                        current
                          ? { ...current, credentialRef: event.target.value }
                          : current,
                      )
                    }
                    placeholder="vault:client-reference"
                    className="h-10 w-full rounded-md border border-border bg-surface px-3 font-mono text-sm focus:border-primary"
                  />
                </Field>
              </div>
            )}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-subtle/50 px-5 py-3.5">
              <button
                type="button"
                onClick={() => void toggleEnabled()}
                disabled={saving}
                className={`button-secondary ${
                  client.status === "enabled" ? "text-danger" : "text-success"
                }`}
              >
                {client.status === "enabled" ? (
                  <PauseCircle size={18} />
                ) : (
                  <PlayCircle size={18} />
                )}
                {client.status === "enabled" ? "停用接入" : "重新启用"}
              </button>
              <button
                type="button"
                onClick={() => void save()}
                disabled={!changed || saving || !form?.name.trim()}
                className="button-primary"
              >
                <FloppyDisk size={17} />
                {saving ? "保存中…" : "保存修改"}
              </button>
            </div>
          </div>

          <div className="panel overflow-hidden">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-semibold">能力声明</h2>
              <p className="mt-1 text-xs text-text-muted">
                由实际 Client 上报，当前页面只读展示
              </p>
            </div>
            <div className="p-5">
              {capabilities.length ? (
                <div className="flex flex-wrap gap-2">
                  {capabilities.map((capability) => (
                    <span
                      key={capability}
                      className="rounded-md bg-primary-soft px-2.5 py-1.5 text-xs font-medium text-primary"
                    >
                      {capability}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-muted">尚未上报能力声明</p>
              )}
              <div className="mt-4 flex items-center gap-2 border-t border-border pt-4 text-xs text-text-muted">
                <span>能力 Hash：{formatHash(client.capability_hash)}</span>
                <button
                  type="button"
                  aria-label="复制能力 Hash"
                  className="rounded p-1 hover:bg-subtle"
                  onClick={() =>
                    void navigator.clipboard.writeText(client.capability_hash)
                  }
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="panel p-5">
            <h2 className="font-semibold">运行状态</h2>
            <div className="mt-4 flex items-center gap-3 rounded-lg bg-subtle p-3">
              <span className="grid size-9 place-items-center rounded-full bg-surface text-primary">
                {syncStatus === "synced" ? (
                  <CheckCircle size={21} weight="fill" />
                ) : (
                  <WarningCircle size={21} weight="fill" />
                )}
              </span>
              <div>
                <p className="font-medium">{clientSyncLabel(syncStatus)}</p>
                <p className="mt-0.5 text-xs text-text-muted">
                  统一跟随平台当前版本
                </p>
              </div>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <DetailTerm
                label="平台当前版本"
                value={
                  agent.current_version_id ? `v${agent.version}` : "尚未发布"
                }
              />
              <DetailTerm
                label="最近确认版本"
                value={
                  client.last_ack_version_id
                    ? runtimeQuery.data
                      ? `v${runtimeQuery.data.current_version_no}`
                      : `ID ${client.last_ack_version_id}`
                    : "尚未确认"
                }
              />
              <DetailTerm
                label="最近连接"
                value={formatClientDate(client.last_seen_at)}
              />
              <DetailTerm
                label="创建时间"
                value={formatClientDate(client.created_at)}
              />
            </dl>
          </div>

          <div className="panel p-5">
            <h2 className="font-semibold">所属 Agent</h2>
            <div className="mt-4 flex items-center gap-3">
              <AgentAvatar agent={agent} size={42} />
              <div className="min-w-0">
                <p className="truncate font-medium">{agent.name}</p>
                <p className="mt-0.5 truncate text-xs text-text-muted">
                  {agent.description || "暂无简介"}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      {hint && <span className="mt-1 block text-xs text-text-muted">{hint}</span>}
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

function ReadOnly({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <span className="text-sm font-medium">{label}</span>
      <div
        className={`mt-2 flex h-10 items-center rounded-md border border-border bg-subtle px-3 text-sm text-text-muted ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function DetailTerm({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-text-muted">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
