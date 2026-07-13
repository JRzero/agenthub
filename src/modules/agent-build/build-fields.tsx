import { Info, LockKey, Plus, Trash } from "@phosphor-icons/react";
import type { KnowledgeBaseOption } from "./api";
import { getLLMProviderFamilies, getLLMProviderFamily, getLLMProviderModelOptions, getRuntimeModelPatch, getRuntimeProviderPatch, getRuntimeProviderSelection, RUNTIME_PROVIDER_PROTOCOLS } from "./advanced-api";
import { useLLMProviders } from "./use-llm-providers";
import type {
  AgentBuildDraft,
  BuildSectionId,
  DraftValidationErrors,
} from "./types";

const inputClass =
  "mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text-strong outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/15";

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-medium text-text-strong">{label}</span>
      {hint && <span className="ml-2 text-xs text-text-muted">{hint}</span>}
      {children}
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  );
}

function CheckSetting({
  checked,
  label,
  description,
  onChange,
  disabled,
}: {
  checked: boolean;
  label: string;
  description: string;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-4 has-[:checked]:border-primary/40 has-[:checked]:bg-primary-soft/40">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
      />
      <span>
        <strong className="block text-sm">{label}</strong>
        <span className="mt-1 block text-xs leading-5 text-text-muted">{description}</span>
      </span>
    </label>
  );
}

export function BasicSectionFields({
  section,
  draft,
  errors,
  knowledgeBases,
  knowledgeLoading,
  onPatch,
}: {
  section: BuildSectionId;
  draft: AgentBuildDraft;
  errors: DraftValidationErrors;
  knowledgeBases: KnowledgeBaseOption[];
  knowledgeLoading: boolean;
  onPatch: (patch: Partial<AgentBuildDraft>) => void;
}) {
  const providersQuery = useLLMProviders(section === "runtime" && draft.agentType === "cloud");
  const llmProviders = providersQuery.data || [];
  const selectedProvider = llmProviders.find((provider) => provider.name === draft.llmProvider);
  const providerFamilies = getLLMProviderFamilies(llmProviders);
  const selectedProviderFamily = getLLMProviderFamily(llmProviders, draft.llmProvider);
  const providerSelection = getRuntimeProviderSelection(draft.llmProvider, draft.llmProviderType, llmProviders);
  const currentProviderMissing = Boolean(draft.llmProvider && !selectedProvider);
  const modelOptions = getLLMProviderModelOptions(llmProviders, draft.llmProvider, draft.llmModelName);
  const skipsTemperature = Boolean(selectedProvider?.skip_temperature);

  if (section === "identity") {
    return (
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Agent 名称" error={errors.name}>
            <input className={inputClass} value={draft.name} onChange={(e) => onPatch({ name: e.target.value })} />
          </Field>
          <Field label="唯一编码" hint="保存后用于接口和发行标识" error={errors.code}>
            <input className={inputClass} value={draft.code} onChange={(e) => onPatch({ code: e.target.value })} />
          </Field>
        </div>
        <Field label="资产简介" hint={`${draft.description.length}/240`}>
          <textarea className={`${inputClass} min-h-28 resize-y`} maxLength={240} value={draft.description} onChange={(e) => onPatch({ description: e.target.value })} />
        </Field>
        <Field label="运行形态">
          <select className={inputClass} value={draft.agentType} onChange={(e) => onPatch({ agentType: e.target.value as "cloud" | "edge" })}>
            <option value="cloud">Cloud Agent</option>
            <option value="edge">Edge Agent</option>
          </select>
        </Field>
      </div>
    );
  }

  if (section === "persona") {
    return (
      <div className="space-y-5">
        <div className="rounded-lg border border-primary/20 bg-primary-soft/50 p-4 text-sm leading-6 text-text-muted">
          角色定位、说话风格、行为准则与禁区统一保存到现有系统提示词，避免在后端尚无结构化字段时伪造分项数据。
        </div>
        <Field label="角色系统提示词" hint={`${draft.systemPrompt.length}/8000`} error={errors.systemPrompt}>
          <textarea className={`${inputClass} min-h-[320px] resize-y leading-7`} maxLength={8000} value={draft.systemPrompt} onChange={(e) => onPatch({ systemPrompt: e.target.value })} />
        </Field>
      </div>
    );
  }

  if (section === "knowledge") {
    return (
      <div className="space-y-5">
        <Field label="绑定知识库" hint="沿用现有 Agent 单知识库绑定契约">
          <select
            className={inputClass}
            disabled={knowledgeLoading}
            value={draft.knowledgeBaseId ?? ""}
            onChange={(e) => onPatch({ knowledgeBaseId: e.target.value ? Number(e.target.value) : null })}
          >
            <option value="">不绑定知识库</option>
            {knowledgeBases.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </Field>
        {knowledgeBases.find((item) => item.id === draft.knowledgeBaseId)?.description && (
          <p className="rounded-lg bg-subtle p-4 text-sm text-text-muted">
            {knowledgeBases.find((item) => item.id === draft.knowledgeBaseId)?.description}
          </p>
        )}
      </div>
    );
  }

  if (section === "skills") {
    return (
      <div className="space-y-5">
        <Field label="技能标识" hint="使用英文逗号分隔，保存到现有 skills 字段">
          <textarea
            className={`${inputClass} min-h-32 resize-y font-mono`}
            value={draft.skills.join(", ")}
            onChange={(e) => onPatch({ skills: e.target.value.split(",").map((item) => item.trim()).filter(Boolean) })}
            placeholder="realtime_weather, image_generation"
          />
        </Field>
        <div className="flex flex-wrap gap-2">
          {draft.skills.map((skill) => <span key={skill} className="status-badge bg-primary-soft text-primary">{skill}</span>)}
        </div>
      </div>
    );
  }

  if (section === "memory") {
    return <CheckSetting checked={draft.memoryEnabled} label="启用长期记忆" description="使用现有 memory_enabled 开关。摘要、保留周期和隐私策略需要后续后端契约。" onChange={(memoryEnabled) => onPatch({ memoryEnabled })} />;
  }

  if (section === "runtime") {
    return (
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="供应商"
            hint={providersQuery.isError ? "系统 Provider 加载失败，仍可选择兼容协议" : undefined}
          >
            <select
              className={inputClass}
              value={providerSelection}
              onChange={(e) => onPatch(getRuntimeProviderPatch(e.target.value, llmProviders))}
            >
              <option value="">系统默认（不覆盖）</option>
              {providersQuery.isLoading && <option disabled>正在加载系统 Provider…</option>}
              {(providerFamilies.length > 0 || currentProviderMissing) && (
                <optgroup label="系统 Provider">
                  {currentProviderMissing && <option value={"provider:" + draft.llmProvider}>{draft.llmProvider}（当前配置）</option>}
                  {providerFamilies.map((family) => (
                    <option key={family.key} value={"catalogue:" + family.key}>{family.label}</option>
                  ))}
                </optgroup>
              )}
              <optgroup label="自定义兼容协议">
                {RUNTIME_PROVIDER_PROTOCOLS.map((protocol) => (
                  <option key={protocol.value} value={"protocol:" + protocol.value}>{protocol.label}</option>
                ))}
              </optgroup>
            </select>
            {selectedProviderFamily && (
              <p className="mt-2 text-xs text-text-muted">
                {selectedProviderFamily.label} · {modelOptions.length} 个可选模型
              </p>
            )}
          </Field>          <Field label="模型名称" hint="留空使用系统默认">
            <select
              className={inputClass}
              value={draft.llmModelName}
              disabled={providersQuery.isLoading}
              onChange={(e) => onPatch(getRuntimeModelPatch(e.target.value, providerSelection, llmProviders))}
            >
              <option value="">系统默认（不覆盖）</option>
              {modelOptions.map((model) => <option key={model} value={model}>{model}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Base URL" hint="不在这里编辑 Provider 密钥">
          <input className={`${inputClass} font-mono`} value={draft.llmBaseUrl} onChange={(e) => onPatch({ llmBaseUrl: e.target.value })} placeholder="留空使用 Provider 默认地址" />
        </Field>
        <Field label="Temperature" error={errors.llmTemperature}>
          <label className="mt-3 flex items-center justify-end gap-2 text-sm text-text-muted">
            <input
              type="checkbox"
              checked={draft.llmTemperature === null}
              disabled={skipsTemperature}
              onChange={(e) => onPatch({ llmTemperature: e.target.checked ? null : 0.7 })}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            {skipsTemperature ? "当前 Provider 不使用 Temperature" : "使用系统默认"}
          </label>
          <div className="mt-3 flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              disabled={draft.llmTemperature === null || skipsTemperature}
              value={draft.llmTemperature ?? 0.7}
              onChange={(e) => onPatch({ llmTemperature: Number(e.target.value) })}
              className="min-w-0 flex-1 accent-primary disabled:cursor-not-allowed disabled:opacity-45"
            />
            <output className="min-w-20 rounded bg-primary-soft px-2 py-1 text-center font-semibold text-primary">
              {draft.llmTemperature === null ? "系统默认" : draft.llmTemperature.toFixed(1)}
            </output>
          </div>
        </Field>
      </div>
    );
  }

  if (section === "safety") {
    return (
      <div className="space-y-3">
        <CheckSetting checked={draft.hidden} label="从发现页隐藏" description="保留 Agent，但不在面向用户的发现入口展示。" onChange={(hidden) => onPatch({ hidden })} />
        <div className="flex gap-3 rounded-lg border border-dashed border-border p-4 text-sm text-text-muted"><LockKey size={20} />内容分级、工具权限和合规策略尚无统一后端契约，本纵切不提供伪写入。</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center">
      <Info size={28} className="text-primary" />
      <h3 className="mt-3 font-semibold">媒体能力待迁移</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-text-muted">头像上传、角色设计稿和媒体库仍由旧 Creator 提供；在真实媒体域契约接入前，这里不展示占位上传控件。</p>
    </div>
  );
}

export function ExamplesEditor({ draft, onPatch }: { draft: AgentBuildDraft; onPatch: (patch: Partial<AgentBuildDraft>) => void }) {
  const update = (index: number, role: "user" | "assistant", content: string) => {
    const examples = [...draft.examples];
    examples[index] = { role, content };
    onPatch({ examples });
  };
  return (
    <div className="space-y-4">
      {draft.examples.map((item, index) => (
        <div key={`${item.role}-${index}`} className="rounded-lg border border-border p-4">
          <div className="mb-2 flex items-center justify-between">
            <select value={item.role} onChange={(e) => update(index, e.target.value as "user" | "assistant", item.content)} className="rounded border border-border bg-surface px-2 py-1 text-xs">
              <option value="user">用户</option><option value="assistant">Agent</option>
            </select>
            <button type="button" aria-label={`删除示例 ${index + 1}`} onClick={() => onPatch({ examples: draft.examples.filter((_, i) => i !== index) })} className="rounded p-1.5 text-text-muted hover:bg-subtle hover:text-danger"><Trash size={16} /></button>
          </div>
          <textarea value={item.content} onChange={(e) => update(index, item.role, e.target.value)} className={`${inputClass} min-h-24 resize-y`} placeholder="输入示例内容" />
        </div>
      ))}
      <button type="button" onClick={() => onPatch({ examples: [...draft.examples, { role: "user", content: "" }] })} className="button-secondary w-full"><Plus size={16} />添加示例消息</button>
    </div>
  );
}

export function AdvancedRulesEditor({ draft, onPatch }: { draft: AgentBuildDraft; onPatch: (patch: Partial<AgentBuildDraft>) => void }) {
  return (
    <div className="space-y-3">
      <CheckSetting checked={draft.showReasoning} label="显示推理过程" description="沿用 show_reasoning 配置；具体可见范围由运行端决定。" onChange={(showReasoning) => onPatch({ showReasoning })} />
      <CheckSetting checked={draft.showTools} label="显示工具调用" description="沿用 show_tools 配置，便于调试 Agent 的技能执行。" onChange={(showTools) => onPatch({ showTools })} />
      <CheckSetting checked={false} disabled label="高级安全规则" description="等待统一安全策略契约后开放。" onChange={() => undefined} />
    </div>
  );
}
