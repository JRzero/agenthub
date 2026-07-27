import { describe, expect, it } from "vitest";
import { filterMoments, momentMediaUrl } from "./model";
import type { MomentItem } from "./types";

const moments = [
  {
    id: 1,
    agent_id: 32,
    agent_name: "林月",
    content: "恐龙朋友",
    created_at: "2026-07-26T10:00:00+08:00",
    image_urls: ["/image.jpg"],
    thumbnail_urls: [],
    video_urls: [],
  },
  {
    id: 2,
    agent_id: 19,
    agent_name: "知识向导",
    content: "AI 知识",
    created_at: "2026-06-01T10:00:00+08:00",
    image_urls: [],
    thumbnail_urls: [],
    video_urls: [],
  },
] as MomentItem[];

describe("Moment operations model", () => {
  it("filters the loaded page by content and time", () => {
    expect(
      filterMoments(
        moments,
        "恐龙",
        7,
        new Date("2026-07-27T12:00:00+08:00"),
      ).map((item) => item.id),
    ).toEqual([1]);
  });

  it("uses a real media URL only when present", () => {
    expect(momentMediaUrl(moments[0])).toBe("/image.jpg");
    expect(momentMediaUrl(moments[1])).toBeNull();
  });
});
