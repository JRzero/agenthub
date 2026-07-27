import type { MomentItem } from "./types";

export function filterMoments(
  moments: MomentItem[],
  query: string,
  days: number | "all",
  now = new Date(),
) {
  const normalized = query.trim().toLocaleLowerCase();
  const cutoff =
    days === "all"
      ? null
      : new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return moments.filter((moment) => {
    if (
      normalized &&
      ![moment.content, moment.agent_name].some((value) =>
        value.toLocaleLowerCase().includes(normalized),
      )
    ) {
      return false;
    }
    return !cutoff || new Date(moment.created_at) >= cutoff;
  });
}

export function formatMomentTime(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function momentMediaUrl(moment: MomentItem) {
  return (
    moment.thumbnail_urls[0] ||
    moment.image_urls[0] ||
    moment.video_urls[0] ||
    null
  );
}
