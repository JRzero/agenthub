export const NEXT_DEVELOPMENT_DIST_DIR = ".next-dev";
export const NEXT_PRODUCTION_DIST_DIR = ".next";

export function resolveNextDistDir(nodeEnv: string | undefined): string {
  return nodeEnv === "development"
    ? NEXT_DEVELOPMENT_DIST_DIR
    : NEXT_PRODUCTION_DIST_DIR;
}
