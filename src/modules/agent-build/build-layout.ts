export const BUILD_PREVIEW_EXPANDED_GRID_CLASS =
  "xl:grid-cols-[196px_minmax(0,1fr)_340px]";
export const BUILD_PREVIEW_COLLAPSED_GRID_CLASS =
  "xl:grid-cols-[196px_minmax(0,1fr)_64px]";

export interface BuildPreviewLayout {
  collapsed: boolean;
  desktopWidth: 340 | 64;
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
        desktopWidth: 64,
        gridClass: BUILD_PREVIEW_COLLAPSED_GRID_CLASS,
      }
    : {
        collapsed: false,
        desktopWidth: 340,
        gridClass: BUILD_PREVIEW_EXPANDED_GRID_CLASS,
      };
}
