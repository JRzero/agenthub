import { useState } from "react";
import { CaretDown, Info, MagicWand, Plus, Trash, X } from "@phosphor-icons/react";
import type { KnowledgeBaseOption } from "./api";
import { NarrativeOptimizerPanel } from "./narrative-optimizer-panel";
import {
  getLLMProviderFamilies,
  getLLMProviderFamily,
  getLLMProviderModelOptions,
  getRuntimeModelPatch,
  getRuntimeProviderPatch,
  getRuntimeProviderSelection,
  RUNTIME_PROVIDER_PROTOCOLS,
} from "./advanced-api";
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
}: {
  checked: boolean;
  label: string;
  description: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-4 has-[:checked]:border-primary/40 has-[:checked]:bg-primary-soft/40">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
      />
      <span>
        <strong className="block text-sm">{label}</strong>
        <span className="mt-1 block text-xs leading-5 text-text-muted">
          {description}
        </span>
      </span>
    </label>
  );
}

function SwitchSetting({
  checked,
  label,
  description,
  onChange,
}: {
  checked: boolean;
  label: string;
  description: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-5 rounded-xl border border-border p-4">
      <div>
        <strong className="block text-sm">{label}</strong>
        <p className="mt-1 text-sm leading-6 text-text-muted">{description}</p>
      </div>
      <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-primary" : "bg-slate-300"}`}>
        <span className={`absolute top-1 size-4 rounded-full bg-white shadow-sm transition ${checked ? "left-6" : "left-1"}`} />
      </button>
    </div>
  );
}

export function BasicSectionFields({
  agentId,
  section,
  draft,
  errors,
  knowledgeBases,
  knowledgeLoading,
  onPatch,
}: {
  agentId: number;
  section: BuildSectionId;
  draft: AgentBuildDraft;
  errors: DraftValidationErrors;
  knowledgeBases: KnowledgeBaseOption[];
  knowledgeLoading: boolean;
  onPatch: (patch: Partial<AgentBuildDraft>) => void;
}) {
  const [optimizerOpen, setOptimizerOpen] = useState(false);
  const [runtimeAdvancedOpen, setRuntimeAdvancedOpen] = useState(false);
  const providersQuery = useLLMProviders(
    section === "runtime" && draft.agentType === "cloud",
  );
  const llmProviders = providersQuery.data || [];
  const selectedProvider = llmProviders.find(
    (provider) => provider.name === draft.llmProvider,
  );
  const providerFamilies = getLLMProviderFamilies(llmProviders);
  const selectedProviderFamily = getLLMProviderFamily(
    llmProviders,
    draft.llmProvider,
  );
  const providerSelection = getRuntimeProviderSelection(
    draft.llmProvider,
    draft.llmProviderType,
    llmProviders,
  );
  const currentProviderMissing = Boolean(
    draft.llmProvider && !selectedProvider,
  );
  const modelOptions = getLLMProviderModelOptions(
    llmProviders,
    draft.llmProvider,
    draft.llmModelName,
  );
  const skipsTemperature = Boolean(selectedProvider?.skip_temperature);

  if (section === "identity") {
    return (
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Agent 名称" error={errors.name}>
            <input
              className={inputClass}
              value={draft.name}
              onChange={(e) => onPatch({ name: e.target.value })}
            />
          </Field>
          <Field
            label={"Agent \u7f16\u7801"}
            hint={"\u7cfb\u7edf\u751f\u6210\uff0c\u7528\u4e8e\u63a5\u53e3\u548c\u53d1\u884c\u6807\u8bc6"}
          >
            <input
              className={`${inputClass} cursor-not-allowed bg-subtle text-text-muted`}
              value={draft.code}
              readOnly
              aria-readonly="true"
            />
          </Field>
        </div>
        <Field label="Agent 简介" hint={`${draft.description.length}/240`}>
          <textarea
            className={`${inputClass} min-h-64 resize-y`}
            maxLength={240}
            value={draft.description}
            onChange={(e) => onPatch({ description: e.target.value })}
          />
        </Field>
      </div>
    );
  }

  if (section === "persona") {
    return (
      <div className="space-y-5">
        <p className="text-sm leading-6 text-text-muted">定义角色定位、表达方式和行为边界。</p>
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="font-medium text-text-strong">角色系统提示词</span>
              <span className="ml-2 text-xs text-text-muted">{draft.systemPrompt.length}/8000</span>
            </div>
            <button
              type="button"
              onClick={() => setOptimizerOpen(true)}
              disabled={!draft.systemPrompt.trim()}
              className="button-secondary h-9 px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              <MagicWand size={16} />
              优化角色人格
            </button>
          </div>
          <textarea
            className={`${inputClass} min-h-[320px] resize-y leading-7`}
            maxLength={8000}
            value={draft.systemPrompt}
            onChange={(e) => onPatch({ systemPrompt: e.target.value })}
          />
          {errors.systemPrompt && <span className="mt-1 block text-xs text-danger">{errors.systemPrompt}</span>}
        </div>

        {optimizerOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/30" onMouseDown={() => setOptimizerOpen(false)}>
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="system-prompt-optimizer-title"
              onMouseDown={(event) => event.stopPropagation()}
              className="mx-auto mt-[8vh] flex max-h-[84vh] w-[min(760px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl bg-surface shadow-2xl"
            >
              <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-5 py-4">
                <div>
                  <h3 id="system-prompt-optimizer-title" className="text-lg font-semibold">优化角色人格</h3>
                  <p className="mt-1 text-sm text-text-muted">让 Motherland 帮你完善角色表达。生成结果可先检查和调整，应用后再保存草稿。</p>
                </div>
                <button type="button" onClick={() => setOptimizerOpen(false)} aria-label="关闭优化角色人格" className="rounded-md p-2 text-text-muted hover:bg-subtle">
                  <X size={18} />
                </button>
              </header>
              <div className="min-h-0 flex-1 overflow-y-auto p-5">
                <NarrativeOptimizerPanel agentId={agentId} draft={draft} onPatch={onPatch} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (section === "knowledge") {
    const selectedKnowledge = knowledgeBases.find((item) => item.id === draft.knowledgeBaseId);
    return (
      <div className="space-y-5">
        <div>
          <h3 className="font-semibold">已绑定知识库</h3>
          <p className="mt-1 text-sm text-text-muted">当前 Agent 可绑定一个知识库。</p>
        </div>
        {selectedKnowledge ? (
          <div className="rounded-xl border border-primary/30 bg-primary-soft/30 p-4">
            <div className="flex items-start justify-between gap-4">
              <div><strong>{selectedKnowledge.name}</strong><p className="mt-1 text-sm leading-6 text-text-muted">{selectedKnowledge.description || "已用于当前 Agent 的知识检索。"}</p></div>
              <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">已绑定</span>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-7 text-center text-sm text-text-muted">尚未绑定知识库。</div>
        )}
        <Field label={selectedKnowledge ? "更换知识库" : "选择知识库"}>
          <select className={inputClass} disabled={knowledgeLoading} value={draft.knowledgeBaseId ?? ""} onChange={(event) => {
            const next = event.target.value ? Number(event.target.value) : null;
            if (draft.knowledgeBaseId !== null && next !== draft.knowledgeBaseId && !window.confirm(next === null ? "确定解除当前知识库绑定吗？" : "确定更换当前知识库吗？")) return;
            onPatch({ knowledgeBaseId: next });
          }}>
            <option value="">不绑定知识库</option>
            {knowledgeBases.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </Field>
      </div>
    );
  }

  if (section === "memory") {
    return (
      <SwitchSetting
        checked={draft.memoryEnabled}
        label="启用长期记忆"
        description="开启后，Agent 可在后续对话中延续已记录的信息。"
        onChange={(memoryEnabled) => onPatch({ memoryEnabled })}
      />
    );
  }

  if (section === "runtime") {
    return (
      <div className="space-y-5">
        <Field label="部署形态">
          <select
            className={inputClass}
            value={draft.agentType}
            onChange={(e) =>
              onPatch({ agentType: e.target.value as "cloud" | "edge" })
            }
          >
            <option value="cloud">Cloud Agent</option>
            <option value="edge">Edge Agent</option>
          </select>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="供应商"
            hint={
              providersQuery.isError
                ? "系统 Provider 加载失败，仍可选择兼容协议"
                : undefined
            }
          >
            <select
              className={inputClass}
              value={providerSelection}
              onChange={(e) =>
                onPatch(getRuntimeProviderPatch(e.target.value, llmProviders))
              }
            >
              <option value="">系统默认（不覆盖）</option>
              {providersQuery.isLoading && (
                <option disabled>正在加载系统 Provider…</option>
              )}
              {(providerFamilies.length > 0 || currentProviderMissing) && (
                <optgroup label="系统 Provider">
                  {currentProviderMissing && (
                    <option value={"provider:" + draft.llmProvider}>
                      {draft.llmProvider}（当前配置）
                    </option>
                  )}
                  {providerFamilies.map((family) => (
                    <option key={family.key} value={"catalogue:" + family.key}>
                      {family.label}
                    </option>
                  ))}
                </optgroup>
              )}
              <optgroup label="自定义兼容协议">
                {RUNTIME_PROVIDER_PROTOCOLS.map((protocol) => (
                  <option
                    key={protocol.value}
                    value={"protocol:" + protocol.value}
                  >
                    {protocol.label}
                  </option>
                ))}
              </optgroup>
            </select>
            {selectedProviderFamily && (
              <p className="mt-2 text-xs text-text-muted">
                {selectedProviderFamily.label} · {modelOptions.length}{" "}
                个可选模型
              </p>
            )}
          </Field>{" "}
          <Field label="模型名称" hint="留空使用系统默认">
            <select
              className={inputClass}
              value={draft.llmModelName}
              disabled={providersQuery.isLoading}
              onChange={(e) =>
                onPatch(
                  getRuntimeModelPatch(
                    e.target.value,
                    providerSelection,
                    llmProviders,
                  ),
                )
              }
            >
              <option value="">系统默认（不覆盖）</option>
              {modelOptions.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <button type="button" onClick={() => setRuntimeAdvancedOpen((current) => !current)} aria-expanded={runtimeAdvancedOpen} className="flex w-full items-center justify-between rounded-lg border border-border px-4 py-3 text-left text-sm font-medium hover:bg-subtle">
          高级设置
          <CaretDown size={17} className={`transition ${runtimeAdvancedOpen ? "rotate-180" : ""}`} />
        </button>
        {runtimeAdvancedOpen && <div className="space-y-5 rounded-xl border border-border bg-subtle/40 p-4">
          <Field label="Base URL" hint="留空使用供应商默认地址">
            <input className={`${inputClass} font-mono`} value={draft.llmBaseUrl} onChange={(e) => onPatch({ llmBaseUrl: e.target.value })} placeholder="使用默认地址" />
          </Field>
          <Field label="Temperature" error={errors.llmTemperature}>
            <label className="mt-3 flex items-center justify-end gap-2 text-sm text-text-muted">
              <input type="checkbox" checked={draft.llmTemperature === null} disabled={skipsTemperature} onChange={(e) => onPatch({ llmTemperature: e.target.checked ? null : 0.7 })} className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
              {skipsTemperature ? "当前供应商不使用 Temperature" : "使用系统默认"}
            </label>
            <div className="mt-3 flex items-center gap-4">
              <input type="range" min="0" max="2" step="0.1" disabled={draft.llmTemperature === null || skipsTemperature} value={draft.llmTemperature ?? 0.7} onChange={(e) => onPatch({ llmTemperature: Number(e.target.value) })} className="min-w-0 flex-1 accent-primary disabled:cursor-not-allowed disabled:opacity-45" />
              <output className="min-w-20 rounded bg-primary-soft px-2 py-1 text-center font-semibold text-primary">{draft.llmTemperature === null ? "系统默认" : draft.llmTemperature.toFixed(1)}</output>
            </div>
          </Field>
          <RuntimeDisplaySettings draft={draft} onPatch={onPatch} />
        </div>}
      </div>
    );
  }

  if (section === "safety") {
    return (
      <div className="space-y-3">
        <SwitchSetting
          checked={draft.hidden}
          label="从发现页隐藏"
          description="隐藏后，用户无法从发现页找到该 Agent。"
          onChange={(hidden) => onPatch({ hidden })}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center">
      <Info size={28} className="text-primary" />
      <h3 className="mt-3 font-semibold">媒体能力待迁移</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-text-muted">
        头像上传、角色设计稿和媒体库仍由旧 Creator
        提供；在真实媒体域契约接入前，这里不展示占位上传控件。
      </p>
    </div>
  );
}

export function ExamplesEditor({
  draft,
  onPatch,
}: {
  draft: AgentBuildDraft;
  onPatch: (patch: Partial<AgentBuildDraft>) => void;
}) {
  const update = (
    index: number,
    role: "user" | "assistant",
    content: string,
  ) => {
    const examples = [...draft.examples];
    examples[index] = { role, content };
    onPatch({ examples });
  };
  return (
    <div className="space-y-6">
      <Field
        label="开场白"
        hint="用户开始新对话时首先看到的内容"
      >
        <textarea
          value={draft.openingMessage}
          onChange={(event) =>
            onPatch({ openingMessage: event.target.value })
          }
          className={`${inputClass} min-h-24 resize-y`}
          placeholder="例如：今天想从哪里聊起？"
        />
      </Field>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-text-strong">示例对话</h4>
          <p className="mt-1 text-xs leading-5 text-text-muted">
            添加典型对话，帮助 Agent 保持预期的表达方式。
          </p>
        </div>
        {draft.examples.map((item, index) => (
          <div
            key={`${item.role}-${index}`}
            className="rounded-lg border border-border p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <select
                value={item.role}
                onChange={(e) =>
                  update(
                    index,
                    e.target.value as "user" | "assistant",
                    item.content,
                  )
                }
                className="rounded border border-border bg-surface px-2 py-1 text-xs"
              >
                <option value="user">用户</option>
                <option value="assistant">Agent</option>
              </select>
              <button
                type="button"
                aria-label={`删除示例 ${index + 1}`}
                onClick={() =>
                  onPatch({
                    examples: draft.examples.filter((_, i) => i !== index),
                  })
                }
                className="rounded p-1.5 text-text-muted hover:bg-subtle hover:text-danger"
              >
                <Trash size={16} />
              </button>
            </div>
            <textarea
              value={item.content}
              onChange={(e) => update(index, item.role, e.target.value)}
              className={`${inputClass} min-h-24 resize-y`}
              placeholder="输入示例内容"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            onPatch({
              examples: [...draft.examples, { role: "user", content: "" }],
            })
          }
          className="button-secondary w-full"
        >
          <Plus size={16} />
          添加示例消息
        </button>
      </div>
    </div>
  );
}

export function RuntimeDisplaySettings({
  draft,
  onPatch,
}: {
  draft: AgentBuildDraft;
  onPatch: (patch: Partial<AgentBuildDraft>) => void;
}) {
  return (
    <div className="space-y-3">
      <CheckSetting
        checked={draft.showReasoning}
        label="显示推理过程"
        description="允许支持该能力的运行端展示推理过程。"
        onChange={(showReasoning) => onPatch({ showReasoning })}
      />
      <CheckSetting
        checked={draft.showTools}
        label="显示工具调用"
        description="在支持的运行端展示技能调用信息。"
        onChange={(showTools) => onPatch({ showTools })}
      />
    </div>
  );
}
