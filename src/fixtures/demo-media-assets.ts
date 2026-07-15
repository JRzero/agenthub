import type { MediaAsset } from "@/modules/agent-build/media-assets";

export const DEMO_CHARACTER_SHEETS: MediaAsset[] = [
  { id: "demo-sheet-3", kind: "character-sheet", name: "星辰小筑 · 科普讲解", url: "/images/lin-yue-avatar.png", status: "saved", version: "v3", createdAt: "2026-07-14", demoOnly: true },
  { id: "demo-sheet-2", kind: "character-sheet", name: "星辰小筑 · 日常表情", url: "/images/lin-yue-avatar.png", status: "saved", version: "v2", createdAt: "2026-07-12", demoOnly: true },
  { id: "demo-sheet-1", kind: "character-sheet", name: "星辰小筑 · 初版", url: "/images/lin-yue-avatar.png", status: "saved", version: "v1", createdAt: "2026-07-10", demoOnly: true },
];

export const DEMO_COMIC_DRAFTS: MediaAsset[] = [
  { id: "demo-comic-2", kind: "comic-draft", name: "为什么会有白天和黑夜", url: "/images/lin-yue-avatar.png", status: "saved", version: "v2", createdAt: "2026-07-14", demoOnly: true },
  { id: "demo-comic-1", kind: "comic-draft", name: "一颗种子的旅行", url: "/images/lin-yue-avatar.png", status: "saved", version: "v1", createdAt: "2026-07-11", demoOnly: true },
];
