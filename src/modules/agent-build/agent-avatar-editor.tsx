"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle, FolderOpen, ImageSquare, MagicWand, Trash, UploadSimple } from "@phosphor-icons/react";
import { DATA_MODE, type CapabilitySource } from "@/config/capabilities";
import { AgentAvatar } from "@/modules/agents/agent-avatar";
import type { Agent } from "@/modules/agents/types";
import { useAuth } from "@/modules/auth/auth-provider";
import { SourceBadge } from "@/shared/ui/source-badge";
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

export function AgentAvatarEditor({
  agent,
  onUpdated,
  onGenerate,
  assetLibrarySource,
  generationSource,
}: {
  agent: Agent;
  onUpdated: (agent: Agent) => void;
  onGenerate: () => void;
  assetLibrarySource: CapabilitySource;
  generationSource: CapabilitySource;
}) {
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

  const clearSource = () => {
    if (source.startsWith("blob:")) URL.revokeObjectURL(source);
    setSource("");
  };

  const choose = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setMessage("请选择图片文件");
    if (file.size > 20 * 1024 * 1024) return setMessage("图片不能超过 20MB");
    clearSource();
    setSource(URL.createObjectURL(file));
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
    setMessage("");
  };

  const save = async () => {
    const canvas = canvasRef.current;
    if (!canvas || (!demo && !session?.apiKey)) return;
    setBusy(true);
    setMessage("");
    try {
      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(
        (value) => value ? resolve(value) : reject(new Error("无法生成裁剪图片")),
        "image/jpeg",
        0.9,
      ));
      if (demo) {
        const avatar = canvas.toDataURL("image/jpeg", 0.9);
        onUpdated({
          ...agent,
          config: { ...agent.config, metadata: { ...agent.config?.metadata, avatar } },
          updated_at: new Date().toISOString(),
        });
      } else if (session?.apiKey) {
        onUpdated(await uploadAgentAvatar(session.apiKey, agent.id, blob));
      }
      clearSource();
      setMessage(demo ? "演示头像已更新，仅当前会话可见" : "头像已更新");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "头像上传失败");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!demo && !session?.apiKey) return;
    setBusy(true);
    setMessage("");
    try {
      if (demo) {
        onUpdated({ ...agent, config: { ...agent.config, metadata: { ...agent.config?.metadata, avatar: undefined } } });
      } else if (session?.apiKey) {
        onUpdated(await deleteAgentAvatar(session.apiKey, agent.id));
      }
      clearSource();
      setMessage("头像已移除");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "移除头像失败");
    } finally {
      setBusy(false);
    }
  };

  const selectExisting = () => {
    if (assetLibrarySource !== "demo") return;
    onUpdated({
      ...agent,
      config: { ...agent.config, metadata: { ...agent.config?.metadata, avatar: "/images/lin-yue-avatar.png" } },
      updated_at: new Date().toISOString(),
    });
    setMessage("已选择演示资产，仅当前会话可见");
  };

  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <AgentAvatar agent={agent} size={88} className="rounded-xl" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold">当前头像</h3>
              <span className="status-badge bg-emerald-50 text-emerald-700"><CheckCircle size={13} />已保存</span>
            </div>
            <p className="mt-1 text-sm leading-6 text-text-muted">用于 Agent 资料、预览和已接入的客户端。</p>
          </div>
        </div>
        <SourceBadge source={generationSource} />
      </header>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={selectExisting}
          disabled={assetLibrarySource === "unavailable" || busy}
          title={assetLibrarySource === "unavailable" ? "等待媒体资产库接口接入" : undefined}
          className="button-secondary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FolderOpen size={17} />从资产选择
        </button>
        <label className={`button-secondary cursor-pointer ${busy ? "pointer-events-none opacity-50" : ""}`}>
          <UploadSimple size={17} />上传图片
          <input type="file" accept="image/*" className="sr-only" onChange={(event) => choose(event.target.files?.[0])} />
        </label>
        <button type="button" onClick={onGenerate} disabled={generationSource === "unavailable" || busy} className="button-secondary">
          <MagicWand size={17} />使用 Motherland 生成
        </button>
        {agent.config?.metadata?.avatar && (
          <button type="button" className="button-secondary text-danger" onClick={() => void remove()} disabled={busy}>
            <Trash size={17} />移除
          </button>
        )}
      </div>

      {assetLibrarySource === "unavailable" && (
        <p className="mt-3 text-xs text-text-muted">资产选择将在媒体资产库后端接口接入后开放；上传和 Motherland 头像生成可正常使用。</p>
      )}

      {source && (
        <div className="mt-5 grid gap-5 rounded-xl border border-border bg-subtle p-4 md:grid-cols-[240px_minmax(0,1fr)]">
          <div className="overflow-hidden rounded-xl border border-border bg-surface p-3">
            <canvas ref={canvasRef} width={512} height={512} className="aspect-square w-full rounded-lg" role="img" aria-label="头像裁剪预览" />
          </div>
          <div className="space-y-4">
            <Range label="缩放" min={1} max={3} step={0.05} value={zoom} onChange={setZoom} />
            <Range label="水平位置" min={-1} max={1} step={0.05} value={offsetX} onChange={setOffsetX} />
            <Range label="垂直位置" min={-1} max={1} step={0.05} value={offsetY} onChange={setOffsetY} />
            <div className="flex flex-wrap gap-2">
              <button type="button" className="button-secondary" onClick={clearSource} disabled={busy}>取消</button>
              <button type="button" className="button-primary" onClick={() => void save()} disabled={busy}>
                <ImageSquare size={17} />{busy ? "保存中…" : "确认裁剪并保存"}
              </button>
            </div>
          </div>
        </div>
      )}

      {message && <p className="mt-4 rounded-md bg-subtle px-4 py-3 text-sm text-text-muted">{message}</p>}
    </section>
  );
}

function Range({
  label,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-2 w-full accent-primary" />
    </label>
  );
}
