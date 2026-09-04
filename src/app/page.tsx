import type { Metadata } from "next";
import { PublicLandingPage } from "@/modules/landing/public-landing-page";

export const metadata: Metadata = {
  title: "AgentHub｜让一个想法，长成一个 Agent",
  description: "从角色设定、知识与技能、对话测试到发布运行，AgentHub 帮助创作者持续构建 Agent。",
};

export default function HomePage() {
  return <PublicLandingPage />;
}
