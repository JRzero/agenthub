export type BuildSaveStatus = "saved" | "unsaved" | "saving" | "failed";

export interface BuildSavePresentation {
  status: BuildSaveStatus;
  label: string;
  className: string;
}

export function resolveBuildSaveStatus({ dirty, saving, error }: { dirty: boolean; saving: boolean; error: string }): BuildSavePresentation {
  if (saving) return { status: "saving", label: "保存中…", className: "status-info" };
  if (error) return { status: "failed", label: "保存失败", className: "status-danger" };
  if (dirty) return { status: "unsaved", label: "有未保存更改", className: "status-warning" };
  return { status: "saved", label: "所有更改已保存", className: "status-saved" };
}
