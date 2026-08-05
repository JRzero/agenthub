import type { Icon } from "@phosphor-icons/react";
import { Compass, Info, LockKey } from "@phosphor-icons/react";
import type { CapabilitySource } from "@/config/capabilities";
import { SourceBadge } from "./source-badge";

export interface FutureModuleFeature {
  icon: Icon;
  title: string;
  description: string;
}

export function FutureModulePage({
  eyebrow,
  title,
  description,
  capabilityTitle,
  capabilityDescription,
  icon: CapabilityIcon,
  features,
  notice,
  source = "unavailable",
  headerExtra,
}: {
  eyebrow: string;
  title: string;
  description: string;
  capabilityTitle?: string;
  capabilityDescription?: string;
  icon?: Icon;
  features?: FutureModuleFeature[];
  notice?: string;
  source?: CapabilitySource;
  headerExtra?: React.ReactNode;
}) {
  if (!CapabilityIcon || !capabilityTitle || !capabilityDescription || !features || !notice) {
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

  return (
    <main className="min-h-full px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-end justify-between gap-5 border-b border-border pb-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-text-muted">{eyebrow}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">{title}</h1>
            <SourceBadge source={source} />
          </div>
          <p className="mt-2 text-sm leading-6 text-text-secondary">{description}</p>
        </div>
        {headerExtra}
      </header>

      <section className="mx-auto flex w-full max-w-5xl flex-col items-center py-10 text-center sm:py-14" aria-labelledby="unavailable-title">
        <span className="grid size-24 place-items-center rounded-2xl border border-primary/70 bg-surface text-text-secondary shadow-[inset_0_0_24px_rgba(215,255,47,0.035)]" aria-hidden="true">
          <CapabilityIcon size={48} weight="thin" />
        </span>
        <span className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-text-muted">
          <LockKey size={15} /> 暂未开放
        </span>
        <h2 id="unavailable-title" className="mt-3 text-2xl font-semibold tracking-tight sm:text-[28px]">{capabilityTitle}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-text-secondary">{capabilityDescription}</p>

        <div className={`mt-9 grid w-full overflow-hidden rounded-xl border border-border bg-surface ${features.length === 4 ? "md:grid-cols-4" : "md:grid-cols-3"}`} aria-label="接入后计划支持的能力">
          {features.map((feature) => {
            const FeatureIcon = feature.icon;
            return (
              <article key={feature.title} className="border-b border-border px-5 py-6 text-left last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
                <FeatureIcon size={22} className="text-text-muted" aria-hidden="true" />
                <h3 className="mt-4 text-sm font-medium text-text-strong">{feature.title}</h3>
                <p className="mt-1.5 text-xs leading-5 text-text-muted">{feature.description}</p>
              </article>
            );
          })}
        </div>

        <p className="mt-7 flex max-w-2xl items-start gap-2 text-left text-xs leading-5 text-text-muted">
          <Info size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          {notice}
        </p>
      </section>
    </main>
  );
}
