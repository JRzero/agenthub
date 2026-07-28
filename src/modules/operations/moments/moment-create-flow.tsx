"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CaretDown,
  Check,
  CheckCircle,
  ImageSquare,
  MagicWand,
  MagnifyingGlass,
  SpinnerGap,
  UploadSimple,
  WarningCircle,
} from "@phosphor-icons/react";
import { DATA_MODE } from "@/config/capabilities";
import { AgentAvatar } from "@/modules/agents/agent-avatar";
import type { Agent } from "@/modules/agents/types";
import { useAuth } from "@/modules/auth/auth-provider";
import { useWorkspace } from "@/modules/workspace/workspace-provider";
import {
  createMoment,
  getMomentDraft,
  uploadMomentImage,
} from "./api";
import type { MomentItem } from "./types";

interface UploadedImage {
  token: string;
  url: string;
  name: string;
}

export function getDefaultMomentAgentId(
  agents: Pick<Agent, "id" | "current_version_id">[],
  initialAgentId: number | null,
) {
  const initialAgent = agents.find(
    (agent) => agent.id === initialAgentId && agent.current_version_id,
  );
  return initialAgent?.id ?? agents.find((agent) => agent.current_version_id)?.id ?? null;
}

export function MomentCreateFlow({
  agents,
  initialAgentId,
  onExit,
  onPublished,
}: {
  agents: Agent[];
  initialAgentId: number | null;
  onExit: () => void;
  onPublished: (moment: MomentItem) => void;
}) {
  const { session } = useAuth();
  const { workspaceCode } = useWorkspace();
  const auth = { apiKey: session?.apiKey || "", workspaceCode };
  const [step, setStep] = useState<1 | 2>(1);
  const [agentId, setAgentId] = useState<number | null>(() =>
    getDefaultMomentAgentId(agents, initialAgentId),
  );
  const [agentPickerOpen, setAgentPickerOpen] = useState(false);
  const [agentQuery, setAgentQuery] = useState("");
  const [agentFilter, setAgentFilter] = useState<"available" | "all">(
    "available",
  );
  const [brief, setBrief] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [autoImage, setAutoImage] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");
  const [published, setPublished] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const agentPicker = useRef<HTMLDivElement>(null);
  const selectedAgent = agents.find((agent) => agent.id === agentId);
  const dirty = Boolean(content.trim() || brief.trim() || images.length);
  const availableAgentCount = agents.filter(
    (agent) => agent.current_version_id,
  ).length;
  const visibleAgents = useMemo(() => {
    const query = agentQuery.trim().toLocaleLowerCase();
    return agents.filter((agent) => {
      if (agentFilter === "available" && !agent.current_version_id) {
        return false;
      }
      if (!query) return true;
      return [agent.name, agent.code, agent.uuid].some((value) =>
        value.toLocaleLowerCase().includes(query),
      );
    });
  }, [agentFilter, agentQuery, agents]);

  useEffect(() => {
    if (!dirty || published) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, published]);

  useEffect(() => {
    const selectedIsAvailable = agents.some(
      (agent) => agent.id === agentId && agent.current_version_id,
    );
    if (!selectedIsAvailable) {
      setAgentId(getDefaultMomentAgentId(agents, initialAgentId));
    }
  }, [agentId, agents, initialAgentId]);

  useEffect(() => {
    if (!agentPickerOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (
        agentPicker.current &&
        !agentPicker.current.contains(event.target as Node)
      ) {
        setAgentPickerOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAgentPickerOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [agentPickerOpen]);

  const previewImage = useMemo(
    () =>
      images[0]?.url ||
      (DATA_MODE === "demo" && autoImage
        ? "/images/oyiioyii-moment-dinosaurs.png"
        : null),
    [autoImage, images],
  );

  function exit() {
    if (
      dirty &&
      !published &&
      !window.confirm("当前内容尚未发布，离开后将丢失。确定离开吗？")
    ) {
      return;
    }
    onExit();
  }

  async function generate() {
    if (!agentId) return;
    if (
      content.trim() &&
      !window.confirm("重新生成会替换当前临时正文，确定继续吗？")
    ) {
      return;
    }
    setGenerating(true);
    setError("");
    try {
      const result =
        DATA_MODE === "demo"
          ? {
              content:
                brief.trim() ||
                "今天认识了一位很厉害的朋友：三角龙！它头上的角可不是用来摘树叶的哦。你还想认识哪一种恐龙？",
              agent_name: selectedAgent?.name || "Agent",
            }
          : await getMomentDraft(auth, agentId);
      setContent(result.content);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "生成文案失败");
    } finally {
      setGenerating(false);
    }
  }

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      const next: UploadedImage[] = [];
      for (const file of Array.from(files).slice(0, 9 - images.length)) {
        if (DATA_MODE === "demo") {
          next.push({
            token: `demo-${file.name}-${Date.now()}`,
            url: URL.createObjectURL(file),
            name: file.name,
          });
        } else {
          const result = await uploadMomentImage(auth, file);
          next.push({
            token: result.token,
            url: result.url_800 || result.url_240,
            name: file.name,
          });
        }
      }
      setImages((current) => [...current, ...next]);
      if (next.length) setAutoImage(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "图片上传失败");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  async function publish() {
    if (!agentId || !selectedAgent || !content.trim()) return;
    setPublishing(true);
    setError("");
    try {
      const result =
        DATA_MODE === "demo"
          ? {
              id: Date.now(),
              agent_id: agentId,
              agent_name: selectedAgent.name,
              agent_avatar: selectedAgent.config?.metadata?.avatar,
              content: content.trim(),
              image_urls: previewImage ? [previewImage] : [],
              thumbnail_urls: previewImage ? [previewImage] : [],
              video_urls: [],
              created_at: new Date().toISOString(),
              like_count: 0,
              favorite_count: 0,
              comment_count: 0,
              comments: [],
            }
          : await createMoment(auth, agentId, {
              content: content.trim(),
              image_tokens: images.map((image) => image.token),
              auto_image: autoImage && !images.length,
            });
      setPublished(true);
      onPublished(result);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "发布动态失败");
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-150px)] bg-canvas">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface px-4 py-4 sm:px-6 lg:px-7">
        <div>
          <button
            type="button"
            onClick={exit}
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary"
          >
            <ArrowLeft size={16} />
            返回朋友圈管理
          </button>
          <div className="mt-2 flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">
              {step === 1 ? "新建动态" : "预览并发布"}
            </h2>
            <span className="status-badge status-neutral">未发布</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <StepNumber active={step === 1} done={step === 2} number={1} />
          <span className="hidden sm:inline">生成与编辑</span>
          <span className="h-px w-8 bg-border" />
          <StepNumber active={step === 2} number={2} />
          <span className="hidden sm:inline">预览并发布</span>
        </div>
      </div>

      {error && (
        <div className="mx-4 mt-4 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-danger dark:border-rose-400/20 dark:bg-rose-400/10 sm:mx-6 lg:mx-7">
          <WarningCircle size={18} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid min-h-[calc(100vh-250px)] lg:grid-cols-[minmax(0,1fr)_minmax(360px,440px)]">
        <div className="border-r border-border p-4 sm:p-6 lg:p-7">
          {step === 1 ? (
            <div className="mx-auto max-w-5xl space-y-6">
              <div className="grid gap-6 xl:grid-cols-[minmax(280px,0.78fr)_minmax(0,1.22fr)] xl:items-start">
                <section>
                <h3 className="text-base font-semibold">发布 Agent</h3>
                <p className="mt-1 text-sm text-text-muted">
                  使用 Agent 平台当前版本中的身份、表达方式和安全边界
                </p>
                <div ref={agentPicker} className="relative mt-3">
                  <button
                    type="button"
                    aria-expanded={agentPickerOpen}
                    aria-haspopup="listbox"
                    onClick={() => setAgentPickerOpen((open) => !open)}
                    className={`flex min-h-[62px] w-full items-center gap-3 rounded-lg border bg-surface px-3.5 py-2.5 text-left transition ${
                      agentPickerOpen
                        ? "border-primary ring-2 ring-primary/10"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    {selectedAgent ? (
                      <AgentAvatar agent={selectedAgent} size={40} />
                    ) : (
                      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-subtle text-text-muted">
                        —
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <strong className="block truncate">
                        {selectedAgent?.name || "选择一个可发布的 Agent"}
                      </strong>
                      <span className="mt-0.5 block text-xs text-text-muted">
                        {selectedAgent?.current_version_id
                          ? `平台当前版本 v${selectedAgent.version}`
                          : `${availableAgentCount} 个 Agent 可发布`}
                      </span>
                    </span>
                    <span className="mr-1 text-xs text-text-muted">
                      更换 Agent
                    </span>
                    <CaretDown
                      size={16}
                      className={`shrink-0 text-text-muted transition-transform ${
                        agentPickerOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {agentPickerOpen && (
                    <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-xl border border-border bg-surface shadow-xl">
                      <div className="border-b border-border p-3">
                        <label className="relative block">
                          <span className="sr-only">搜索 Agent</span>
                          <MagnifyingGlass
                            size={17}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                          />
                          <input
                            autoFocus
                            value={agentQuery}
                            onChange={(event) =>
                              setAgentQuery(event.target.value)
                            }
                            placeholder="搜索 Agent 名称或编码"
                            className="h-10 w-full rounded-lg border border-border bg-canvas pl-9 pr-3 text-sm outline-none transition focus:border-primary"
                          />
                        </label>
                        <div
                          className="mt-3 flex items-center gap-5 text-sm"
                          role="tablist"
                          aria-label="Agent 可用状态"
                        >
                          <button
                            type="button"
                            role="tab"
                            aria-selected={agentFilter === "available"}
                            onClick={() => setAgentFilter("available")}
                            className={`relative pb-2 font-medium ${
                              agentFilter === "available"
                                ? "text-primary after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary"
                                : "text-text-muted hover:text-text-strong"
                            }`}
                          >
                            可发布 {availableAgentCount}
                          </button>
                          <button
                            type="button"
                            role="tab"
                            aria-selected={agentFilter === "all"}
                            onClick={() => setAgentFilter("all")}
                            className={`relative pb-2 font-medium ${
                              agentFilter === "all"
                                ? "text-primary after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary"
                                : "text-text-muted hover:text-text-strong"
                            }`}
                          >
                            全部 {agents.length}
                          </button>
                        </div>
                      </div>

                      <div
                        role="listbox"
                        aria-label="选择发布 Agent"
                        className="max-h-72 overflow-y-auto p-1.5"
                      >
                        {visibleAgents.length ? (
                          visibleAgents.map((agent) => {
                            const available = Boolean(
                              agent.current_version_id,
                            );
                            const selected = agent.id === agentId;
                            return (
                              <button
                                key={agent.id}
                                type="button"
                                role="option"
                                aria-selected={selected}
                                aria-disabled={!available}
                                disabled={!available}
                                onClick={() => {
                                  setAgentId(agent.id);
                                  setAgentPickerOpen(false);
                                  setAgentQuery("");
                                }}
                                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                                  selected
                                    ? "bg-primary-soft"
                                    : available
                                      ? "hover:bg-subtle"
                                      : "cursor-not-allowed opacity-55"
                                }`}
                              >
                                <AgentAvatar agent={agent} size={36} />
                                <span className="min-w-0 flex-1">
                                  <strong className="block truncate text-sm">
                                    {agent.name}
                                  </strong>
                                  <span className="mt-0.5 block truncate text-xs text-text-muted">
                                    {available
                                      ? `平台当前版本 v${agent.version}`
                                      : "尚未发布 · 需先发布 Agent 版本"}
                                  </span>
                                </span>
                                {selected && (
                                  <CheckCircle
                                    size={18}
                                    weight="fill"
                                    className="shrink-0 text-primary"
                                  />
                                )}
                              </button>
                            );
                          })
                        ) : (
                          <div className="px-4 py-8 text-center">
                            <p className="text-sm font-medium">
                              没有找到匹配的 Agent
                            </p>
                            <p className="mt-1 text-xs text-text-muted">
                              尝试更换关键词或查看全部 Agent
                            </p>
                          </div>
                        )}
                      </div>
                      {agentFilter === "all" && (
                        <p className="border-t border-border px-4 py-2.5 text-xs text-text-muted">
                          尚未发布的 Agent 需要先发布平台版本后才能用于动态。
                        </p>
                      )}
                    </div>
                  )}
                </div>
                </section>

                <section className="border-t border-border pt-5 xl:border-t-0 xl:pt-0">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold">生成与编辑正文</h3>
                    <p className="mt-1 text-sm text-text-muted">
                      AI 候选只保存在当前页面，离开后不会保留
                    </p>
                  </div>
                  <button
                    type="button"
                    className="button-secondary min-h-9 px-3"
                    disabled={!agentId || generating}
                    onClick={() => void generate()}
                  >
                    {generating ? (
                      <SpinnerGap size={17} className="loading-spin" />
                    ) : (
                      <MagicWand size={17} />
                    )}
                    {content ? "重新生成" : "生成文案候选"}
                  </button>
                </div>
                <label className="mt-4 block">
                  <span className="text-sm font-medium">创作主题（可选）</span>
                  <textarea
                    value={brief}
                    onChange={(event) => setBrief(event.target.value)}
                    rows={3}
                    maxLength={500}
                    placeholder="记录本次动态想表达的主题；当前生成接口会依据 Agent 人设生成候选"
                    className="mt-2 w-full resize-none rounded-lg border border-border bg-surface p-3 leading-6 focus:border-primary"
                  />
                </label>
                <label className="mt-4 block">
                  <span className="flex items-center justify-between gap-3 text-sm font-medium">
                    动态正文
                    <span className="text-xs font-normal text-text-muted">
                      {content.length}/500
                    </span>
                  </span>
                  <textarea
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    rows={7}
                    maxLength={500}
                    placeholder="手动填写正文，或先生成一份临时候选"
                    className="mt-2 w-full resize-none rounded-lg border border-border bg-surface p-3 text-[15px] leading-7 focus:border-primary"
                  />
                </label>
                </section>
              </div>

              <section className="border-t border-border pt-6">
                <h3 className="text-base font-semibold">动态图片</h3>
                <p className="mt-1 text-sm text-text-muted">
                  上传现有图片，或在发布时请求自动生成图片
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className={`button-secondary min-h-9 px-3 ${
                      autoImage ? "border-primary bg-primary-soft text-primary" : ""
                    }`}
                    onClick={() => {
                      setAutoImage(true);
                      setImages([]);
                    }}
                  >
                    <MagicWand size={17} />
                    发布时自动生成
                  </button>
                  <button
                    type="button"
                    className="button-secondary min-h-9 px-3"
                    disabled={uploading || images.length >= 9}
                    onClick={() => fileInput.current?.click()}
                  >
                    {uploading ? (
                      <SpinnerGap size={17} className="loading-spin" />
                    ) : (
                      <UploadSimple size={17} />
                    )}
                    上传图片
                  </button>
                  <input
                    ref={fileInput}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(event) => void upload(event.target.files)}
                  />
                </div>
                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {images.map((image) => (
                      <div
                        key={image.token}
                        className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-subtle"
                      >
                        {/* Blob previews and backend URLs are intentionally rendered without optimization. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image.url}
                          alt={image.name}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          className="absolute right-1.5 top-1.5 rounded bg-slate-950/65 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100"
                          onClick={() =>
                            setImages((current) =>
                              current.filter((item) => item.token !== image.token),
                            )
                          }
                        >
                          移除
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <div className="flex justify-end border-t border-border pt-5">
                <button
                  type="button"
                  className="button-primary"
                  disabled={!agentId || !content.trim()}
                  onClick={() => setStep(2)}
                >
                  预览动态
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-5">
              <div className="flex items-center gap-2 text-success">
                <CheckCircle size={20} weight="fill" />
                <strong>内容已准备完成，请确认后发布</strong>
              </div>
              <section className="panel p-5">
                <label className="block">
                  <span className="flex items-center justify-between text-sm font-medium">
                    最终正文
                    <span className="text-xs font-normal text-text-muted">
                      {content.length}/500
                    </span>
                  </span>
                  <textarea
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    rows={8}
                    maxLength={500}
                    className="mt-3 w-full resize-none rounded-lg border border-border bg-surface p-3 text-[15px] leading-7 focus:border-primary"
                  />
                </label>
              </section>
              <section className="panel p-5">
                <h3 className="font-semibold">发布检查</h3>
                <div className="mt-4 divide-y divide-border rounded-lg border border-border">
                  <CheckRow label="Agent 身份" value={selectedAgent?.name || "未选择"} />
                  <CheckRow
                    label="正文内容"
                    value={content.trim() ? "已填写" : "缺少正文"}
                  />
                  <CheckRow
                    label="图片"
                    value={
                      images.length
                        ? `已上传 ${images.length} 张`
                        : autoImage
                          ? "发布时自动生成"
                          : "纯文字动态"
                    }
                  />
                  <CheckRow label="发布端" value="OyiiOyii" />
                </div>
              </section>
              <div className="flex flex-wrap justify-between gap-3 border-t border-border pt-5">
                <button
                  type="button"
                  className="button-secondary"
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft size={17} />
                  返回编辑
                </button>
                <button
                  type="button"
                  className="button-primary min-w-36"
                  disabled={publishing || !content.trim()}
                  onClick={() => void publish()}
                >
                  {publishing ? (
                    <SpinnerGap size={17} className="loading-spin" />
                  ) : (
                    <Check size={17} />
                  )}
                  {publishing ? "正在发布…" : "发布动态"}
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="bg-surface p-4 sm:p-6">
          <div className="sticky top-4">
            <h3 className="text-base font-semibold">OyiiOyii 预览</h3>
            <p className="mt-1 text-xs text-text-muted">
              {step === 1 ? "发布前预览" : "确认发布效果"}
            </p>
            <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
              <div className="flex items-center gap-3 px-4 pt-4">
                {selectedAgent ? (
                  <AgentAvatar agent={selectedAgent} size={38} />
                ) : (
                  <span className="size-[38px] rounded-md bg-subtle" />
                )}
                <div>
                  <strong>{selectedAgent?.name || "选择 Agent"}</strong>
                  <p className="mt-0.5 text-xs text-text-muted">刚刚 · OyiiOyii</p>
                </div>
              </div>
              <div className="px-4 pb-4 pt-3">
                {content.trim() ? (
                  <p className="whitespace-pre-wrap text-[15px] leading-7">
                    {content}
                  </p>
                ) : (
                  <p className="py-8 text-center text-sm text-text-muted">
                    生成或填写正文后在这里预览
                  </p>
                )}
                {previewImage ? (
                  <div className="mt-3 overflow-hidden rounded-lg bg-subtle">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewImage}
                      alt="动态预览"
                      className="aspect-[3/2] w-full object-cover"
                    />
                  </div>
                ) : (
                  content.trim() && (
                    <div className="mt-3 flex aspect-[3/2] items-center justify-center rounded-lg border border-dashed border-border bg-subtle text-text-muted">
                      <ImageSquare size={32} />
                    </div>
                  )
                )}
              </div>
            </div>
            <p className="mt-3 text-center text-xs leading-5 text-text-muted">
              未点击“发布动态”前，不会创建后端 Moment 记录。
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function StepNumber({
  number,
  active,
  done = false,
}: {
  number: number;
  active: boolean;
  done?: boolean;
}) {
  return (
    <span
      className={`grid size-7 place-items-center rounded-full text-xs font-semibold ${
        active || done
          ? "bg-primary text-white"
          : "border border-border bg-surface text-text-muted"
      }`}
    >
      {done ? <Check size={14} /> : number}
    </span>
  );
}

function CheckRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-3 py-3 text-sm">
      <span className="flex items-center gap-2">
        <CheckCircle size={17} weight="fill" className="text-success" />
        {label}
      </span>
      <span className="text-right text-text-muted">{value}</span>
    </div>
  );
}
