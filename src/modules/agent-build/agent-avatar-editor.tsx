"use client";

import { useEffect, useRef, useState } from "react";
import { ImageSquare, Trash, UploadSimple } from "@phosphor-icons/react";
import { DATA_MODE } from "@/config/capabilities";
import { AgentAvatar } from "@/modules/agents/agent-avatar";
import type { Agent } from "@/modules/agents/types";
import { useAuth } from "@/modules/auth/auth-provider";
import { deleteAgentAvatar, uploadAgentAvatar } from "./advanced-api";

function drawCrop(canvas: HTMLCanvasElement, image: HTMLImageElement, zoom: number, offsetX: number, offsetY: number) {
  const context = canvas.getContext("2d");
  if (!context) return;
  const size = canvas.width;
  const base = Math.max(size / image.naturalWidth, size / image.naturalHeight);
  const scale = base * zoom;
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  const rangeX = Math.max(0, (width - size) / 2);
  const rangeY = Math.max(0, (height - size) / 2);
  const x = (size - width) / 2 + rangeX * offsetX;
  const y = (size - height) / 2 + rangeY * offsetY;
  context.clearRect(0, 0, size, size);
  context.drawImage(image, x, y, width, height);
}

export function AgentAvatarEditor({ agent, onUpdated }: { agent: Agent; onUpdated: (agent: Agent) => void }) {
  const { session } = useAuth();
  const demo = DATA_MODE === "demo";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [source, setSource] = useState("");
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!source) { setImage(null); return; }
    const next = new window.Image();
    next.onload = () => setImage(next);
    next.src = source;
  }, [source]);

  useEffect(() => {
    if (canvasRef.current && image) drawCrop(canvasRef.current, image, zoom, offsetX, offsetY);
  }, [image, offsetX, offsetY, zoom]);

  const choose = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setMessage("请选择图片文件");
    if (file.size > 20 * 1024 * 1024) return setMessage("图片不能超过 20MB");
    if (source) URL.revokeObjectURL(source);
    setSource(URL.createObjectURL(file));
    setZoom(1); setOffsetX(0); setOffsetY(0); setMessage("");
  };

  const save = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !session?.apiKey) return;
    setBusy(true); setMessage("");
    try {
      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error("无法生成裁剪图片")), "image/jpeg", 0.9));
      if (demo) {
        const avatar = canvas.toDataURL("image/jpeg", 0.9);
        onUpdated({ ...agent, config: { ...agent.config, metadata: { ...agent.config?.metadata, avatar } }, updated_at: new Date().toISOString() });
      } else {
        onUpdated(await uploadAgentAvatar(session.apiKey, agent.id, blob));
      }
      setSource(""); setMessage(demo ? "演示头像已更新" : "头像已更新");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "头像上传失败");
    } finally { setBusy(false); }
  };

  const remove = async () => {
    if (!session?.apiKey) return;
    setBusy(true); setMessage("");
    try {
      if (demo) onUpdated({ ...agent, config: { ...agent.config, metadata: { ...agent.config?.metadata, avatar: undefined } } });
      else onUpdated(await deleteAgentAvatar(session.apiKey, agent.id));
      setSource(""); setMessage("头像已移除");
    } catch (error) { setMessage(error instanceof Error ? error.message : "移除头像失败"); }
    finally { setBusy(false); }
  };

  return <div className="space-y-5"><div className="flex flex-wrap items-center gap-5"><AgentAvatar agent={agent} size={96} className="rounded-xl" /><div><h3 className="font-semibold">当前 Agent 头像</h3><p className="mt-1 text-sm text-text-muted">上传后先进行正方形裁剪，再写入现有头像接口。</p><div className="mt-3 flex gap-2"><label className="button-secondary cursor-pointer"><UploadSimple size={17} />选择图片<input type="file" accept="image/*" className="sr-only" onChange={(event) => choose(event.target.files?.[0])} /></label><button type="button" className="button-secondary text-danger" onClick={() => void remove()} disabled={busy}><Trash size={17} />移除头像</button></div></div></div>{source && <div className="grid gap-5 md:grid-cols-[280px_minmax(0,1fr)]"><div className="overflow-hidden rounded-xl border border-border bg-subtle p-3"><canvas ref={canvasRef} width={512} height={512} className="aspect-square w-full rounded-lg" role="img" aria-label="头像裁剪预览" /></div><div className="space-y-4"><Range label="缩放" min={1} max={3} step={0.05} value={zoom} onChange={setZoom} /><Range label="水平位置" min={-1} max={1} step={0.05} value={offsetX} onChange={setOffsetX} /><Range label="垂直位置" min={-1} max={1} step={0.05} value={offsetY} onChange={setOffsetY} /><button type="button" className="button-primary" onClick={() => void save()} disabled={busy}><ImageSquare size={17} />{busy ? "保存中…" : "接受裁剪并保存"}</button></div></div>}{message && <p className="rounded-md bg-subtle px-4 py-3 text-sm text-text-muted">{message}</p>}</div>;
}

function Range({ label, min, max, step, value, onChange }: { label: string; min: number; max: number; step: number; value: number; onChange: (value: number) => void }) {
  return <label className="block text-sm font-medium">{label}<input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-2 w-full accent-primary" /></label>;
}
