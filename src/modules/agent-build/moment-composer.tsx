"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageSquare, MagicWand, PaperPlaneTilt, X } from "@phosphor-icons/react";
import { DATA_MODE } from "@/config/capabilities";
import { useAuth } from "@/modules/auth/auth-provider";
import { createMoment, getMomentDraft, uploadMomentImage, type MomentItem } from "./moments-api";

interface UploadItem { token: string; url: string }

export function MomentComposer({ agentId, agentName, onPublished }: { agentId: number; agentName: string; onPublished: (moment: MomentItem) => void }) {
  const { session } = useAuth();
  const demo = DATA_MODE === "demo";
  const [content, setContent] = useState("");
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [autoImage, setAutoImage] = useState(false);
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");

  const draft = async () => {
    if (!session?.apiKey) return;
    setBusy("draft"); setMessage("");
    try { setContent((demo ? { content: "今天想和大家分享一个小发现：把复杂的问题拆小一点，答案会慢慢出现。" } : await getMomentDraft(session.apiKey, agentId)).content); }
    catch (error) { setMessage(error instanceof Error ? error.message : "草稿生成失败"); }
    finally { setBusy(""); }
  };
  const upload = async (files: FileList | null) => {
    if (!files || !session?.apiKey) return;
    setBusy("upload"); setMessage("");
    try {
      const next: UploadItem[] = [];
      for (const file of Array.from(files).slice(0, Math.max(0, 9 - uploads.length))) {
        if (demo) next.push({ token: `demo-${Date.now()}-${file.name}`, url: URL.createObjectURL(file) });
        else { const result = await uploadMomentImage(session.apiKey, file); next.push({ token: result.token, url: result.url_240 || result.url_800 }); }
      }
      setUploads((current) => [...current, ...next]);
    } catch (error) { setMessage(error instanceof Error ? error.message : "图片上传失败"); }
    finally { setBusy(""); }
  };
  const publish = async () => {
    if (!session?.apiKey || !content.trim()) return;
    setBusy("publish"); setMessage("");
    try {
      const result = demo ? { id: Date.now(), agent_id: agentId, agent_name: agentName, content: content.trim(), image_urls: uploads.map((item) => item.url), thumbnail_urls: uploads.map((item) => item.url), video_urls: [], created_at: new Date().toISOString(), comments: [] } : await createMoment(session.apiKey, agentId, { content: content.trim(), image_tokens: uploads.map((item) => item.token), auto_image: autoImage });
      onPublished(result); setContent(""); setUploads([]); setAutoImage(false); setMessage("朋友圈已发布");
    } catch (error) { setMessage(error instanceof Error ? error.message : "发布失败"); }
    finally { setBusy(""); }
  };

  return (
    <section className="rounded-xl border border-border p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold">发布朋友圈</h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-text-muted">
            内容将以当前 Agent 的身份发布。
          </p>
        </div>
        <button type="button" onClick={() => void draft()} disabled={Boolean(busy)} className="button-secondary w-full shrink-0 whitespace-nowrap sm:w-auto">
          <MagicWand size={17} />AI 草稿
        </button>
      </div>

      <textarea value={content} onChange={(event) => setContent(event.target.value)} rows={5} placeholder="输入朋友圈内容" className="mt-5 w-full resize-y rounded-lg border border-border p-3 leading-6" />

      {uploads.length > 0 && <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">{uploads.map((item) => <div key={item.token} className="relative aspect-square overflow-hidden rounded-lg border border-border"><Image src={item.url} alt="待发布图片" fill unoptimized sizes="120px" className="object-cover" /><button type="button" onClick={() => setUploads((current) => current.filter((uploadItem) => uploadItem.token !== item.token))} className="absolute right-1 top-1 rounded-full bg-slate-950/70 p-1 text-white" aria-label="移除待发布图片"><X size={13} /></button></div>)}</div>}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="button-secondary w-full cursor-pointer whitespace-nowrap sm:w-auto"><ImageSquare size={17} />{busy === "upload" ? "上传中…" : "添加图片"}<input type="file" accept="image/*" multiple className="sr-only" onChange={(event) => void upload(event.target.files)} /></label>
        <label className="flex items-center gap-2 text-sm text-text-muted"><input type="checkbox" checked={autoImage} onChange={(event) => setAutoImage(event.target.checked)} className="size-4 accent-primary" />无图片时自动配图</label>
        <button type="button" onClick={() => void publish()} disabled={!content.trim() || Boolean(busy)} className="button-primary w-full whitespace-nowrap sm:ml-auto sm:w-auto"><PaperPlaneTilt size={17} />{busy === "publish" ? "发布中…" : "发布"}</button>
      </div>

      {message && <p className="mt-3 text-sm text-text-muted">{message}</p>}
    </section>
  );
}
