import Image from "next/image";
import { ArrowSquareOut, File } from "@phosphor-icons/react";
import { getApiBaseUrl } from "@/shared/api/http-client";
import { MarkdownContent } from "./markdown-content";
import type { RuntimeAttachment } from "./types";

export function resolveRuntimeUrl(value?: string): string | undefined {
  if (!value) return undefined;
  return value.startsWith("/") ? `${getApiBaseUrl()}${value}` : value;
}

function AttachmentList({ attachments }: { attachments: RuntimeAttachment[] }) {
  const images = attachments.filter((item) => item.type === "image");
  const files = attachments.filter((item) => item.type !== "image");
  return <div className="mt-3 space-y-2">
    {images.map((attachment, index) => { const src = resolveRuntimeUrl(attachment.preview_url || attachment.download_url || attachment.url); return src ? <a key={`${attachment.token || src}-${index}`} href={resolveRuntimeUrl(attachment.download_url) || src} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-lg border border-border"><Image src={src} alt={attachment.name || "消息图片"} width={420} height={240} unoptimized className="max-h-60 w-full object-cover" /></a> : null; })}
    {files.map((attachment, index) => <a key={`${attachment.token || attachment.name}-${index}`} href={resolveRuntimeUrl(attachment.download_url || attachment.url) || "#"} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg border border-border bg-subtle px-3 py-2 text-xs"><File size={16} /><span className="min-w-0 flex-1 truncate">{attachment.name || "下载附件"}</span><ArrowSquareOut size={14} /></a>)}
  </div>;
}

export function RuntimeMessageContent({ content, attachments = [], audioUrl, docxUrl, imageUrl }: { content: string; attachments?: RuntimeAttachment[]; audioUrl?: string; docxUrl?: string; imageUrl?: string }) {
  const resolvedAudio = resolveRuntimeUrl(audioUrl);
  const resolvedImage = resolveRuntimeUrl(imageUrl);
  const resolvedDocx = resolveRuntimeUrl(docxUrl);
  return <>
    {content && <MarkdownContent content={content} />}
    {resolvedAudio && <audio controls preload="metadata" src={resolvedAudio} className="mt-3 w-full" aria-label="Agent 语音回复" />}
    {resolvedImage && <a href={resolvedImage} target="_blank" rel="noreferrer" className="mt-3 block overflow-hidden rounded-lg border border-border"><Image src={resolvedImage} alt="Agent 生成图片" width={420} height={240} unoptimized className="max-h-60 w-full object-cover" /></a>}
    {resolvedDocx && <a href={resolvedDocx} target="_blank" rel="noreferrer" className="mt-3 flex items-center gap-2 rounded-lg border border-border bg-subtle px-3 py-2 text-xs"><File size={16} />下载 Word 文档<ArrowSquareOut size={14} /></a>}
    {!!attachments.length && <AttachmentList attachments={attachments} />}
  </>;
}
