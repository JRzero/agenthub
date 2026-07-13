import { FileArrowUp, ImageSquare, ShieldCheck, SpeakerHigh, UserFocus } from "@phosphor-icons/react";
import { describe, expect, it } from "vitest";
import { getSkillCategoryLabel, getSkillStagePresentation, getSkillVisual } from "./skill-presentation";
import type { MarketplaceSkill } from "./types";

function skill(input: Partial<MarketplaceSkill>): MarketplaceSkill {
  return {
    id: 1,
    uuid: "skill",
    name: "skill",
    description: "",
    stage: "mid",
    implementation_type: "function",
    ...input,
  };
}

describe("skill presentation", () => {
  it.each([
    ["pre", "前置", "sky"],
    ["mid_conversation", "对话中", "violet"],
    ["post", "后置", "emerald"],
  ])("localizes and colors the %s stage", (stage, label, color) => {
    expect(getSkillStagePresentation(stage)).toMatchObject({ label });
    expect(getSkillStagePresentation(stage).className).toContain(color);
  });

  it.each([
    ["sensitive_filter", ShieldCheck],
    ["image_upload", ImageSquare],
    ["document_upload", FileArrowUp],
    ["role_reinforcement", UserFocus],
    ["minimaxi_tts", SpeakerHigh],
  ])("uses a semantic icon for %s", (name, icon) => {
    expect(getSkillVisual(skill({ name, uuid: name })).icon).toBe(icon);
  });
  it.each([
    ["safety", "安全防护"],
    ["input", "输入处理"],
    ["prompt", "提示词"],
    ["voice", "语音"],
    ["api", "API 接口"],
    ["document", "文档"],
    ["image", "图像"],
    ["custom-category", "custom-category"],
  ])("localizes the %s category", (category, label) => {
    expect(getSkillCategoryLabel(category)).toBe(label);
  });
});
