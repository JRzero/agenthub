import { SourceBadge } from "@/shared/ui/source-badge";
import type { SharedSessionRow } from "./types";

export function SessionInspector({
  row,
  demo,
  sessionPrompt,
  userPrompt,
  saving,
  onSessionPromptChange,
  onUserPromptChange,
  onSaveSessionPrompt,
  onSaveUserPrompt,
}: {
  row: SharedSessionRow | null;
  demo: boolean;
  sessionPrompt: string;
  userPrompt: string;
  saving: boolean;
  onSessionPromptChange: (value: string) => void;
  onUserPromptChange: (value: string) => void;
  onSaveSessionPrompt: () => void;
  onSaveUserPrompt: () => void;
}) {
  if (!row) return <aside className="border-t border-border p-5 text-sm text-text-muted min-[1400px]:border-l min-[1400px]:border-t-0">选择会话后编辑 Prompt</aside>;

  return (
    <aside className="flex min-h-0 flex-col border-t border-border bg-surface min-[1400px]:border-l min-[1400px]:border-t-0">
      <header className="border-b border-border px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">PROMPT 编辑</h2>
          <SourceBadge source={demo ? "demo" : "live"} />
        </div>
      </header>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
        <PromptBlock
          title="会话级 Prompt"
          description="只影响当前会话，用于临时修正本次对话的回复策略。"
          value={sessionPrompt}
          placeholder="点击编辑针对当前会话的 Prompt..."
          saving={saving}
          onChange={onSessionPromptChange}
          onSave={onSaveSessionPrompt}
        />
        <PromptBlock
          title="用户级 Prompt"
          description="影响该用户与当前 Agent 的所有会话。"
          value={userPrompt}
          placeholder="点击编辑针对该用户的 Prompt（所有会话生效）..."
          saving={saving}
          onChange={onUserPromptChange}
          onSave={onSaveUserPrompt}
        />
      </div>
    </aside>
  );
}

function PromptBlock({ title, description, value, placeholder, saving, onChange, onSave }: { title: string; description: string; value: string; placeholder: string; saving: boolean; onChange: (value: string) => void; onSave: () => void }) {
  return <section>
    <label className="block text-sm font-medium text-text-muted">{title}</label>
    <p className="mt-1 text-xs leading-5 text-text-muted">{description}</p>
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      rows={8}
      className="mt-3 min-h-56 w-full resize-y rounded-lg border border-border bg-surface px-3 py-3 text-sm leading-6 text-text-strong outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
    />
    <button type="button" onClick={onSave} disabled={saving} className="mt-3 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50">
      {saving ? "保存中…" : "保存"}
    </button>
  </section>;
}
