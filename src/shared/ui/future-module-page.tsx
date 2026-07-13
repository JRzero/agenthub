import { Compass, Info } from "@phosphor-icons/react";
import type { CapabilitySource } from "@/config/capabilities";
import { SourceBadge } from "./source-badge";

export function FutureModulePage({
  eyebrow,
  title,
  description,
  source = "unavailable",
}: {
  eyebrow: string;
  title: string;
  description: string;
  source?: CapabilitySource;
}) {
  return (
    <div>
      <p className="text-sm text-text-muted">{eyebrow}</p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <SourceBadge source={source} />
      </div>
      <section className="panel mt-6 flex min-h-[480px] flex-col items-center justify-center px-8 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
          <Compass size={27} weight="duotone" />
        </span>
        <h2 className="mt-5 text-xl font-semibold">平台能力已预留</h2>
        <p className="mt-3 max-w-xl leading-7 text-text-muted">{description}</p>
        <div className="mt-6 flex max-w-xl items-start gap-2 rounded-md border border-border bg-subtle px-4 py-3 text-left text-sm text-text-muted">
          <Info className="mt-0.5 shrink-0 text-primary" size={18} />
          该页面不会在后端契约完成前提供成功外观的虚假生产操作。
        </div>
      </section>
    </div>
  );
}
