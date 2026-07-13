import type { RuntimeWidgetSpec } from "./types";

export const DEMO_RUNTIME_WIDGETS: RuntimeWidgetSpec[] = [
  { id: "demo-context", type: "select", label: "回答语气", skill_id: "demo-style", config: { options: ["简洁", "温暖", "专业"], default: "温暖" } },
  { id: "demo-note", type: "textarea", label: "补充上下文", skill_id: "demo-context", config: { placeholder: "仅用于本次测试" } },
];
