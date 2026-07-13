export default function WorkspaceLoading() {
  return (
    <div className="space-y-5" role="status" aria-live="polite">
      <span className="sr-only">{"\u6b63\u5728\u52a0\u8f7d\u9875\u9762"}</span>
      <div className="h-8 w-48 animate-pulse rounded-md bg-border/70" />
      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-md border border-border bg-surface" />
        ))}
      </div>
      <div className="h-[420px] animate-pulse rounded-md border border-border bg-surface" />
    </div>
  );
}
