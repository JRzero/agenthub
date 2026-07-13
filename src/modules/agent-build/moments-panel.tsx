"use client";

import { useState } from "react";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChatCircle, Trash } from "@phosphor-icons/react";
import { DATA_MODE } from "@/config/capabilities";
import { useAuth } from "@/modules/auth/auth-provider";
import { addMomentComment, deleteMoment, listMoments, type MomentItem } from "./moments-api";
import { MomentComposer } from "./moment-composer";
import { MomentSchedulePanel } from "./moment-schedule-panel";

const DEMO_MOMENTS: MomentItem[] = [
  { id: 1, agent_id: 32, agent_name: "林月", content: "今天想分享一个小方法：先照顾好最紧张的那部分，再慢慢处理剩下的问题。", image_urls: [], thumbnail_urls: [], video_urls: [], created_at: "2026-07-10T10:24:00+08:00", like_count: 18, comments: [{ id: 1, creator_name: "李然", content: "[创作者评论] 语气很好，继续保持。", created_at: "2026-07-10T10:30:00+08:00" }] },
];

export function MomentsPanel({ agentId, agentName }: { agentId: number; agentName: string }) {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const demo = DATA_MODE === "demo";
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const query = useQuery({ queryKey: ["agent-moments", agentId, demo], queryFn: () => demo ? Promise.resolve(DEMO_MOMENTS) : listMoments(session?.apiKey || "", agentId), enabled: Boolean(session?.apiKey) });
  const moments = query.data || [];
  const setMoments = (next: MomentItem[]) => queryClient.setQueryData(["agent-moments", agentId, demo], next);
  const remove = async (momentId: number) => {
    if (!session?.apiKey || !window.confirm("确定删除这条朋友圈？")) return;
    setBusy(`delete-${momentId}`); setMessage("");
    try { if (!demo) await deleteMoment(session.apiKey, agentId, momentId); setMoments(moments.filter((item) => item.id !== momentId)); }
    catch (error) { setMessage(error instanceof Error ? error.message : "删除失败"); }
    finally { setBusy(""); }
  };
  const comment = async (momentId: number) => {
    const value = commentInputs[momentId]?.trim();
    if (!session?.apiKey || !value) return;
    setBusy(`comment-${momentId}`); setMessage("");
    try {
      const content = value.startsWith("[创作者评论]") ? value : `[创作者评论] ${value}`;
      const result = demo ? { id: Date.now(), creator_name: "李然", content, created_at: new Date().toISOString() } : await addMomentComment(session.apiKey, momentId, content);
      setMoments(moments.map((item) => item.id === momentId ? { ...item, comments: [...(item.comments || []), result] } : item));
      setCommentInputs((current) => ({ ...current, [momentId]: "" }));
    } catch (error) { setMessage(error instanceof Error ? error.message : "评论失败"); }
    finally { setBusy(""); }
  };

  return <div className="space-y-6"><MomentComposer agentId={agentId} agentName={agentName} onPublished={(moment) => setMoments([moment, ...moments])} /><MomentSchedulePanel agentId={agentId} /><section><h3 className="mb-3 text-lg font-semibold">已发布朋友圈</h3><div className="space-y-4">{moments.map((moment) => <article key={moment.id} className="rounded-xl border border-border bg-surface p-5"><div className="flex items-start justify-between gap-3"><div><strong>{moment.agent_name}</strong><p className="mt-1 text-xs text-text-muted">{new Date(moment.created_at).toLocaleString("zh-CN")}</p></div><button type="button" onClick={() => void remove(moment.id)} disabled={busy === `delete-${moment.id}`} className="rounded p-2 text-text-muted hover:bg-danger/5 hover:text-danger" aria-label={`删除朋友圈 ${moment.id}`}><Trash size={18} /></button></div><p className="mt-4 whitespace-pre-wrap leading-7">{moment.content}</p>{moment.thumbnail_urls.length > 0 && <div className="mt-4 grid grid-cols-3 gap-2">{moment.thumbnail_urls.map((url) => <div key={url} className="relative aspect-square overflow-hidden rounded-lg"><Image src={url} alt="朋友圈图片" fill unoptimized sizes="180px" className="object-cover" /></div>)}</div>}<div className="mt-4 text-xs text-text-muted">点赞 {moment.like_count || 0}</div>{moment.comments?.map((item) => <div key={item.id} className="mt-3 rounded-lg bg-subtle px-3 py-2 text-sm"><strong>{item.creator_name}</strong>：{item.content}</div>)}<div className="mt-3 flex gap-2"><input value={commentInputs[moment.id] || ""} onChange={(event) => setCommentInputs((current) => ({ ...current, [moment.id]: event.target.value }))} placeholder="添加创作者评论" className="h-10 min-w-0 flex-1 rounded-md border border-border px-3" /><button type="button" onClick={() => void comment(moment.id)} disabled={!commentInputs[moment.id]?.trim() || busy === `comment-${moment.id}`} className="button-secondary"><ChatCircle size={17} />发送</button></div></article>)}{!moments.length && <div className="rounded-xl border border-dashed border-border p-10 text-center text-text-muted">暂无朋友圈</div>}</div></section>{message && <p className="text-sm text-text-muted">{message}</p>}</div>;
}
