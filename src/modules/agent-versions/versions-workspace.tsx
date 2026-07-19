"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  CheckCircle,
  Copy,
  DownloadSimple,
  FileText,
  GearSix,
  MagicWand,
  PaperPlaneTilt,
  PlayCircle,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import { useAuth } from "@/modules/auth/auth-provider";
import type { Agent } from "@/modules/agents/types";
import { getProfile } from "@/modules/settings/api";
import { useWorkspace } from "@/modules/workspace/workspace-provider";
import { ApiError } from "@/shared/api/http-client";
import { ErrorState, LoadingState } from "@/shared/ui/request-state";
import { createDraftFromVersion, publishAgentVersion } from "./api";
import { resolveVersionPublisher } from "./model";
import { useAgentClients, useAgentVersion, useAgentVersions } from "./queries";
import type { AgentClient, AgentVersion } from "./types";

function shortHash(value?: string | null) {
  return value ? value.slice(0, 12) : "—";
}

function formatDate(value?: string | null, withTime = false) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(new Date(value));
}

function recordCount(value: object | null | undefined) {
  return value ? Object.keys(value).length : 0;
}

function arrayCount(value: unknown) {
  return Array.isArray(value) ? value.length : 0;
}

function changeText(value: Record<string, unknown> | null) {
  if (!value) return "";
  if (typeof value.summary === "string") return value.summary;
  return Object.keys(value).slice(0, 3).join("、");
}

function versionErrorMessage(error: unknown) {
  if (!(error instanceof ApiError)) {
    return error instanceof Error ? error.message : "操作失败，请重试";
  }
  const messages: Record<string, string> = {
    DRAFT_CONFLICT: "当前草稿已发生变化，请刷新后再操作。",
    DRAFT_HAS_UNPUBLISHED_CHANGES:
      "当前草稿有未发布修改，确认后可用所选历史版本替换草稿。",
    NO_VERSION_CHANGES: "当前草稿与平台当前版本没有差异，无需重复发布。",
    CURRENT_VERSION_CHANGED: "平台当前版本已变化，请刷新后重新确认发布。",
    IDEMPOTENCY_CONFLICT: "本次发布请求与先前内容不一致，请重新发起发布。",
    CLIENT_INCOMPATIBLE: "有 Client 与当前草稿不兼容，请先处理能力配置。",
    CLIENT_CAPABILITIES_CHANGED: "Client 能力已变化，请刷新后重新检查。",
    VERSION_REVOKED: "该历史版本已撤销，不能用于创建草稿。",
    VERSION_NOT_FOUND: "未找到该版本，请刷新列表。",
  };
  return (error.code && messages[error.code]) || error.message;
}

export function VersionsWorkspace({ agent }: { agent: Agent }) {
  const queryClient = useQueryClient();
  const { demo, session } = useAuth();
  const { workspaceCode } = useWorkspace();
  const profileQuery = useQuery({
    queryKey: ["creator-profile", session?.apiKey],
    queryFn: () => getProfile(session?.apiKey || ""),
    enabled: Boolean(session?.apiKey) && !demo,
    staleTime: 5 * 60 * 1000,
  });
  const versionsQuery = useAgentVersions(agent.id);
  const clientsQuery = useAgentClients(agent.id);
  const versions = useMemo(
    () => versionsQuery.data?.versions || [],
    [versionsQuery.data?.versions],
  );
  const [selectedVersionNo, setSelectedVersionNo] = useState<number | null>(
    null,
  );
  const selectedVersionQuery = useAgentVersion(agent.id, selectedVersionNo);
  const [showSnapshot, setShowSnapshot] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [releaseNote, setReleaseNote] = useState("");
  const [publishError, setPublishError] = useState("");
  const [publishErrorCode, setPublishErrorCode] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [requestKey, setRequestKey] = useState("");
  const [restoreVersion, setRestoreVersion] = useState<AgentVersion | null>(
    null,
  );
  const [restoreError, setRestoreError] = useState("");
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    if (selectedVersionNo === null && versions[0]) {
      setSelectedVersionNo(versions[0].version_no);
    }
  }, [selectedVersionNo, versions]);

  const current = versions.find((item) => item.id === agent.current_version_id);
  const selected =
    selectedVersionQuery.data ||
    versions.find((item) => item.version_no === selectedVersionNo);
  const hasDraftChanges = Boolean(
    !current ||
    agent.draft_base_version_id !== agent.current_version_id ||
    (agent.draft_content_hash &&
      current.version_hash &&
      agent.draft_content_hash !== current.version_hash),
  );
  const nextVersionNo = (versions[0]?.version_no || agent.version || 0) + 1;
  const auth = { apiKey: session?.apiKey || "", workspaceCode };
  const clients = clientsQuery.data?.clients || [];

  function openPublish() {
    setReleaseNote("");
    setPublishError("");
    setPublishErrorCode("");
    setRequestKey(crypto.randomUUID());
    setPublishOpen(true);
  }

  async function submitPublish() {
    setPublishing(true);
    setPublishError("");
    setPublishErrorCode("");
    try {
      const result = await publishAgentVersion(auth, agent.id, {
        expected_draft_revision: agent.draft_revision ?? 0,
        expected_current_version_id: agent.current_version_id ?? null,
        release_note: releaseNote.trim(),
        request_key: requestKey,
      });
      queryClient.setQueryData(
        ["agent", agent.id, workspaceCode, false],
        result.agent,
      );
      await Promise.all([
        versionsQuery.refetch(),
        clientsQuery.refetch(),
        queryClient.invalidateQueries({ queryKey: ["agents"] }),
      ]);
      setSelectedVersionNo(result.version.version_no);
      setPublishOpen(false);
    } catch (error) {
      setPublishError(versionErrorMessage(error));
      setPublishErrorCode(error instanceof ApiError ? error.code || "" : "");
    } finally {
      setPublishing(false);
    }
  }

  async function submitRestore(confirmReplace: boolean) {
    if (!restoreVersion) return;
    setRestoring(true);
    setRestoreError("");
    try {
      const updated = await createDraftFromVersion(
        auth,
        agent.id,
        restoreVersion.version_no,
        {
          expected_draft_revision: agent.draft_revision ?? 0,
          confirm_replace: confirmReplace,
        },
      );
      queryClient.setQueryData(
        ["agent", agent.id, workspaceCode, false],
        updated,
      );
      await queryClient.invalidateQueries({ queryKey: ["agents"] });
      setRestoreVersion(null);
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.code === "DRAFT_HAS_UNPUBLISHED_CHANGES" &&
        !confirmReplace
      ) {
        setRestoreError(
          "当前草稿有未发布修改。再次确认将用所选版本替换草稿，但不会改变平台当前版本。",
        );
      } else {
        setRestoreError(versionErrorMessage(error));
      }
    } finally {
      setRestoring(false);
    }
  }

  if (versionsQuery.isLoading)
    return <LoadingState label="正在加载版本记录…" />;
  if (versionsQuery.isError) {
    return (
      <ErrorState
        message={versionsQuery.error.message}
        onRetry={() => void versionsQuery.refetch()}
      />
    );
  }

  return (
    <section className="space-y-4 pb-4">
      <header>
        <h2 className="text-xl font-bold text-text-strong">版本</h2>
        <p className="mt-1 text-sm text-text-muted">
          管理平台当前版本、当前草稿与历史记录
        </p>
      </header>

      {current ? (
        <div className="panel flex flex-wrap items-center gap-x-5 gap-y-3 px-4 py-3.5">
          <strong>平台当前版本</strong>
          <span className="font-semibold text-primary">
            v{current.version_no}
          </span>
          <Divider />
          <span className="inline-flex items-center gap-2">
            Hash{" "}
            <code className="text-text-strong">
              {shortHash(current.version_hash)}
            </code>
            <CopyButton value={current.version_hash} />
          </span>
          <Divider />
          <span className="text-success">新会话默认使用</span>
          <Divider />
          <span
            className={hasDraftChanges ? "text-warning" : "text-text-muted"}
          >
            {hasDraftChanges ? "当前有未发布草稿" : "当前无草稿"}
          </span>
          <Link
            href={"/assets/" + agent.id + "/build"}
            className="button-secondary ml-auto min-h-9 px-4"
          >
            编辑当前版本
          </Link>
          {hasDraftChanges && (
            <button
              type="button"
              className="button-primary min-h-9 px-4"
              onClick={openPublish}
            >
              发布草稿
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-lg border border-amber-200 bg-amber-50/70 px-4 py-3.5">
          <span className="inline-flex items-center gap-2 font-semibold">
            <span className="size-2.5 rounded-full bg-amber-500" />
            当前草稿
          </span>
          <span>初始草稿</span>
          <span className="text-text-muted">
            有 {recordCount(agent.config)} 项配置
          </span>
          <Divider />
          <span className="text-text-muted">Version Hash：发布后生成</span>
          <Link
            href={"/assets/" + agent.id + "/build"}
            className="button-secondary ml-auto min-h-9 px-4"
          >
            查看草稿
          </Link>
          <button
            type="button"
            className="button-primary min-h-9 px-4"
            onClick={openPublish}
          >
            发布第一个版本
          </button>
        </div>
      )}

      {versions.length === 0 ? (
        <FirstPublishState agent={agent} onPublish={openPublish} />
      ) : (
        <div className="grid min-h-[430px] gap-4 xl:grid-cols-[minmax(360px,0.88fr)_minmax(0,1.42fr)]">
          <VersionHistory
            versions={versions}
            currentVersionId={agent.current_version_id}
            selectedVersionNo={selectedVersionNo}
            onSelect={(versionNo) => {
              setShowSnapshot(false);
              setSelectedVersionNo(versionNo);
            }}
          />
          <div className="panel min-w-0 overflow-hidden">
            {selectedVersionQuery.isLoading || !selected ? (
              <LoadingState label="正在加载版本详情…" />
            ) : (
              <VersionDetail
                agent={agent}
                version={selected}
                currentVersion={current}
                clients={clients}
                publisherName={resolveVersionPublisher(
                  selected,
                  profileQuery.data,
                  session?.username,
                )}
                showSnapshot={showSnapshot}
                onToggleSnapshot={() => setShowSnapshot((value) => !value)}
                onCreateDraft={() => {
                  setRestoreError("");
                  setRestoreVersion(selected);
                }}
              />
            )}
          </div>
        </div>
      )}

      {publishOpen && (
        <PublishDialog
          current={current}
          nextVersionNo={nextVersionNo}
          agent={agent}
          clients={clients}
          releaseNote={releaseNote}
          error={publishError}
          blocked={
            publishErrorCode === "CLIENT_INCOMPATIBLE" ||
            publishErrorCode === "CLIENT_CAPABILITIES_CHANGED"
          }
          publishing={publishing}
          onReleaseNote={setReleaseNote}
          onClose={() => !publishing && setPublishOpen(false)}
          onPublish={() => void submitPublish()}
        />
      )}

      {restoreVersion && (
        <RestoreDialog
          version={restoreVersion}
          current={current}
          error={restoreError}
          restoring={restoring}
          onClose={() => !restoring && setRestoreVersion(null)}
          onConfirm={() => void submitRestore(Boolean(restoreError))}
        />
      )}
    </section>
  );
}

function FirstPublishState({
  agent,
  onPublish,
}: {
  agent: Agent;
  onPublish: () => void;
}) {
  return (
    <div className="panel grid min-h-[420px] place-items-center px-6 py-10 text-center">
      <div className="max-w-2xl">
        <FileText size={50} className="mx-auto text-text-muted" />
        <h3 className="mt-5 text-2xl font-semibold">还没有平台当前版本</h3>
        <p className="mt-3 text-sm leading-6 text-text-muted">
          发布当前草稿后，将生成 v1 和唯一 Version Hash。
          <br />
          发布前不会有 Client 或新 Session 使用此 Agent。
        </p>
        <button
          type="button"
          className="button-primary mt-6 px-8"
          onClick={onPublish}
        >
          发布第一个版本
        </button>
        <div className="mt-8 flex flex-wrap justify-center gap-x-7 gap-y-3 border-t border-border pt-5 text-sm text-text-muted">
          <span>配置内容 {recordCount(agent.config)} 项</span>
          <span>知识 {agent.knowledge_base_id ? 1 : 0} 个</span>
          <span>技能 {agent.config?.skills?.length || 0} 个</span>
          <span>
            运行媒体{" "}
            {agent.config?.metadata ? recordCount(agent.config.metadata) : 0} 项
          </span>
        </div>
      </div>
    </div>
  );
}

function VersionHistory({
  versions,
  currentVersionId,
  selectedVersionNo,
  onSelect,
}: {
  versions: AgentVersion[];
  currentVersionId?: number | null;
  selectedVersionNo: number | null;
  onSelect: (versionNo: number) => void;
}) {
  return (
    <aside className="panel overflow-hidden">
      <div className="border-b border-border px-5 py-3.5">
        <h3 className="font-semibold">版本历史</h3>
      </div>
      <div className="divide-y divide-border">
        {versions.map((version) => {
          const selected = selectedVersionNo === version.version_no;
          const current = version.id === currentVersionId;
          return (
            <button
              key={version.id}
              type="button"
              className={
                "relative grid w-full grid-cols-[44px_112px_92px_minmax(0,1fr)] items-center gap-2 px-5 py-4 text-left transition hover:bg-subtle " +
                (selected ? "bg-primary-soft/70" : "")
              }
              onClick={() => onSelect(version.version_no)}
            >
              {selected && (
                <span className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
              )}
              <strong className="text-base">v{version.version_no}</strong>
              <span
                className={
                  "status-badge w-fit " +
                  (current
                    ? "bg-emerald-50 text-emerald-700"
                    : version.availability === "revoked"
                      ? "bg-rose-50 text-rose-700"
                      : "bg-slate-100 text-slate-600")
                }
              >
                {current
                  ? "平台当前版本"
                  : version.availability === "revoked"
                    ? "已撤销"
                    : "历史版本"}
              </span>
              <span className="text-xs text-text-muted">
                {formatDate(version.created_at)}
              </span>
              <span className="truncate text-sm text-text-muted">
                {version.release_note ||
                  changeText(version.change_summary) ||
                  "未填写版本说明"}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function VersionDetail({
  agent,
  version,
  currentVersion,
  clients,
  publisherName,
  showSnapshot,
  onToggleSnapshot,
  onCreateDraft,
}: {
  agent: Agent;
  version: AgentVersion;
  currentVersion?: AgentVersion;
  clients: AgentClient[];
  publisherName: string;
  showSnapshot: boolean;
  onToggleSnapshot: () => void;
  onCreateDraft: () => void;
}) {
  const isCurrent = version.id === agent.current_version_id;
  const configCount = recordCount(version.config_snapshot);
  const skillCount = arrayCount(version.config_snapshot.skills);
  const resourceCount = recordCount(version.resource_manifest);
  const capabilityCount = version.required_capabilities?.length || 0;

  return (
    <div className="flex h-full min-h-[430px] flex-col">
      <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-3.5">
        <h3 className="text-base font-semibold">
          v{version.version_no} 版本详情
        </h3>
        <span
          className={
            "status-badge " +
            (isCurrent
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-600")
          }
        >
          {isCurrent ? "平台当前版本" : "历史版本"}
        </span>
        <span className="ml-auto text-xs text-text-muted">
          发布于 {formatDate(version.created_at, true)}
        </span>
      </div>

      <div className="flex-1 space-y-3 px-5 py-4">
        <dl className="grid grid-cols-3 divide-x divide-border text-sm">
          <CompactDetail label="版本号" value={"v" + version.version_no} />
          <CompactDetail
            label="Version Hash"
            value={shortHash(version.version_hash)}
            copyValue={version.version_hash}
          />
          <CompactDetail label="发布人" value={publisherName} />
        </dl>

        <div className="overflow-hidden rounded-md border border-border">
          <SummaryRow
            icon={<GearSix size={17} />}
            label="配置内容"
            value={configCount + " 项"}
          />
          <SummaryRow
            icon={<MagicWand size={17} />}
            label="知识 · 技能"
            value={
              resourceCount + " 个 · " + (skillCount || capabilityCount) + " 个"
            }
          />
          <SummaryRow
            icon={<PlayCircle size={17} />}
            label="运行媒体"
            value={resourceCount + " 项"}
          />
        </div>

        {isCurrent ? (
          <div>
            <h4 className="mb-2 text-sm font-medium">Client 跟随状态</h4>
            <div className="overflow-hidden rounded-md border border-border">
              {clients.length ? (
                clients.map((client) => (
                  <ClientFollowingRow
                    key={client.id}
                    client={client}
                    currentVersionId={agent.current_version_id}
                  />
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-text-muted">
                  尚未配置 Client
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-md border border-border bg-subtle px-4 py-3 text-sm text-text-muted">
            历史版本不会接收新的 Session 或 Client 同步；已绑定此版本的 Session
            仍可继续运行。
          </div>
        )}

        <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm text-blue-700">
          {isCurrent
            ? "新会话使用 v" +
              version.version_no +
              "；已有会话继续使用创建时绑定的版本。"
            : "这是不可变历史快照；平台当前仍运行 v" +
              (currentVersion?.version_no || agent.version) +
              "。"}
        </div>

        {showSnapshot && (
          <div className="grid gap-3 lg:grid-cols-2">
            <JsonSummary title="配置快照" value={version.config_snapshot} />
            <JsonSummary title="资源清单" value={version.resource_manifest} />
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-end gap-2 border-t border-border px-5 py-3.5">
        <button
          type="button"
          className="button-secondary min-h-9"
          onClick={onToggleSnapshot}
        >
          {showSnapshot ? "收起版本内容" : "查看版本内容"}
        </button>
        {isCurrent ? (
          <Link
            href={"/assets/" + agent.id + "/distribution"}
            className="button-secondary min-h-9"
          >
            <DownloadSimple size={16} />
            导出当前版本
          </Link>
        ) : (
          <button
            type="button"
            className="button-secondary min-h-9 border-primary text-primary"
            disabled={version.availability === "revoked"}
            onClick={onCreateDraft}
          >
            基于此版本创建草稿
          </button>
        )}
      </div>
    </div>
  );
}

function PublishDialog({
  current,
  nextVersionNo,
  agent,
  clients,
  releaseNote,
  error,
  blocked,
  publishing,
  onReleaseNote,
  onClose,
  onPublish,
}: {
  current?: AgentVersion;
  nextVersionNo: number;
  agent: Agent;
  clients: AgentClient[];
  releaseNote: string;
  error: string;
  blocked: boolean;
  publishing: boolean;
  onReleaseNote: (value: string) => void;
  onClose: () => void;
  onPublish: () => void;
}) {
  const enabledClients = clients.filter(
    (client) => client.status === "enabled",
  );
  const synced = clients.filter(
    (client) => client.last_ack_version_id === agent.current_version_id,
  ).length;
  return (
    <Dialog
      title={
        blocked ? "暂时无法发布" : current ? "发布新版本" : "发布第一个版本"
      }
      subtitle={
        blocked
          ? "新版本 v" + nextVersionNo + " 未通过 Client 兼容性检查"
          : "发布后将更新平台当前版本"
      }
      onClose={onClose}
      maxWidth="max-w-[590px]"
    >
      <div className="flex items-center gap-5">
        <VersionPill
          tone="blue"
          label={current ? "当前运行 v" + current.version_no : "尚未发布"}
        />
        <ArrowRight size={24} />
        <VersionPill
          tone={blocked ? "amber" : "green"}
          label={"新版本 v" + nextVersionNo}
        />
        <span className="ml-auto text-xs text-text-muted">
          Version Hash：发布后生成
        </span>
      </div>

      <section className="mt-5">
        <h4 className="text-sm font-semibold">本次发布内容</h4>
        <div className="mt-2 overflow-hidden rounded-md border border-border">
          <SummaryRow
            icon={<GearSix size={17} />}
            label="Agent 配置"
            value={recordCount(agent.config) + " 项"}
          />
          <SummaryRow
            icon={<PlayCircle size={17} />}
            label="运行媒体"
            value={
              (agent.config?.metadata
                ? recordCount(agent.config.metadata)
                : 0) + " 项"
            }
          />
          <SummaryRow
            icon={<MagicWand size={17} />}
            label="知识与技能"
            value={
              (agent.knowledge_base_id ? 1 : 0) +
              " 个 · " +
              (agent.config?.skills?.length || 0) +
              " 个"
            }
          />
        </div>
      </section>

      <label className="mt-4 block text-sm font-medium">
        版本说明 <span className="font-normal text-text-muted">（选填）</span>
        <input
          className="mt-2 h-10 w-full rounded-md border border-border bg-surface px-3 outline-none focus:border-primary"
          value={releaseNote}
          onChange={(event) => onReleaseNote(event.target.value)}
          placeholder="例如：优化角色信息与媒体素材"
        />
      </label>

      <section className="mt-4">
        <h4 className="text-sm font-semibold">发布检查</h4>
        <div className="mt-2 grid gap-1.5 text-sm">
          <CheckLine ok label="草稿 Revision 已锁定" />
          <CheckLine ok label="发布将生成不可变版本快照" />
          <CheckLine
            ok={!blocked}
            label={
              blocked
                ? error
                : enabledClients.length +
                  " 个已启用 Client 将由服务端执行兼容性检查"
            }
          />
        </div>
        {clients.length > 0 && (
          <div className="mt-3 grid grid-cols-3 rounded-md border border-border px-3 py-2 text-xs text-text-muted">
            <span>{synced} 个已同步</span>
            <span>{enabledClients.length - synced} 个待确认</span>
            <span>{clients.length - enabledClients.length} 个已停用</span>
          </div>
        )}
      </section>

      <div
        className={
          "mt-4 rounded-md border px-4 py-3 text-xs leading-5 " +
          (blocked
            ? "border-amber-200 bg-amber-50 text-amber-800"
            : "border-blue-200 bg-blue-50 text-blue-700")
        }
      >
        {blocked ? (
          <>
            发布尚未执行，平台当前版本保持不变。请返回构建页处理兼容问题后再试。
          </>
        ) : (
          <ul className="list-disc space-y-0.5 pl-4">
            <li>新 Session 和无 Session 请求使用新版本</li>
            <li>已有 Session 继续使用创建时绑定的版本</li>
            <li>已导出的本地运行包不会自动更新</li>
          </ul>
        )}
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          className="button-secondary"
          onClick={onClose}
          disabled={publishing}
        >
          取消
        </button>
        {blocked ? (
          <Link
            href={"/assets/" + agent.id + "/build"}
            className="button-primary"
          >
            返回修改
          </Link>
        ) : (
          <button
            type="button"
            className="button-primary"
            onClick={onPublish}
            disabled={publishing}
          >
            <PaperPlaneTilt size={17} />
            {publishing
              ? "正在发布…"
              : current
                ? "发布并更新平台当前版本"
                : "发布第一个版本"}
          </button>
        )}
      </div>
    </Dialog>
  );
}

function RestoreDialog({
  version,
  current,
  error,
  restoring,
  onClose,
  onConfirm,
}: {
  version: AgentVersion;
  current?: AgentVersion;
  error: string;
  restoring: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog
      title={"基于 v" + version.version_no + " 创建草稿"}
      subtitle="恢复该版本内容，并继续编辑后发布为新版本"
      onClose={onClose}
    >
      <div className="flex items-center justify-center gap-6">
        <VersionPill
          tone="blue"
          label={"历史版本 v" + version.version_no}
          sublabel={"Hash " + shortHash(version.version_hash)}
        />
        <ArrowRight size={28} />
        <VersionPill tone="green" label="新的当前草稿" />
      </div>
      <section className="mt-5">
        <h4 className="text-sm font-semibold">将恢复的内容</h4>
        <div className="mt-2 overflow-hidden rounded-md border border-border">
          <SummaryRow
            icon={<GearSix size={17} />}
            label="Agent 配置"
            value={recordCount(version.config_snapshot) + " 项"}
          />
          <SummaryRow
            icon={<PlayCircle size={17} />}
            label="运行媒体"
            value={recordCount(version.resource_manifest) + " 项"}
          />
          <SummaryRow
            icon={<MagicWand size={17} />}
            label="知识与技能"
            value={(version.required_capabilities?.length || 0) + " 项引用"}
          />
        </div>
      </section>
      <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-xs leading-5 text-blue-700">
        <ul className="list-disc space-y-0.5 pl-4">
          <li>平台仍运行 v{current?.version_no || "—"}，不会直接回退</li>
          <li>新建草稿不会修改任何已发布版本</li>
          <li>后续发布将使用连续的新版本号</li>
        </ul>
      </div>
      {error && (
        <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </p>
      )}
      <p className="mt-4 text-xs text-text-muted">
        {error ? "确认后将替换现有未发布草稿。" : "当前无其他未发布草稿。"}
      </p>
      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          className="button-secondary"
          onClick={onClose}
          disabled={restoring}
        >
          取消
        </button>
        <button
          type="button"
          className="button-primary"
          onClick={onConfirm}
          disabled={restoring || version.availability === "revoked"}
        >
          {restoring ? "正在创建…" : error ? "确认替换草稿" : "创建草稿"}
        </button>
      </div>
    </Dialog>
  );
}

function ClientFollowingRow({
  client,
  currentVersionId,
}: {
  client: AgentClient;
  currentVersionId?: number | null;
}) {
  const synced = client.last_ack_version_id === currentVersionId;
  const disabled = client.status === "disabled";
  const label = disabled
    ? "已停用"
    : synced
      ? "已同步"
      : client.last_seen_at
        ? "等待下次同步"
        : "离线";
  return (
    <div className="flex items-center gap-3 border-b border-border px-4 py-2.5 text-sm last:border-b-0">
      <span
        className={
          "size-2 rounded-full " +
          (disabled ? "bg-slate-400" : synced ? "bg-success" : "bg-warning")
        }
      />
      <span className="font-medium">{client.name}</span>
      <span
        className={
          "ml-auto text-xs " +
          (synced
            ? "text-success"
            : disabled
              ? "text-text-muted"
              : "text-warning")
        }
      >
        {label}
      </span>
    </div>
  );
}

function CompactDetail({
  label,
  value,
  copyValue,
}: {
  label: string;
  value: string;
  copyValue?: string;
}) {
  return (
    <div className="px-3 first:pl-0">
      <dt className="text-xs text-text-muted">{label}</dt>
      <dd className="mt-1 flex items-center gap-1.5 font-medium">
        {value}
        {copyValue && <CopyButton value={copyValue} />}
      </dd>
    </div>
  );
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 border-b border-border px-3 py-2.5 text-sm last:border-b-0">
      <span className="text-text-muted">{icon}</span>
      <span className="font-medium">{label}</span>
      <span className="ml-auto text-text-muted">{value}</span>
    </div>
  );
}

function CheckLine({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-start gap-2">
      {ok ? (
        <CheckCircle
          size={17}
          weight="fill"
          className="mt-0.5 shrink-0 text-success"
        />
      ) : (
        <WarningCircle
          size={17}
          weight="fill"
          className="mt-0.5 shrink-0 text-warning"
        />
      )}
      <span>{label}</span>
    </div>
  );
}

function VersionPill({
  tone,
  label,
  sublabel,
}: {
  tone: "blue" | "green" | "amber";
  label: string;
  sublabel?: string;
}) {
  const color =
    tone === "green"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : tone === "amber"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-blue-200 bg-blue-50 text-blue-700";
  return (
    <div
      className={"min-w-32 rounded-md border px-4 py-2 text-center " + color}
    >
      <strong className="text-sm">{label}</strong>
      {sublabel && <span className="mt-0.5 block text-xs">{sublabel}</span>}
    </div>
  );
}

function CopyButton({ value }: { value: string }) {
  return (
    <button
      type="button"
      title="复制 Version Hash"
      aria-label="复制 Version Hash"
      className="text-text-muted transition hover:text-primary"
      onClick={() => void navigator.clipboard.writeText(value)}
    >
      <Copy size={15} />
    </button>
  );
}

function Divider() {
  return <span className="hidden h-5 w-px bg-border sm:block" />;
}

function JsonSummary({
  title,
  value,
}: {
  title: string;
  value: Record<string, unknown>;
}) {
  return (
    <div className="rounded-md border border-border p-3">
      <h4 className="text-sm font-semibold">{title}</h4>
      <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-words text-xs leading-5 text-text-muted">
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  );
}

function Dialog({
  title,
  subtitle,
  children,
  onClose,
  maxWidth = "max-w-xl",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onClose: () => void;
  maxWidth?: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={
          "max-h-[92vh] w-full overflow-y-auto rounded-xl bg-surface shadow-2xl " +
          maxWidth
        }
      >
        <header className="sticky top-0 z-10 flex items-start justify-between border-b border-border bg-surface px-6 py-4">
          <div>
            <h3 className="text-xl font-bold">{title}</h3>
            {subtitle && (
              <p className="mt-1 text-sm text-text-muted">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-md hover:bg-subtle"
            onClick={onClose}
            aria-label="关闭"
          >
            <X size={20} />
          </button>
        </header>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
