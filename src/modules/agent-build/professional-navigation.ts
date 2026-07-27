import type {
  BuildLifecycleDestination,
  BuildNavigationGroup,
  BuildNavigationItem,
  BuildSectionId,
} from "./types";

export const PROFESSIONAL_BUILD_GROUPS: BuildNavigationGroup[] = [
  {
    id: "identity-persona",
    label: "身份与人设",
    items: [
      { kind: "editor", id: "identity", label: "身份信息" },
      { kind: "editor", id: "persona", label: "角色人格" },
    ],
  },
  {
    id: "runtime",
    label: "运行配置",
    items: [{ kind: "editor", id: "runtime", label: "运行配置" }],
  },
  {
    id: "capabilities",
    label: "能力配置",
    items: [
      { kind: "editor", id: "skills", label: "技能" },
      { kind: "editor", id: "knowledge", label: "知识" },
      { kind: "editor", id: "memory", label: "记忆策略" },
      { kind: "editor", id: "media", label: "媒体资产" },
    ],
  },
  {
    id: "governance-release",
    label: "治理与发布",
    items: [
      { kind: "editor", id: "safety", label: "安全边界" },
      { kind: "route", id: "test", label: "测试评估" },
      { kind: "route", id: "versions", label: "版本与发布" },
    ],
  },
];

export const BUILD_SECTION_LABELS = Object.fromEntries(
  PROFESSIONAL_BUILD_GROUPS.flatMap((group) => group.items)
    .filter((item): item is Extract<BuildNavigationItem, { kind: "editor" }> => item.kind === "editor")
    .map((item) => [item.id, item.label]),
) as Record<BuildSectionId, string>;

const BUILD_SECTION_IDS = PROFESSIONAL_BUILD_GROUPS.flatMap((group) =>
  group.items
    .filter(
      (item): item is Extract<BuildNavigationItem, { kind: "editor" }> =>
        item.kind === "editor",
    )
    .map((item) => item.id),
);

export function resolveRequestedBuildSection(value: string | null): {
  section: BuildSectionId | null;
  momentsMigrated: boolean;
} {
  if (value === "moments") {
    return { section: "media", momentsMigrated: true };
  }
  return {
    section: BUILD_SECTION_IDS.includes(value as BuildSectionId)
      ? (value as BuildSectionId)
      : null,
    momentsMigrated: false,
  };
}

export function getBuildLifecyclePath(
  agentId: number,
  destination: BuildLifecycleDestination,
): string {
  return `/assets/${agentId}/${destination}`;
}
