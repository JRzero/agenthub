"use client";

import { useMemo, useState } from "react";
import { ClockCounterClockwise, ImageSquare, MagicWand, Plus, WarningCircle } from "@phosphor-icons/react";
import { DATA_MODE } from "@/config/capabilities";
import { DEMO_CHARACTER_SHEETS, DEMO_COMIC_DRAFTS } from "@/fixtures/demo-media-assets";
import type { Agent } from "@/modules/agents/types";
import { SourceBadge } from "@/shared/ui/source-badge";
import { AgentAvatarEditor } from "./agent-avatar-editor";
import {
  mapAgentMediaAssets,
  resolveMediaCapabilityMap,
  type MediaAsset,
  type MediaAssetKind,
} from "./media-assets";
import { MotherlandAssetDrawer } from "./motherland-asset-drawer";
import type { AgentBuildDraft } from "./types";

export function MediaAssetsPanel({
  agent,
  draft,
  onAgentUpdated,
}: {
  agent: Agent;
  draft: AgentBuildDraft;
  onAgentUpdated: (agent: Agent) => void;
}) {
  const demo = DATA_MODE === "demo";
  const capabilities = resolveMediaCapabilityMap(demo ? "demo" : "live");
  const mapped = useMemo(() => mapAgentMediaAssets(agent), [agent]);
  const [drawerKind, setDrawerKind] = useState<MediaAssetKind | null>(null);
  const [demoAssets, setDemoAssets] = useState<MediaAsset[]>([]);

  const characterSheets = demo
    ? [...demoAssets.filter((asset) => asset.kind === "character-sheet"), ...DEMO_CHARACTER_SHEETS].slice(0, 3)
    : mapped.characterSheets;
  const comicDrafts = demo
    ? [...demoAssets.filter((asset) => asset.kind === "comic-draft"), ...DEMO_COMIC_DRAFTS].slice(0, 3)
    : mapped.comicDrafts;

  const addDemoAsset = (asset: MediaAsset) => {
    if (!asset.demoOnly) return;
    setDemoAssets((current) => [asset, ...current.filter((item) => item.id !== asset.id)]);
  };

  return (
    <div className="space-y-7">
      <AgentAvatarEditor
        agent={agent}
        onUpdated={onAgentUpdated}
        onGenerate={() => setDrawerKind("avatar")}
        assetLibrarySource={capabilities.assetLibrary}
        generationSource={capabilities.avatarGeneration}
      />

      <AssetSection
        title="角色设定稿"
        description="沉淀角色的配色、造型、表情与动作规范。"
        actionLabel="生成角色设定稿"
        actionSource={capabilities.characterDesign}
        onGenerate={() => setDrawerKind("character-sheet")}
        assets={characterSheets}
        emptyCopy="尚未保存角色设定稿"
        unavailableCopy={!demo && capabilities.assetLibrary === "unavailable" ? "当前后端只提供一份已保存设定稿，历史版本待媒体资产库接入。" : undefined}
      />

      <AssetSection
        title="漫画草稿"
        description="围绕内容主题生成可继续编辑的漫画视觉草稿。"
        actionLabel="生成漫画草稿"
        actionSource={capabilities.comicDrafts}
        onGenerate={() => setDrawerKind("comic-draft")}
        assets={comicDrafts}
        emptyCopy="暂无漫画草稿"
        unavailableCopy={!demo && capabilities.comicDrafts === "unavailable" ? "漫画草稿生成与持久化接口尚未接入，Live 模式不会模拟保存。" : undefined}
      />

      <MotherlandAssetDrawer
        kind={drawerKind}
        agent={agent}
        draft={draft}
        onClose={() => setDrawerKind(null)}
        onAgentUpdated={onAgentUpdated}
        onDemoAssetCreated={addDemoAsset}
      />
    </div>
  );
}

function AssetSection({
  title,
  description,
  actionLabel,
  actionSource,
  onGenerate,
  assets,
  emptyCopy,
  unavailableCopy,
}: {
  title: string;
  description: string;
  actionLabel: string;
  actionSource: "live" | "demo" | "unavailable";
  onGenerate: () => void;
  assets: MediaAsset[];
  emptyCopy: string;
  unavailableCopy?: string;
}) {
  const unavailable = actionSource === "unavailable";
  const specAsset = assets.find((asset) => asset.specText?.trim());

  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{title}</h3>
            <SourceBadge source={actionSource} />
          </div>
          <p className="mt-1 text-sm leading-6 text-text-muted">{description}</p>
        </div>
        <button
          type="button"
          onClick={onGenerate}
          disabled={unavailable}
          title={unavailable ? "\u7b49\u5f85\u540e\u7aef\u80fd\u529b\u63a5\u5165" : undefined}
          className="button-secondary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <MagicWand size={17} />{actionLabel}
        </button>
      </header>

      {assets.length > 0 ? (
        <div className={specAsset ? "mt-5 grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(300px,1fr)]" : "mt-5"}>
          <div className={specAsset ? "grid gap-4" : "grid gap-4 sm:grid-cols-2 2xl:grid-cols-3"}>
            {assets.slice(0, 3).map((asset) => <MediaAssetCard key={asset.id} asset={asset} />)}
          </div>
          {specAsset?.specText && <MediaAssetSpecPanel asset={specAsset} />}
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-border bg-subtle px-4 py-8 text-center">
          <ImageSquare size={25} className="mx-auto text-text-muted" />
          <p className="mt-2 text-sm font-medium">{emptyCopy}</p>
        </div>
      )}

      {unavailableCopy && (
        <div className="mt-4 flex gap-2 rounded-lg bg-subtle px-3 py-2.5 text-xs leading-5 text-text-muted">
          <WarningCircle size={17} className="mt-0.5 shrink-0" />
          <span>{unavailableCopy}</span>
        </div>
      )}
    </section>
  );
}

function MediaAssetSpecPanel({ asset }: { asset: MediaAsset }) {
  return (
    <aside className="flex h-[420px] flex-col overflow-hidden rounded-xl border border-border bg-subtle p-4">
      <div className="shrink-0">
        <p className="text-sm font-semibold text-text-primary">{"\u89d2\u8272\u63cf\u8ff0"}</p>
        <p className="mt-1 text-xs text-text-muted">{asset.name}</p>
      </div>
      <div className="mt-3 min-h-0 flex-1 overflow-y-auto whitespace-pre-wrap pr-2 text-sm leading-7 text-text-muted">
        {asset.specText}
      </div>
    </aside>
  );
}

function MediaAssetCard({ asset }: { asset: MediaAsset }) {
  return (
    <article className="min-w-0 overflow-hidden rounded-xl border border-border bg-surface">
      <div className="aspect-[4/3] overflow-hidden bg-subtle">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset.url} alt={asset.name} className={`h-full w-full ${asset.kind === "character-sheet" ? "object-contain" : "object-cover"}`} />
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <h4 className="truncate text-sm font-semibold">{asset.name}</h4>
          <span className="status-badge bg-emerald-50 text-emerald-700">{"\u5df2\u4fdd\u5b58"}</span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-text-muted">
          <ClockCounterClockwise size={14} />
          <span>{asset.version || "\u5f53\u524d\u7248\u672c"}</span>
          <span>{"\u00b7"}</span>
          <span>{asset.createdAt ? asset.createdAt.slice(0, 10) : "\u65f6\u95f4\u672a\u77e5"}</span>
        </div>
        {asset.demoOnly && <p className="mt-2 text-xs text-text-muted"><Plus size={13} className="mr-1 inline" />{"\u6f14\u793a\u8d44\u4ea7\uff0c\u4e0d\u5199\u5165\u540e\u7aef"}</p>}
      </div>
    </article>
  );
}
