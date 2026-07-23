import Link from "next/link";
import type { Icon } from "@phosphor-icons/react";
import {
  BookOpenText,
  CaretRight,
  CheckCircle,
  Circle,
  CircleHalf,
  Database,
  IdentificationCard,
  ImageSquare,
  MagicWand,
  MinusCircle,
  ShieldCheck,
  SlidersHorizontal,
} from "@phosphor-icons/react";
import type { AssetSection, AssetSectionId } from "./model";

const icons: Record<AssetSectionId, Icon> = {
  identity: IdentificationCard,
  knowledge: BookOpenText,
  skills: MagicWand,
  memory: Database,
  media: ImageSquare,
  runtime: SlidersHorizontal,
  safety: ShieldCheck,
};

function Score({ section }: { section: AssetSection }) {
  if (section.score === null) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted">
        <MinusCircle size={17} />
        待接入
      </span>
    );
  }
  if (section.state === "complete") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted">
        <CheckCircle size={17} weight="fill" className="text-success" />
        已配置
      </span>
    );
  }
  return section.score > 0 ? (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700">
      <CircleHalf size={17} weight="fill" />
      待完善
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted">
      <Circle size={17} />
      未配置
    </span>
  );
}

export function AssetCompositionPanel({
  agentId,
  sections,
}: {
  agentId: number;
  sections: AssetSection[];
}) {
  return (
    <section className="panel min-w-0 p-5">
      <h2 className="text-base font-semibold">资产组成</h2>
      <div className="mt-4 overflow-hidden rounded-md border border-border">
        {sections.map((section, index) => {
          const Icon = icons[section.id];
          return (
            <Link
              key={section.id}
              href={`/assets/${agentId}/build?section=${section.id}`}
              className={`grid min-h-[58px] w-full grid-cols-[36px_minmax(110px,0.55fr)_minmax(190px,1.2fr)_max-content_20px] items-center gap-3 px-4 text-left transition hover:bg-subtle ${index > 0 ? "border-t border-border" : ""}`}
            >
              <Icon size={23} className={section.state === "unavailable" ? "text-text-muted" : "text-primary"} />
              <span className="font-medium">{section.label}</span>
              <span className="truncate text-sm text-text-muted">{section.description}</span>
              <Score section={section} />
              <CaretRight size={16} className="text-text-muted" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
