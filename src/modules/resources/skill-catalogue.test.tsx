import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { DEMO_CREATOR_SKILLS, DEMO_MARKETPLACE_SKILLS } from "./fixtures";
import { SkillCatalogue } from "./skill-catalogue";

describe("skill catalogue states", () => {
  it("shows selected and already-added state without relying on color", () => {
    const markup = renderToStaticMarkup(<SkillCatalogue skills={DEMO_MARKETPLACE_SKILLS.slice(0, 2)} selectedId={1} creatorSkills={DEMO_CREATOR_SKILLS} onSelect={vi.fn()} />);
    expect(markup).toContain('aria-pressed="true"');
    expect(markup).toContain("已添加");
    expect(markup).toContain("联网搜索");
  });
});
