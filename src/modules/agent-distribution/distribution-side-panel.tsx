"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import type { Icon } from "@phosphor-icons/react";
import { ArrowCounterClockwise, Brain, CaretRight, FileLock, FileText, PauseCircle, ShieldCheck, Trash, UploadSimple, Warning } from "@phosphor-icons/react";
import { DATA_MODE } from "@/config/capabilities";
import { useAuth } from "@/modules/auth/auth-provider";
import { useWorkspace } from "@/modules/workspace/workspace-provider";
import { deleteShareLink } from "./api";
import type { DistributionDialogKind } from "./types";

const governanceItems: Array<{ kind: Exclude<DistributionDialogKind, null>; label: string; description: string; icon: Icon }> = [
  { kind: "license", label: "授权清单", description: "管理授权对象与范围", icon: FileText },
  { kind: "export-policy", label: "导出权限", description: "控制资产导出与调用", icon: UploadSimple },
  { kind: "memory", label: "记忆边界", description: "设置记忆保留与隔离策略", icon: Brain },
  { kind: "safety", label: "安全策略", description: "配置内容安全与风险控制", icon: ShieldCheck },
  { kind: "audit", label: "审计记录", description: "查看发行与变更历史", icon: FileLock },
];

export function DistributionSidePanel({ demo, paused, canPauseLiveShare, onOpen, onRollback, onPause }: { demo: boolean; paused: boolean; canPauseLiveShare: boolean; onOpen: (kind: Exclude<DistributionDialogKind, null>) => void; onRollback: () => void; onPause: () => void }) {
  const params = useParams<{ agentId: string }>();
  const { session } = useAuth();
  const { workspaceCode } = useWorkspace();
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const removeShare = async () => {
    const agentId = Number(params.agentId);
    if (!session?.apiKey || !Number.isFinite(agentId) || !window.confirm("删除分享链接后，已有访客将无法继续访问。确定删除？")) return;
    setDeleting(true); setDeleteMessage("");
    try {
      if (DATA_MODE !== "demo") await deleteShareLink(session.apiKey, agentId, workspaceCode);
      setDeleted(true);
      setDeleteMessage(demo ? "演示分享链接已在当前会话删除" : "分享链接已删除，正在刷新状态…");
      if (!demo) window.setTimeout(() => window.location.reload(), 500);
    } catch (error) { setDeleteMessage(error instanceof Error ? error.message : "删除分享链接失败"); }
    finally { setDeleting(false); }
  };

  return <aside className="border-t border-border pt-5 min-[1400px]:border-l min-[1400px]:border-t-0 min-[1400px]:pl-6 min-[1400px]:pt-0"><h2 className="text-lg font-semibold">发行治理</h2><div className="mt-3 divide-y divide-border">{governanceItems.map((item) => { const ItemIcon = item.icon; return <button key={item.kind} type="button" onClick={() => onOpen(item.kind)} className="flex w-full items-center gap-3 py-3 text-left hover:text-primary"><ItemIcon size={21} className="shrink-0" /><span className="min-w-0 flex-1"><strong className="block text-sm font-medium">{item.label}</strong><span className="mt-0.5 block text-xs text-text-muted">{item.description}</span></span><CaretRight size={17} /></button>; })}</div><div className="mt-4 rounded-md border border-orange-200 bg-orange-50 px-4 py-3 text-orange-950 dark:border-orange-400/20 dark:bg-orange-400/10 dark:text-orange-200"><div className="flex gap-2"><Warning className="mt-0.5 shrink-0 text-orange-500 dark:text-orange-300" size={18} weight="fill" /><div><p className="text-sm font-medium">用户关系记忆不会随资产导出</p><p className="mt-2 text-xs leading-5 text-orange-900/75 dark:text-orange-200/75">为保护用户隐私与关系安全，用户关系记忆仅保留在应用端，不随资产导出或跨端共享。</p><button type="button" onClick={() => onOpen("memory")} className="mt-2 text-xs font-medium text-primary">了解更多</button></div></div></div><h2 className="mt-5 text-base font-semibold">版本操作</h2><div className="mt-2 divide-y divide-border"><button type="button" onClick={onRollback} className="flex w-full items-center gap-3 py-3 text-left hover:text-primary"><ArrowCounterClockwise size={21} /><span className="flex-1"><strong className="block text-sm font-medium">回滚版本</strong><span className="text-xs text-text-muted">前往版本时间线选择快照</span></span><CaretRight size={17} /></button><button type="button" onClick={onPause} disabled={!demo && !canPauseLiveShare} className="flex w-full items-center gap-3 py-3 text-left text-danger hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-45"><PauseCircle size={21} /><span className="flex-1"><strong className="block text-sm font-medium">{paused ? "恢复发行" : demo ? "暂停发行" : "暂停网页发行"}</strong><span className="text-xs text-text-muted">{demo ? "仅影响当前演示会话" : "通过现有分享链接开关执行"}</span></span><CaretRight size={17} /></button>{canPauseLiveShare && !deleted && <button type="button" onClick={() => void removeShare()} disabled={deleting} className="flex w-full items-center gap-3 py-3 text-left text-danger hover:brightness-90 disabled:opacity-50"><Trash size={21} /><span className="flex-1"><strong className="block text-sm font-medium">{deleting ? "删除中…" : "删除分享链接"}</strong><span className="text-xs text-text-muted">使现有访客链接立即失效</span></span><CaretRight size={17} /></button>}</div>{deleteMessage && <p className="mt-3 rounded-md bg-subtle px-3 py-2 text-xs text-text-muted">{deleteMessage}</p>}</aside>;
}
