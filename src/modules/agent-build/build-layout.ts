export const BUILD_PREVIEW_EXPANDED_GRID_CLASS =
  "lg:grid-cols-[184px_minmax(0,1fr)_320px]";
export const BUILD_PREVIEW_COLLAPSED_GRID_CLASS =
  "lg:grid-cols-[184px_minmax(0,1fr)_56px]";

export interface BuildPreviewLayout {
  collapsed: boolean;
  desktopWidth: 320 | 56;
  gridClass:
    | typeof BUILD_PREVIEW_EXPANDED_GRID_CLASS
    | typeof BUILD_PREVIEW_COLLAPSED_GRID_CLASS;
}

export function resolveBuildPreviewLayout(
  collapsed: boolean,
): BuildPreviewLayout {
  return collapsed
    ? {
        collapsed: true,
        desktopWidth: 56,
        gridClass: BUILD_PREVIEW_COLLAPSED_GRID_CLASS,
      }
    : {
        collapsed: false,
        desktopWidth: 320,
        gridClass: BUILD_PREVIEW_EXPANDED_GRID_CLASS,
      };
}
