import Link from "next/link";
import { ArrowLeft, LockSimple } from "@phosphor-icons/react";
import { SourceBadge } from "@/shared/ui/source-badge";

export function AssetSectionPlaceholder({
  agentId,
  title,
  description,
}: {
  agentId: string;
  title: string;
  description: string;
}) {
  return (
    <section className="panel flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
        <LockSimple size={24} />
      </span>
      <div className="mt-4 flex items-center gap-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        <SourceBadge source="unavailable" />
      </div>
      <p className="mt-3 max-w-lg leading-7 text-text-muted">{description}</p>
      <Link href={`/assets/${agentId}/overview`} className="button-secondary mt-6">
        <ArrowLeft size={17} />
        返回资产概览
      </Link>
    </section>
  );
}
