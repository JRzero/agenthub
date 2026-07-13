import type { ActivityItem } from "./model";

const toneClass = {
  update: "bg-primary-soft text-primary",
  publish: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
};

export function ActivityPanel({ activities }: { activities: ActivityItem[] }) {
  if (activities.length === 0) return null;
  return (
    <section className="panel col-span-full p-5">
      <h2 className="text-base font-semibold">最近变更</h2>
      <div className="mt-3 divide-y divide-border">
        {activities.map((activity) => (
          <div key={activity.id} className="grid min-h-11 grid-cols-[140px_64px_minmax(0,1fr)_100px] items-center gap-3 text-sm">
            <span className="truncate font-medium">{activity.actor}</span>
            <span className={`w-fit rounded px-2 py-0.5 text-xs font-medium ${toneClass[activity.tone]}`}>{activity.action}</span>
            <span className="truncate text-text-muted">{activity.detail}</span>
            <span className="text-right text-xs text-text-muted">{activity.time}</span>
          </div>
        ))}
      </div>
      <button type="button" className="mt-3 w-full text-center text-sm font-medium text-primary">查看全部变更</button>
    </section>
  );
}
