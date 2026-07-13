"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Camera, Check, Trash, X } from "@phosphor-icons/react";

function drawCrop(canvas: HTMLCanvasElement, image: HTMLImageElement, zoom: number, offsetX: number, offsetY: number) {
  const context = canvas.getContext("2d"); if (!context) return;
  const size = canvas.width; const base = Math.max(size / image.naturalWidth, size / image.naturalHeight); const scale = base * zoom;
  const width = image.naturalWidth * scale; const height = image.naturalHeight * scale;
  const rangeX = Math.max(0, (width - size) / 2); const rangeY = Math.max(0, (height - size) / 2);
  context.clearRect(0, 0, size, size);
  context.drawImage(image, (size - width) / 2 + rangeX * offsetX, (size - height) / 2 + rangeY * offsetY, width, height);
}

export function CreatorAvatarCropEditor({ avatar, fallback, onUpload, onRemove }: { avatar: string | null; fallback: string; onUpload: (file?: File) => void; onRemove: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [source, setSource] = useState("");
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!source) { setImage(null); return; }
    const next = new window.Image(); next.onload = () => setImage(next); next.src = source;
    return () => URL.revokeObjectURL(source);
  }, [source]);
  useEffect(() => { if (canvasRef.current && image) drawCrop(canvasRef.current, image, zoom, offsetX, offsetY); }, [image, offsetX, offsetY, zoom]);

  function choose(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setMessage("请选择图片文件"); return; }
    if (file.size > 20 * 1024 * 1024) { setMessage("图片不能超过 20MB"); return; }
    setSource(URL.createObjectURL(file)); setZoom(1); setOffsetX(0); setOffsetY(0); setMessage("");
  }

  async function save() {
    const canvas = canvasRef.current; if (!canvas) return;
    setBusy(true); setMessage("");
    try {
      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error("无法生成裁剪图片")), "image/jpeg", 0.9));
      onUpload(new File([blob], "creator-avatar.jpg", { type: "image/jpeg" }));
      setSource(""); setMessage("已生成 512 × 512 裁剪头像");
    } catch (error) { setMessage(error instanceof Error ? error.message : "裁剪失败"); }
    finally { setBusy(false); }
  }

  return <div className="mt-6 space-y-5">
    <div className="flex flex-wrap items-center gap-5"><div className="relative grid size-24 place-items-center overflow-hidden rounded-2xl border border-border bg-primary-soft text-2xl font-semibold text-primary">{avatar ? <Image src={avatar} alt="Creator 头像" fill unoptimized sizes="96px" className="object-cover" /> : fallback}</div><div><p className="text-sm text-text-muted">选择图片后先裁剪为正方形，再上传到 Creator 头像接口。</p><div className="mt-3 flex flex-wrap gap-2"><label className="button-secondary cursor-pointer"><Camera size={18} />选择图片<input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(event) => { choose(event.target.files?.[0]); event.currentTarget.value = ""; }} /></label><button type="button" className="button-secondary text-danger" onClick={() => { if (window.confirm("移除当前 Creator 头像？")) onRemove(); }}><Trash size={18} />移除</button></div></div></div>
    {source && <div className="grid gap-5 rounded-xl border border-border bg-subtle p-4 md:grid-cols-[280px_minmax(0,1fr)]"><canvas ref={canvasRef} width={512} height={512} className="aspect-square w-full rounded-lg bg-surface" role="img" aria-label="Creator 头像裁剪预览" /><div className="space-y-4"><Range label="缩放" min={1} max={3} value={zoom} onChange={setZoom} /><Range label="水平位置" min={-1} max={1} value={offsetX} onChange={setOffsetX} /><Range label="垂直位置" min={-1} max={1} value={offsetY} onChange={setOffsetY} /><div className="flex gap-2"><button type="button" onClick={() => setSource("")} className="button-secondary"><X size={17} />取消</button><button type="button" onClick={() => void save()} disabled={busy || !image} className="button-primary"><Check size={17} />{busy ? "生成中…" : "接受裁剪并上传"}</button></div></div></div>}
    {message && <p className="rounded-md bg-subtle px-4 py-3 text-sm text-text-muted">{message}</p>}
  </div>;
}

function Range({ label, min, max, value, onChange }: { label: string; min: number; max: number; value: number; onChange: (value: number) => void }) {
  return <label className="block text-sm font-medium">{label}<input type="range" min={min} max={max} step={0.05} value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-2 w-full accent-primary" /></label>;
}
