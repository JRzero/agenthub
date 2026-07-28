"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowClockwise,
  CalendarDots,
  CaretLeft,
  CaretRight,
  ChatCircle,
  Heart,
  MagnifyingGlass,
  Plus,
  SpinnerGap,
  Star,
  Trash,
  WarningCircle,
} from "@phosphor-icons/react";
import { DATA_MODE } from "@/config/capabilities";
import { AgentAvatar } from "@/modules/agents/agent-avatar";
import { useAgents } from "@/modules/agents/queries";
import type { Agent } from "@/modules/agents/types";
import { useAuth } from "@/modules/auth/auth-provider";
import { useWorkspace } from "@/modules/workspace/workspace-provider";
import { Select } from "@/shared/ui/select";
import {
  addMomentComment,
  deleteMoment,
  getMoment,
  listMomentComments,
  listMoments,
} from "./api";
import { DEMO_MOMENTS } from "./fixtures";
import { filterMoments, formatMomentTime, momentMediaUrl } from "./model";
import { AutoPublishDialog } from "./auto-publish-dialog";
import { MomentCreateFlow } from "./moment-create-flow";
import type { MomentComment, MomentItem } from "./types";

const PAGE_SIZE = 20;

function initialFor(name: string) {
  return name.trim().slice(0, 1).toUpperCase() || "A";
}

export function MomentsWorkspace() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const agentsQuery = useAgents();
  const { session } = useAuth();
  const { workspaceCode } = useWorkspace();
  const auth = { apiKey: session?.apiKey || "", workspaceCode };
  const requestedAgentId = Number(searchParams.get("agentId"));
  const agentId =
    Number.isFinite(requestedAgentId) && requestedAgentId > 0
      ? requestedAgentId
      : null;
  const creating = searchParams.get("view") === "create";
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");
  const [days, setDays] = useState<number | "all">(7);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [demoMoments, setDemoMoments] = useState(DEMO_MOMENTS);
  const [comment, setComment] = useState("");
  const [commenting, setCommenting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState("");
  const [autoPublishOpen, setAutoPublishOpen] = useState(false);

  const momentsQuery = useQuery({
    queryKey: ["oyiioyii-moments", agentId, page, workspaceCode, DATA_MODE],
    queryFn: () =>
      DATA_MODE === "demo"
        ? Promise.resolve({
            moments: demoMoments
              .filter((item) => !agentId || item.agent_id === agentId)
              .slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
            total: demoMoments.filter(
              (item) => !agentId || item.agent_id === agentId,
            ).length,
            limit: PAGE_SIZE,
            offset: page * PAGE_SIZE,
          })
        : listMoments(auth, {
            agentId,
            limit: PAGE_SIZE,
            offset: page * PAGE_SIZE,
          }),
    enabled: Boolean(session?.apiKey),
  });

  const loadedMoments = useMemo(
    () => momentsQuery.data?.moments || [],
    [momentsQuery.data?.moments],
  );
  const moments = useMemo(
    () => filterMoments(loadedMoments, query, days),
    [days, loadedMoments, query],
  );

  useEffect(() => {
    setSelectedId((current) =>
      moments.some((item) => item.id === current)
        ? current
        : moments[0]?.id || null,
    );
  }, [moments]);

  useEffect(() => {
    if (DATA_MODE !== "demo") return;
    void queryClient.invalidateQueries({
      queryKey: ["oyiioyii-moments"],
    });
  }, [demoMoments, queryClient]);

  const listMoment = moments.find((item) => item.id === selectedId) || null;
  const detailQuery = useQuery({
    queryKey: ["oyiioyii-moment", selectedId, workspaceCode, DATA_MODE],
    queryFn: () =>
      DATA_MODE === "demo"
        ? Promise.resolve(listMoment)
        : getMoment(auth, selectedId || 0),
    enabled: Boolean(selectedId && session?.apiKey && DATA_MODE !== "demo"),
  });
  const selected =
    DATA_MODE === "demo" ? listMoment : detailQuery.data || listMoment;
  const commentsQuery = useQuery({
    queryKey: [
      "oyiioyii-moment-comments",
      selectedId,
      workspaceCode,
      DATA_MODE,
    ],
    queryFn: () => listMomentComments(auth, selectedId || 0),
    enabled: Boolean(
      selectedId && session?.apiKey && DATA_MODE !== "demo",
    ),
  });
  const comments =
    DATA_MODE === "demo"
      ? selected?.comments || []
      : commentsQuery.data || selected?.comments || [];
  const total = momentsQuery.data?.total;
  const hasNext =
    total === null
      ? loadedMoments.length === PAGE_SIZE
      : (page + 1) * PAGE_SIZE < (total || 0);

  function updateLocation(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("module", "moments");
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) params.delete(key);
      else params.set(key, value);
    });
    router.push(`/operations?${params.toString()}`);
  }

  function openCreate() {
    updateLocation({ view: "create" });
  }

  function exitCreate() {
    updateLocation({ view: null });
  }

  function published(moment: MomentItem) {
    if (DATA_MODE === "demo") {
      setDemoMoments((current) => [moment, ...current]);
    } else {
      void queryClient.invalidateQueries({
        queryKey: ["oyiioyii-moments"],
      });
    }
    setPage(0);
    setSelectedId(moment.id);
    exitCreate();
  }

  async function removeSelected() {
    if (!selected) return;
    setDeleting(true);
    setActionError("");
    try {
      if (DATA_MODE === "demo") {
        setDemoMoments((current) =>
          current.filter((item) => item.id !== selected.id),
        );
      } else {
        await deleteMoment(auth, selected.agent_id, selected.id);
        await queryClient.invalidateQueries({
          queryKey: ["oyiioyii-moments"],
        });
      }
      setSelectedId(null);
      setConfirmingDelete(false);
    } catch (caught) {
      setActionError(caught instanceof Error ? caught.message : "删除失败");
    } finally {
      setDeleting(false);
    }
  }

  async function sendComment() {
    if (!selected || !comment.trim()) return;
    setCommenting(true);
    setActionError("");
    try {
      const result: MomentComment =
        DATA_MODE === "demo"
          ? {
              id: Date.now(),
              creator_name: "创作者",
              content: comment.trim(),
              created_at: new Date().toISOString(),
            }
          : await addMomentComment(auth, selected.id, comment.trim());
      if (DATA_MODE === "demo") {
        setDemoMoments((current) =>
          current.map((item) =>
            item.id === selected.id
              ? {
                  ...item,
                  comments: [...(item.comments || []), result],
                  comment_count: (item.comment_count || 0) + 1,
                }
              : item,
          ),
        );
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["oyiioyii-moment-comments", selected.id],
        });
      }
      setComment("");
    } catch (caught) {
      setActionError(caught instanceof Error ? caught.message : "评论发送失败");
    } finally {
      setCommenting(false);
    }
  }

  if (creating) {
    return (
      <MomentCreateFlow
        agents={agentsQuery.data || []}
        initialAgentId={agentId}
        onExit={exitCreate}
        onPublished={published}
      />
    );
  }

  return (
    <div className="bg-canvas">
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface px-4 py-3 sm:px-6 lg:px-7">
        <Select
          ariaLabel="按 Agent 筛选朋友圈"
          value={String(agentId || "all")}
          onValueChange={(value) => {
            setPage(0);
            updateLocation({
              agentId: value === "all" ? null : value,
            });
          }}
          className="min-w-40"
          options={[{ value: "all", label: "全部 Agent" }, ...(agentsQuery.data || []).map((agent) => ({ value: String(agent.id), label: agent.name }))]}
        />
        <Select
          ariaLabel="按发布时间筛选朋友圈"
          value={String(days)}
          onValueChange={(value) =>
            setDays(
              value === "all"
                ? "all"
                : Number(value),
            )
          }
          options={[{ value: "7", label: "近 7 天" }, { value: "30", label: "近 30 天" }, { value: "all", label: "全部时间" }]}
        />
        <label className="relative min-w-[220px] flex-1 lg:max-w-sm">
          <MagnifyingGlass
            size={17}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索当前页动态正文"
            className="control-field w-full pl-9"
          />
        </label>
        <button
          type="button"
          className="button-secondary"
          onClick={() => setAutoPublishOpen(true)}
          disabled={
            !agentsQuery.data?.some((agent) => agent.current_version_id)
          }
        >
          <CalendarDots size={17} />
          自动发布设置
        </button>
        <button
          type="button"
          className="button-primary ml-auto"
          onClick={openCreate}
          disabled={!agentsQuery.data?.length}
        >
          <Plus size={17} />
          新建动态
        </button>
      </div>

      <AutoPublishDialog
        open={autoPublishOpen}
        agents={agentsQuery.data || []}
        initialAgentId={agentId}
        auth={auth}
        onClose={() => setAutoPublishOpen(false)}
      />

      {actionError && (
        <div className="mx-4 mt-3 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-danger dark:border-rose-400/20 dark:bg-rose-400/10 sm:mx-6">
          <WarningCircle size={18} className="mt-0.5 shrink-0" />
          {actionError}
        </div>
      )}

      <div className="grid min-h-[680px] xl:h-[calc(100vh-193px)] xl:min-h-[560px] xl:grid-cols-[300px_minmax(390px,1fr)_290px]">
        <aside className="flex min-h-0 flex-col border-r border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <h2 className="font-semibold">已发布内容</h2>
              <p className="mt-0.5 text-xs text-text-muted">
                {total === null || total === undefined
                  ? `${loadedMoments.length} 条当前页记录`
                  : `共 ${total} 条`}
              </p>
            </div>
            {momentsQuery.isFetching && (
              <SpinnerGap size={17} className="loading-spin text-primary" />
            )}
          </div>

          {momentsQuery.isLoading ? (
            <LoadingList />
          ) : momentsQuery.isError ? (
            <div className="grid min-h-72 place-items-center p-6 text-center">
              <div>
                <WarningCircle size={28} className="mx-auto text-danger" />
                <p className="mt-3 text-sm">朋友圈加载失败</p>
                <button
                  type="button"
                  className="button-secondary control-compact mt-4"
                  onClick={() => void momentsQuery.refetch()}
                >
                  <ArrowClockwise size={16} />
                  重试
                </button>
              </div>
            </div>
          ) : moments.length ? (
            <div className="min-h-0 flex-1 divide-y divide-border overflow-y-auto">
              {moments.map((moment) => {
                const media = momentMediaUrl(moment);
                const agent = agentsQuery.data?.find(
                  (item) => item.id === moment.agent_id,
                );
                return (
                  <button
                    key={moment.id}
                    type="button"
                    onClick={() => setSelectedId(moment.id)}
                    className={`flex w-full gap-3 px-4 py-3 text-left transition ${
                      selectedId === moment.id
                        ? "bg-primary-soft"
                        : "hover:bg-subtle"
                    }`}
                  >
                    {media ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={media}
                        alt=""
                        className="size-12 shrink-0 rounded-lg object-cover"
                      />
                    ) : agent ? (
                      <AgentAvatar agent={agent} size={48} />
                    ) : (
                      <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-primary-soft font-semibold text-primary">
                        {initialFor(moment.agent_name)}
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <strong className="truncate text-sm">
                          {moment.agent_name}
                        </strong>
                        <span className="shrink-0 text-[11px] text-text-muted">
                          {formatMomentTime(moment.created_at)}
                        </span>
                      </span>
                      <span className="mt-1 block truncate text-xs text-text-muted">
                        {moment.content}
                      </span>
                      <span className="mt-1.5 flex items-center gap-3 text-[11px] text-text-muted">
                        {typeof moment.like_count === "number" && (
                          <span className="inline-flex items-center gap-1">
                            <Heart size={12} />
                            {moment.like_count}
                          </span>
                        )}
                        {typeof moment.comment_count === "number" && (
                          <span className="inline-flex items-center gap-1">
                            <ChatCircle size={12} />
                            {moment.comment_count}
                          </span>
                        )}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="grid min-h-72 flex-1 place-items-center p-6 text-center">
              <div>
                <ChatCircle size={30} className="mx-auto text-primary" />
                <p className="mt-3 font-medium">暂无已发布内容</p>
                <p className="mt-1 text-xs text-text-muted">
                  调整筛选条件，或创建第一条动态
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-border px-3 py-2.5">
            <button
              type="button"
              aria-label="上一页"
              disabled={page === 0}
              onClick={() => setPage((current) => Math.max(0, current - 1))}
              className="grid size-8 place-items-center rounded-md border border-border hover:bg-subtle disabled:opacity-40"
            >
              <CaretLeft size={15} />
            </button>
            <span className="text-xs text-text-muted">第 {page + 1} 页</span>
            <button
              type="button"
              aria-label="下一页"
              disabled={!hasNext}
              onClick={() => setPage((current) => current + 1)}
              className="grid size-8 place-items-center rounded-md border border-border hover:bg-subtle disabled:opacity-40"
            >
              <CaretRight size={15} />
            </button>
          </div>
        </aside>

        <main className="min-h-0 min-w-0 bg-surface xl:overflow-y-auto">
          {selected ? (
            <MomentDetail
              moment={selected}
              agent={agentsQuery.data?.find(
                (item) => item.id === selected.agent_id,
              )}
            />
          ) : (
            <div className="grid min-h-[520px] place-items-center text-sm text-text-muted">
              选择一条已发布动态查看详情
            </div>
          )}
        </main>

        <aside className="min-h-0 border-l border-border bg-surface xl:overflow-y-auto">
          {selected ? (
            <div className="p-4">
              <h2 className="font-semibold">互动与评论</h2>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {typeof selected.like_count === "number" && (
                  <Metric
                    icon={<Heart size={17} />}
                    label="点赞"
                    value={selected.like_count}
                  />
                )}
                {typeof selected.favorite_count === "number" && (
                  <Metric
                    icon={<Star size={17} />}
                    label="收藏"
                    value={selected.favorite_count}
                  />
                )}
                {(typeof selected.comment_count === "number" ||
                  comments.length > 0) && (
                  <Metric
                    icon={<ChatCircle size={17} />}
                    label="评论"
                    value={selected.comment_count ?? comments.length}
                  />
                )}
              </div>

              <div className="mt-5 border-t border-border pt-4">
                <h3 className="text-sm font-semibold">评论</h3>
                {commentsQuery.isLoading ? (
                  <p className="mt-3 text-xs text-text-muted">正在加载评论…</p>
                ) : comments.length ? (
                  <div className="mt-3 space-y-3">
                    {comments.map((item) => (
                      <div key={item.id} className="rounded-lg bg-subtle p-3">
                        <div className="flex items-center justify-between gap-2">
                          <strong className="text-xs">{item.creator_name}</strong>
                          {item.created_at && (
                            <span className="text-[10px] text-text-muted">
                              {formatMomentTime(item.created_at)}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs leading-5">{item.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-text-muted">暂无评论</p>
                )}
                <div className="mt-3">
                  <textarea
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    rows={3}
                    placeholder="添加创作者评论"
                    className="w-full resize-none rounded-lg border border-border bg-surface p-2.5 text-sm focus:border-primary"
                  />
                  <button
                    type="button"
                    disabled={!comment.trim() || commenting}
                    onClick={() => void sendComment()}
                    className="button-secondary control-compact mt-2 w-full"
                  >
                    {commenting && (
                      <SpinnerGap size={16} className="loading-spin" />
                    )}
                    {commenting ? "发送中…" : "发送评论"}
                  </button>
                </div>
              </div>

              <div className="mt-5 border-t border-border pt-4">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => setConfirmingDelete(true)}
                  className="button-secondary control-compact w-full border-rose-200 text-danger hover:border-danger hover:bg-rose-50 dark:border-rose-400/20 dark:hover:bg-rose-400/10"
                >
                  <Trash size={17} />
                  {deleting ? "正在删除…" : "删除动态"}
                </button>
                <p className="mt-2 text-center text-[11px] leading-5 text-text-muted">
                  删除后当前无法恢复，相关互动数据可能同时移除
                </p>
              </div>
            </div>
          ) : (
            <div className="grid min-h-64 place-items-center text-xs text-text-muted">
              暂无互动数据
            </div>
          )}
        </aside>
      </div>

      {confirmingDelete && selected && (
        <div
          className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/40 p-4 backdrop-blur-[2px]"
          role="presentation"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target && !deleting) {
              setConfirmingDelete(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-moment-title"
            className="w-full max-w-md rounded-xl border border-border bg-surface p-5 shadow-2xl"
          >
            <span className="grid size-10 place-items-center rounded-full bg-rose-50 text-danger dark:bg-rose-400/10">
              <Trash size={20} />
            </span>
            <h2 id="delete-moment-title" className="mt-4 text-lg font-bold">
              确定删除这条朋友圈？
            </h2>
            <p className="mt-2 text-sm leading-6 text-text-muted">
              删除后内容将从朋友圈移除，相关互动数据可能同时删除，当前无法恢复。
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                className="button-secondary"
                disabled={deleting}
                onClick={() => setConfirmingDelete(false)}
              >
                取消
              </button>
              <button
                type="button"
                className="button-danger"
                disabled={deleting}
                onClick={() => void removeSelected()}
              >
                {deleting && <SpinnerGap size={16} className="loading-spin" />}
                {deleting ? "正在删除…" : "确认删除"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function MomentDetail({
  moment,
  agent,
}: {
  moment: MomentItem;
  agent: Agent | undefined;
}) {
  const media = momentMediaUrl(moment);
  return (
    <article className="mx-auto max-w-3xl p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <h2 className="font-semibold">动态详情</h2>
          <p className="mt-1 text-xs text-text-muted">动态 #{moment.id}</p>
        </div>
        <span className="status-badge status-success">已发布</span>
      </div>
      <div className="mt-5 flex items-center gap-3">
        {agent ? (
          <AgentAvatar agent={agent} size={42} />
        ) : (
          <span className="grid size-10 place-items-center rounded-lg bg-primary-soft font-semibold text-primary">
            {initialFor(moment.agent_name)}
          </span>
        )}
        <div>
          <strong>{moment.agent_name}</strong>
          <p className="mt-0.5 text-xs text-text-muted">
            发布于 OyiiOyii · {formatMomentTime(moment.created_at)}
          </p>
        </div>
      </div>
      <p className="mt-5 whitespace-pre-wrap text-[15px] leading-7">
        {moment.content}
      </p>
      {media && (
        <div className="mt-4 overflow-hidden rounded-xl border border-border bg-subtle">
          {moment.video_urls.includes(media) ? (
            <video src={media} controls className="w-full" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={media}
              alt={`${moment.agent_name} 发布的动态图片`}
              className="aspect-[3/2] w-full object-cover"
            />
          )}
        </div>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-5 border-b border-border pb-4 text-sm text-text-muted">
        {typeof moment.like_count === "number" && (
          <span className="inline-flex items-center gap-1.5">
            <Heart size={17} />
            {moment.like_count} 点赞
          </span>
        )}
        {typeof moment.favorite_count === "number" && (
          <span className="inline-flex items-center gap-1.5">
            <Star size={17} />
            {moment.favorite_count} 收藏
          </span>
        )}
        {typeof moment.comment_count === "number" && (
          <span className="inline-flex items-center gap-1.5">
            <ChatCircle size={17} />
            {moment.comment_count} 评论
          </span>
        )}
      </div>
      <div className="pt-4">
        <h3 className="text-sm font-semibold">内容信息</h3>
        <dl className="mt-3 grid gap-3 rounded-lg bg-subtle p-4 text-sm sm:grid-cols-2">
          <InfoTerm label="内容来源" value="Agent 生成 / 人工确认" />
          <InfoTerm
            label="媒体"
            value={
              moment.image_urls.length
                ? `${moment.image_urls.length} 张图片`
                : moment.video_urls.length
                  ? `${moment.video_urls.length} 个视频`
                  : "纯文字"
            }
          />
        </dl>
      </div>
    </article>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-border p-2 text-center">
      <span className="mx-auto flex items-center justify-center text-primary">
        {icon}
      </span>
      <strong className="mt-1 block text-base">{value}</strong>
      <span className="text-[10px] text-text-muted">{label}</span>
    </div>
  );
}

function InfoTerm({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-text-muted">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}

function LoadingList() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex gap-3">
          <span className="skeleton size-12 shrink-0" />
          <span className="flex-1 space-y-2">
            <span className="skeleton block h-4 w-2/3" />
            <span className="skeleton block h-3 w-full" />
            <span className="skeleton block h-3 w-1/3" />
          </span>
        </div>
      ))}
    </div>
  );
}
