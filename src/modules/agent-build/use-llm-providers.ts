"use client";

import { useQuery } from "@tanstack/react-query";
import { DATA_MODE } from "@/config/capabilities";
import { useAuth } from "@/modules/auth/auth-provider";
import { listLLMProviders, type LLMProvider } from "./advanced-api";

const DEMO_PROVIDERS: LLMProvider[] = [
  { name: "qwen", display_name: "通义千问", description: "系统配置的 Qwen Provider", model: "qwen-max", models: ["qwen-max", "qwen-plus"], skip_temperature: false, capabilities: ["text", "tools"] },
  { name: "openai", display_name: "OpenAI", description: "系统配置的 OpenAI Provider", model: "gpt-4.1-mini", models: ["gpt-4.1-mini", "gpt-4o"], skip_temperature: false, capabilities: ["text", "vision", "tools"] },
  { name: "claude", display_name: "Claude", description: "系统配置的 Anthropic Provider", model: "claude-3-5-sonnet-20241022", skip_temperature: false, capabilities: ["text", "vision"] },
];

export function useLLMProviders(enabled: boolean) {
  const { session } = useAuth();
  const demo = DATA_MODE === "demo";
  return useQuery({
    queryKey: ["llm-providers", demo],
    queryFn: () => demo ? Promise.resolve(DEMO_PROVIDERS) : listLLMProviders(session?.apiKey || ""),
    enabled: enabled && Boolean(session?.apiKey),
  });
}
