"use client";

import { useState } from "react";
import { Check, Copy, QrCode, X } from "@phosphor-icons/react";
import { QRCodeSVG } from "qrcode.react";

async function copyText(value: string): Promise<void> {
  if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(value); return; }
  const textarea = document.createElement("textarea"); textarea.value = value; textarea.style.position = "fixed"; textarea.style.opacity = "0";
  document.body.appendChild(textarea); textarea.select(); document.execCommand("copy"); textarea.remove();
}

export function ShareQrButton({ url, label }: { url: string; label: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  return <>
    <button type="button" onClick={(event) => { event.stopPropagation(); setOpen(true); }} className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"><QrCode size={14} />分享二维码</button>
    {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4" onMouseDown={() => setOpen(false)}><section role="dialog" aria-modal="true" aria-labelledby="share-qr-title" onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-surface p-5 shadow-2xl"><header className="flex items-start justify-between gap-3"><div><h2 id="share-qr-title" className="font-semibold">{label} 分享二维码</h2><p className="mt-1 text-xs text-text-muted">二维码在当前浏览器本地生成</p></div><button type="button" onClick={() => setOpen(false)} aria-label="关闭分享二维码" className="rounded-md p-2 hover:bg-subtle"><X size={18} /></button></header><div className="mx-auto mt-5 w-fit rounded-xl bg-white p-4"><QRCodeSVG value={url} size={224} level="M" marginSize={2} title={`${label} 分享二维码`} /></div><p className="mt-4 break-all rounded-lg bg-subtle px-3 py-2 text-xs leading-5 text-text-muted">{url}</p><button type="button" onClick={() => void copyText(url).then(() => { setCopied(true); window.setTimeout(() => setCopied(false), 1800); })} className="button-primary mt-4 w-full">{copied ? <Check size={17} /> : <Copy size={17} />}{copied ? "链接已复制" : "复制分享链接"}</button></section></div>}
  </>;
}
