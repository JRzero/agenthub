"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenText, CaretLeft, CaretRight, ChatCircleText, Check, Code, PaperPlaneTilt, RocketLaunch, Sparkle, Stack, UserFocus } from "@phosphor-icons/react";
import { FormEvent, MouseEvent, type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { boundedCarouselSlot, circularAgentSlot, useWorkbenchAgentTransition } from "@/modules/workbench/workbench-transition";
import { useDocumentHidden, usePrefersReducedMotion, useWorkbenchAutoplay } from "@/modules/workbench/workbench-autoplay";
import styles from "./public-landing-page.module.css";

export const CREATION_INTENT_SESSION_KEY = "agenthub_public_creation_intent";
export const CREATE_LOGIN_HREF = "/login?next=%2Fassets%2Fcreate";
export const CREATE_REGISTER_HREF = "/register?next=%2Fassets%2Fcreate";

type ProductState = "identity" | "knowledge" | "test" | "runtime" | "iterate";
type ShowcaseRole = { id: number; name: string; type: string; description: string; image: string; imagePosition: string; boundary: "品牌示例"; focus: string };
type HeroRoleCardSlot = {
  id: string;
  src: string;
  alt: string;
  slot: string;
  zIndex: number;
  tone: "main" | "near" | "outer";
  objectPosition: string;
  subjectScale: number;
  subjectOffsetX: number;
  subjectOffsetY: number;
  mobile: boolean;
};

const heroRoleCardSlots: HeroRoleCardSlot[] = [
  { id: "top-strategist", src: "/images/agenthub-site/hero-roles-r32/hero-system-strategist-r32.webp", alt: "", slot: "top-strategist", zIndex: 1, tone: "outer", objectPosition: "50% 50%", subjectScale: 1, subjectOffsetX: 0, subjectOffsetY: 0, mobile: false },
  { id: "top-anime", src: "/images/agenthub-site/hero-roles-r32/hero-game-content-host-r32.webp", alt: "", slot: "top-anime", zIndex: 1, tone: "near", objectPosition: "50% 50%", subjectScale: 1, subjectOffsetX: 0, subjectOffsetY: 0, mobile: true },
  { id: "top-support", src: "/images/agenthub-site/hero-roles-r32/hero-service-experience-partner-r32.webp", alt: "", slot: "top-support", zIndex: 1, tone: "near", objectPosition: "50% 50%", subjectScale: 1, subjectOffsetX: 0, subjectOffsetY: 0, mobile: false },
  { id: "mid-expert", src: "/images/agenthub-site/hero-roles-r32/hero-senior-research-advisor-r32.webp", alt: "", slot: "mid-expert", zIndex: 2, tone: "outer", objectPosition: "50% 50%", subjectScale: 1, subjectOffsetX: 0, subjectOffsetY: 0, mobile: true },
  { id: "mid-fantasy", src: "/images/agenthub-site/hero-roles-r32/hero-fantasy-storyteller-r32.webp", alt: "", slot: "mid-fantasy", zIndex: 2, tone: "near", objectPosition: "50% 50%", subjectScale: 1, subjectOffsetX: 0, subjectOffsetY: 0, mobile: true },
  { id: "mid-right-partial", src: "/images/agenthub-site/hero-roles-r32/hero-game-system-architect-r32.webp", alt: "", slot: "mid-right-partial", zIndex: 2, tone: "outer", objectPosition: "50% 50%", subjectScale: 1, subjectOffsetX: 0, subjectOffsetY: 0, mobile: false },
  { id: "bottom-robot", src: "/images/agenthub-site/hero-roles-r32/hero-robot-tester-r32.webp", alt: "", slot: "bottom-robot", zIndex: 1, tone: "near", objectPosition: "50% 50%", subjectScale: 1, subjectOffsetX: 0, subjectOffsetY: 0, mobile: true },
  { id: "bottom-companion", src: "/images/agenthub-site/hero-roles-r32/hero-exploration-companion-r32.webp", alt: "", slot: "bottom-companion", zIndex: 2, tone: "near", objectPosition: "50% 50%", subjectScale: 1, subjectOffsetX: 0, subjectOffsetY: 0, mobile: true },
  { id: "bottom-operator", src: "/images/agenthub-site/hero-roles-r32/hero-operations-analyst-r32.webp", alt: "", slot: "bottom-operator", zIndex: 1, tone: "outer", objectPosition: "50% 50%", subjectScale: 1, subjectOffsetX: 0, subjectOffsetY: 0, mobile: false },
  { id: "bottom-fantasy", src: "/images/agenthub-site/hero-roles-r32/hero-silver-world-guardian-r32.webp", alt: "", slot: "bottom-fantasy", zIndex: 1, tone: "outer", objectPosition: "50% 50%", subjectScale: 1, subjectOffsetX: 0, subjectOffsetY: 0, mobile: true },
  { id: "right-mid-fantasy", src: "/images/agenthub-site/hero-roles-r32/hero-digital-content-curator-r32.webp", alt: "", slot: "right-mid-fantasy", zIndex: 2, tone: "outer", objectPosition: "50% 50%", subjectScale: 1, subjectOffsetX: 0, subjectOffsetY: 0, mobile: false },
  { id: "main", src: "/images/login-agent-portrait.png", alt: "", slot: "main", zIndex: 6, tone: "main", objectPosition: "50% 50%", subjectScale: 0.99, subjectOffsetX: -8, subjectOffsetY: 0, mobile: true },
];

const productStates: Array<{ id: ProductState; number: string; label: string; eyebrow: string; title: string; description: string }> = [
  { id: "identity", number: "01", label: "角色设定", eyebrow: "DEFINE", title: "先让角色站稳", description: "明确角色定位、表达方式与行为边界，让后续能力始终围绕同一个角色生长。" },
  { id: "knowledge", number: "02", label: "知识与技能", eyebrow: "ENRICH", title: "把真实能力接进来", description: "组织知识材料、技能与工具，让 Agent 面对任务时有清晰、可维护的能力来源。" },
  { id: "test", number: "03", label: "对话测试", eyebrow: "TEST", title: "在真实交流中打磨", description: "围绕关键场景连续对话，发现设定偏差，并回到构建工作区继续调整。" },
  { id: "runtime", number: "04", label: "发布运行", eyebrow: "RELEASE", title: "让版本走进真实场景", description: "确认版本、发行目标与运行状态，让已经准备好的 Agent 进入现有发布流程。" },
  { id: "iterate", number: "05", label: "持续迭代", eyebrow: "ITERATE", title: "把反馈带回下一轮", description: "从测试与版本记录中整理改进方向，继续调整角色、能力和对话表现。" },
];

type FlowPanelDefinition = {
  progress: number;
  summary: Array<{ label: string; value: string }>;
  cards: Array<{ icon: typeof UserFocus; eyebrow: string; title: string; body: string; meta: string }>;
  records: Array<{ item: string; detail: string; status: string }>;
};

const flowPanelDefinitions: Record<ProductState, FlowPanelDefinition> = {
  identity: {
    progress: 20,
    summary: [
      { label: "流程位置", value: "1 / 5" },
      { label: "配置状态", value: "草稿待确认" },
      { label: "下一动作", value: "补充行为边界" },
      { label: "保存边界", value: "登录后保存" },
    ],
    cards: [
      { icon: UserFocus, eyebrow: "角色核心", title: "定位与表达", body: "叙事顾问；表达克制、准确，优先梳理复杂设定。", meta: "示例工作项" },
      { icon: Stack, eyebrow: "行为边界", title: "先确认，再行动", body: "不虚构来源，不代替创作者执行未经确认的发布决定。", meta: "待补充一项" },
      { icon: ChatCircleText, eyebrow: "对话线索", title: "保持同一角色", body: "用角色动机、冲突与结果组织回答，避免脱离既定语气。", meta: "可继续编辑" },
    ],
    records: [
      { item: "角色定位", detail: "叙事顾问与核心受众", status: "已整理" },
      { item: "表达方式", detail: "克制、准确、结构清晰", status: "待确认" },
      { item: "行为边界", detail: "来源与发布决策约束", status: "待补充" },
    ],
  },
  knowledge: {
    progress: 40,
    summary: [
      { label: "流程位置", value: "2 / 5" },
      { label: "资源范围", value: "2 类示例资源" },
      { label: "能力状态", value: "1 项可配置" },
      { label: "校验状态", value: "待核对来源" },
    ],
    cards: [
      { icon: BookOpenText, eyebrow: "知识资源", title: "世界观与角色设定", body: "把长期设定与人物关系整理为可维护的知识来源。", meta: "示例资源" },
      { icon: Stack, eyebrow: "研究材料", title: "采访与资料索引", body: "保留资料类别与来源提示，便于创作者继续核对。", meta: "示例资源" },
      { icon: Code, eyebrow: "技能连接", title: "内容结构技能", body: "将复杂材料整理为主题、冲突与结果的表达结构。", meta: "可配置" },
    ],
    records: [
      { item: "设定资料", detail: "世界观、人物关系与长期约束", status: "已归类" },
      { item: "研究材料", detail: "采访与外部资料索引", status: "待校验" },
      { item: "结构技能", detail: "内容组织与表达提示", status: "可配置" },
    ],
  },
  test: {
    progress: 60,
    summary: [
      { label: "流程位置", value: "3 / 5" },
      { label: "测试场景", value: "3 个示例场景" },
      { label: "当前结果", value: "继续调整" },
      { label: "回流位置", value: "构建工作区" },
    ],
    cards: [
      { icon: ChatCircleText, eyebrow: "场景测试", title: "复杂设定讲解", body: "检查回答是否先给出核心判断，再逐层展开背景。", meta: "已完成" },
      { icon: UserFocus, eyebrow: "角色一致性", title: "语气与边界", body: "核对回答是否保持既定语气，并明确无法确认的来源。", meta: "发现一项偏差" },
      { icon: Code, eyebrow: "调整入口", title: "返回构建继续打磨", body: "把测试中发现的问题带回角色、知识或技能配置。", meta: "下一动作" },
    ],
    records: [
      { item: "首次问答", detail: "复杂设定的核心判断", status: "通过" },
      { item: "追问检查", detail: "来源提示与不确定性表达", status: "待调整" },
      { item: "角色语气", detail: "连续对话中的表达一致性", status: "通过" },
    ],
  },
  runtime: {
    progress: 80,
    summary: [
      { label: "流程位置", value: "4 / 5" },
      { label: "候选版本", value: "v1.0 · 示例" },
      { label: "发布状态", value: "尚未发布" },
      { label: "操作边界", value: "登录后确认" },
    ],
    cards: [
      { icon: RocketLaunch, eyebrow: "版本确认", title: "检查候选版本", body: "确认角色、知识与测试结果均来自同一份 Agent Asset。", meta: "示例版本" },
      { icon: Stack, eyebrow: "发行目标", title: "选择现有发布流程", body: "发行目标与权限需在登录后的真实工作区继续确认。", meta: "待选择" },
      { icon: Check, eyebrow: "发布边界", title: "明确状态再继续", body: "官网只展示流程结构，不将示例状态伪装为线上发布成功。", meta: "尚未发布" },
    ],
    records: [
      { item: "版本内容", detail: "角色、知识与测试结果", status: "待确认" },
      { item: "发行目标", detail: "现有渠道与应用边界", status: "待选择" },
      { item: "发布操作", detail: "进入登录工作区后继续", status: "未执行" },
    ],
  },
  iterate: {
    progress: 100,
    summary: [
      { label: "流程位置", value: "5 / 5" },
      { label: "参考版本", value: "v1.0 · 示例" },
      { label: "改进方向", value: "3 项待整理" },
      { label: "提交状态", value: "尚未提交" },
    ],
    cards: [
      { icon: UserFocus, eyebrow: "角色调整", title: "让边界更清晰", body: "把测试暴露出的角色偏差整理为下一轮设定修改。", meta: "本轮调整" },
      { icon: BookOpenText, eyebrow: "能力补充", title: "补齐研究材料来源", body: "更新知识资源时继续保留来源提示与校验状态。", meta: "待整理" },
      { icon: ChatCircleText, eyebrow: "回归检查", title: "回到对话测试", body: "再次覆盖关键场景，确认新调整没有破坏既有表现。", meta: "下一步" },
    ],
    records: [
      { item: "角色边界", detail: "收敛未经确认的行动表达", status: "待调整" },
      { item: "研究来源", detail: "补充资料出处与核对状态", status: "待整理" },
      { item: "回归测试", detail: "覆盖既有三类示例场景", status: "未开始" },
    ],
  },
};

const showcaseRoles: ShowcaseRole[] = [
  { id: 88, name: "墨衡", type: "叙事策略顾问", description: "梳理复杂设定与情节脉络，让角色在长期创作中保持一致。", image: "/images/agenthub-site/showcase-roles/showcase-moheng-narrative-strategist.webp", imagePosition: "49% 50%", boundary: "品牌示例", focus: "设定一致性" },
  { id: 71, name: "知序", type: "知识研究顾问", description: "整合资料、校验事实与出处，为每次回答建立可靠的知识依据。", image: "/images/agenthub-site/showcase-roles/showcase-zhixu-knowledge-researcher.webp", imagePosition: "50% 50%", boundary: "品牌示例", focus: "事实与来源" },
  { id: 96, name: "沐橙", type: "互动内容主持", description: "把品牌内容转化为自然、有节奏的互动，让每次对话更有参与感。", image: "/images/agenthub-site/showcase-roles/showcase-mucheng-interaction-host.webp", imagePosition: "51% 50%", boundary: "品牌示例", focus: "互动节奏" },
  { id: 112, name: "澄音", type: "用户服务伙伴", description: "识别需求与情绪，在清晰解决问题的同时保持稳定、友好的沟通体验。", image: "/images/agenthub-site/showcase-roles/showcase-chengyin-service-partner.webp", imagePosition: "50% 50%", boundary: "品牌示例", focus: "服务体验" },
  { id: 128, name: "拓野", type: "世界观探索向导", description: "围绕设定设计线索、任务与探索路径，持续拓展可沉浸的角色世界。", image: "/images/agenthub-site/showcase-roles/showcase-tuoye-world-guide.webp", imagePosition: "50% 50%", boundary: "品牌示例", focus: "世界观探索" },
];
const showcaseRoleIds = showcaseRoles.map((role) => role.id);

const creatorScenarios = [
  { number: "01", title: "独立创作者", copy: "从灵感到 Agent，一站完成", image: "/images/agenthub-site/use-case-independent-creator-r26.webp", position: "50% 50%" },
  { number: "02", title: "IP / 内容团队", copy: "多人协作，共同完善 Agent", image: "/images/agenthub-site/use-case-ip-content-team-r26.webp", position: "50% 48%" },
  { number: "03", title: "Agent 运营团队", copy: "持续测试、发布与运营", image: "/images/agenthub-site/use-case-agent-operations-r26.webp", position: "50% 50%" },
];
const intentSuggestions = ["东方神话故事 Agent", "团队知识问答 Agent", "陪伴型角色 Agent"];

export function flowStageFromProgress(progress: number, stageCount = productStates.length) {
  const bounded = Math.max(0, Math.min(1, progress));
  return Math.round(bounded * Math.max(0, stageCount - 1));
}

export function PublicLandingPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [intent, setIntent] = useState("");
  const [intentReady, setIntentReady] = useState(false);
  const flowRef = useRef<HTMLElement | null>(null);
  const manualSelectionUntil = useRef(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;
    let frame = 0;
    const updateActiveStep = () => {
      frame = 0;
      if (window.innerWidth <= 780 || performance.now() < manualSelectionUntil.current) return;
      const flow = flowRef.current;
      if (!flow) return;
      const travel = Math.max(1, flow.offsetHeight - window.innerHeight);
      const nextStep = flowStageFromProgress(-flow.getBoundingClientRect().top / travel);
      setActiveStep((current) => current === nextStep ? current : nextStep);
    };
    const scheduleUpdate = () => { if (!frame) frame = window.requestAnimationFrame(updateActiveStep); };
    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  function selectStep(index: number) {
    manualSelectionUntil.current = performance.now() + 1100;
    setActiveStep(index);
    if (window.innerWidth <= 780) return;
    const flow = flowRef.current;
    if (!flow) return;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const flowTop = window.scrollY + flow.getBoundingClientRect().top;
    const travel = Math.max(1, flow.offsetHeight - window.innerHeight);
    window.scrollTo({ top: flowTop + (index / Math.max(1, productStates.length - 1)) * travel, behavior: reducedMotion ? "auto" : "smooth" });
  }

  function scrollToSection(event: MouseEvent<HTMLAnchorElement>, id: string) {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }

  function submitIntent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = intent.trim().replace(/\s+/g, " ");
    if (!normalized) return;
    window.sessionStorage.setItem(CREATION_INTENT_SESSION_KEY, normalized);
    setIntent(normalized);
    setIntentReady(true);
  }

  const currentProduct = productStates[activeStep] ?? productStates[0];

  return <main className={styles.site}>
    <a className={styles.skipLink} href="#main-content">跳到主要内容</a>
    <header className={styles.header}>
      <a className={styles.brand} href="#top" aria-label="AgentHub 首页" onClick={(event) => scrollToSection(event, "top")}><Image className={styles.brandMark} src="/images/agenthub-logo.png" width={30} height={30} alt="" /><span>AgentHub</span></a>
      <nav className={styles.nav} aria-label="官网导航"><a href="#product" onClick={(event) => scrollToSection(event, "product")}>管理能力</a><a href="#flow" onClick={(event) => scrollToSection(event, "flow")}>运营流程</a><a href="#scenarios" onClick={(event) => scrollToSection(event, "scenarios")}>使用场景</a><a href="#assets" onClick={(event) => scrollToSection(event, "assets")}>角色资产</a><a href="#create" onClick={(event) => scrollToSection(event, "create")}>创建</a><a href="#product" onClick={(event) => scrollToSection(event, "product")}>产品边界</a></nav>
      <Link className={styles.loginLink} href={CREATE_LOGIN_HREF}>登录平台</Link>
    </header>

    <section id="top" className={styles.hero} aria-labelledby="hero-title">
      <div id="main-content" className={styles.heroCopy}>
        <h1 id="hero-title"><span>管理</span><span><em>每一个</em> AI 角色</span><span>让能力持续进化</span></h1>
        <p className={styles.heroLead}>统一管理角色设定、知识能力、版本与发布，<br />实时掌握运行状态，让每个 Agent 稳定成长。</p>
        <Link className={styles.heroCta} href={CREATE_LOGIN_HREF}>进入工作台</Link>
        <div className={styles.heroStatus} aria-label="示例角色与真实创作阶段">
          <span className={styles.heroAvatars} aria-hidden="true"><Image src="/images/agenthub-site/hero-roles-r32/hero-system-strategist-r32.webp" width={28} height={28} alt="" /><Image src="/images/agenthub-site/hero-roles-r32/hero-game-content-host-r32.webp" width={28} height={28} alt="" /><Image src="/images/agenthub-site/hero-roles-r32/hero-robot-tester-r32.webp" width={28} height={28} alt="" /><Image src="/images/agenthub-site/hero-roles-r32/hero-exploration-companion-r32.webp" width={28} height={28} alt="" /></span>
          <span><strong>05 个阶段</strong><small>覆盖角色设定到持续迭代</small></span>
        </div>
      </div>
      <figure className={styles.heroPortraits} aria-hidden="true">
        <div className={styles.heroRoleStage} data-hero-role-stage="design-1503x734">
          {heroRoleCardSlots.map((card) => <div key={card.id} className={styles.heroRoleCard} data-hero-role-card data-hero-role-slot={card.slot} data-hero-role-main={card.id === "main" ? "true" : undefined} data-tone={card.tone} data-mobile={card.mobile ? "true" : "false"} style={{ zIndex: card.zIndex }}><div className={styles.heroRoleFrame} data-hero-role-frame><div className={styles.heroRoleImage} data-hero-role-image style={{ "--hero-subject-scale": card.subjectScale.toFixed(3), "--hero-subject-offset-x": `${card.subjectOffsetX}%`, "--hero-subject-offset-y": `${card.subjectOffsetY}%` } as CSSProperties}><Image src={card.src} alt={card.alt} fill sizes="(max-width: 780px) 46vw, 32vw" priority={card.id === "main"} style={{ objectPosition: card.objectPosition }} /></div></div></div>)}
        </div>
      </figure>
    </section>

    <RoleAssetShowcase />

    <section id="product" ref={flowRef} className={styles.flowSection} aria-labelledby="flow-title">
      <span id="flow" className={styles.anchorMarker} aria-hidden="true" />
      <div className={styles.flowSticky}>
        <header className={styles.flowHeading}><p className={styles.kicker}>02 / CREATION FLOW</p><h2 id="flow-title"><span className={styles.flowTitleLine}>一个 Agent，</span><span className={styles.flowTitleLine}><em>从创建到运营</em></span></h2><p>角色、知识、测试、发布、迭代，完整流程统一管理。</p></header>
        <div className={styles.flowGrid}>
          <nav className={styles.stepNav} aria-label="五步创作流程">{productStates.map((step, index) => <button key={step.id} type="button" className={activeStep === index ? styles.stepButtonActive : styles.stepButton} aria-current={activeStep === index ? "step" : undefined} aria-controls="flow-product-panel" onClick={() => selectStep(index)}><i>{step.number}</i><span><strong>{step.label}</strong><small>{step.description}</small></span></button>)}</nav>
          <div className={styles.productScene}><div id="flow-product-panel" className={styles.productWindow} aria-live="polite" aria-label="AgentHub 真实产品结构示意"><div className={styles.windowBar}><span className={styles.miniBrand}><Image className={styles.brandMark} src="/images/agenthub-logo.png" width={18} height={18} alt="" />AgentHub</span><span>Agent Asset / 墨衡</span><span className={styles.windowStatus}>产品界面示意</span></div><div className={styles.productBody}><aside className={styles.productRail} aria-label="Agent Asset 导航"><div className={styles.agentIdentity}><span className={styles.avatar}>墨</span><span><b>墨衡</b><small>叙事顾问 · 草稿</small></span></div><span className={currentProduct.id === "identity" || currentProduct.id === "knowledge" ? styles.railActive : ""}>构建</span><span className={currentProduct.id === "test" ? styles.railActive : ""}>测试</span><span className={currentProduct.id === "iterate" ? styles.railActive : ""}>版本</span><span className={currentProduct.id === "runtime" ? styles.railActive : ""}>发行</span></aside><div className={styles.productContent} data-state={currentProduct.id}><div className={styles.productStageTop}><p>{currentProduct.number} · {currentProduct.eyebrow}</p><span>{currentProduct.label}</span></div><h3>{currentProduct.title}</h3><p>{currentProduct.description}</p><ProductStatePanel state={currentProduct.id} /></div></div></div><span className={styles.flowCount}>{currentProduct.number}</span></div>
        </div>
      </div>
    </section>

    <section id="scenarios" className={styles.scenarioSection} aria-labelledby="scenario-title"><div className={styles.scenarioHeading}><p className={styles.kicker}>03 / USE CASES</p><h2 id="scenario-title"><span className={styles.scenarioTitleLine}>覆盖 Agent</span><span className={styles.scenarioTitleLine}>全生命周期</span></h2><p>从角色创建、内容协作到测试与运营，为不同团队提供统一的 Agent 管理与协作能力。</p></div><div className={styles.scenarioList}>{creatorScenarios.map((scenario) => <article key={scenario.number} className={styles.scenarioItem}><Image src={scenario.image} alt="" fill sizes="(max-width: 780px) 100vw, 33vw" style={{ objectPosition: scenario.position }} /><div className={styles.scenarioCopy}><span>{scenario.number}</span><div><h3>{scenario.title}</h3><p>{scenario.copy}</p></div></div></article>)}</div></section>

    <section id="create" className={styles.intentSection} aria-labelledby="intent-title"><Image className={styles.intentAtmosphere} src="/images/agenthub-site/dark-lime-atmosphere.png" alt="" fill sizes="100vw" /><div className={styles.intentIntro}><p className={styles.kicker}>04 / START WITH INTENT</p><h2 id="intent-title"><span className={styles.intentTitleLine}>快速创建、测试与管理 Agent，</span><span className={styles.intentTitleLine}>让每一个角色的运营更简单。</span></h2></div><div className={styles.intentPanel} data-ready={intentReady}>{!intentReady ? <form onSubmit={submitIntent} className={styles.intentForm}><label className={styles.intentLabel} htmlFor="creation-intent">你想创造怎样的 Agent？</label><div className={styles.intentControl}><textarea id="creation-intent" value={intent} onChange={(event) => setIntent(event.target.value)} rows={3} maxLength={240} placeholder="例如：我想创造一个熟悉东方神话、表达克制的故事 Agent" required /><button type="submit" aria-label="整理创建意图"><PaperPlaneTilt weight="fill" aria-hidden="true" /></button></div><div className={styles.intentSuggestions} aria-label="创建意图示例">{intentSuggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => setIntent(`我想创造一个${suggestion}`)}>{suggestion}</button>)}</div></form> : <div className={styles.intentSummary} aria-live="polite"><p className={styles.summaryLabel}><Sparkle weight="fill" aria-hidden="true" /> 意图已整理</p><blockquote>“{intent}”</blockquote><div className={styles.summaryTags}><span><UserFocus aria-hidden="true" /> 角色方向</span><span><BookOpenText aria-hidden="true" /> 知识主题</span><span><ChatCircleText aria-hidden="true" /> 表达方式</span></div><p>这份内容只保留在当前浏览器会话。继续生成与保存前，需要登录或使用邀请码注册。</p><div className={styles.intentActions}><Link className={styles.primaryButton} href={CREATE_LOGIN_HREF}>登录后开始创建 <ArrowRight aria-hidden="true" /></Link><Link className={styles.secondaryButton} href={CREATE_REGISTER_HREF}>使用邀请码注册</Link></div><button className={styles.editIntent} type="button" onClick={() => setIntentReady(false)}>返回修改意图</button></div>}</div></section>

    <footer className={styles.footer}><a className={styles.brand} href="#top" onClick={(event) => scrollToSection(event, "top")}><Image className={styles.brandMark} src="/images/agenthub-logo.png" width={26} height={26} alt="" /><span>AgentHub</span></a><nav aria-label="页脚导航"><a href="#product" onClick={(event) => scrollToSection(event, "product")}>产品能力</a><a href="#flow" onClick={(event) => scrollToSection(event, "flow")}>创作流程</a><a href="#scenarios" onClick={(event) => scrollToSection(event, "scenarios")}>使用场景</a><a href="#assets" onClick={(event) => scrollToSection(event, "assets")}>角色资产</a><Link href={CREATE_LOGIN_HREF}>登录工作台</Link></nav><span>© 2026 AgentHub</span></footer>
  </main>;
}

function RoleAssetShowcase() {
  const transition = useWorkbenchAgentTransition(showcaseRoleIds);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [resetGeneration, setResetGeneration] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const documentHidden = useDocumentHidden();
  const visualFocusId = transition.phase === "sliding" ? transition.targetId : transition.displayedId;
  const activeIndex = Math.max(0, showcaseRoleIds.indexOf(visualFocusId ?? showcaseRoleIds[0]));
  const currentRole = showcaseRoles.find((role) => role.id === visualFocusId) ?? showcaseRoles[0];
  const { request, requestRelative: transitionRequestRelative } = transition;
  const advance = useCallback(() => transitionRequestRelative(1), [transitionRequestRelative]);
  useWorkbenchAutoplay({ agentCount: showcaseRoles.length, phase: transition.phase, hovered, focusWithin, documentHidden, reducedMotion }, resetGeneration, advance);
  const requestRelative = useCallback((offset: number) => { setResetGeneration((value) => value + 1); transitionRequestRelative(offset); }, [transitionRequestRelative]);
  const requestRole = useCallback((roleId: number, direction: -1 | 1) => { setResetGeneration((value) => value + 1); request(roleId, direction); }, [request]);
  const cards = useMemo(() => showcaseRoles.map((role) => {
    const committedSlot = boundedCarouselSlot(circularAgentSlot(showcaseRoleIds, transition.displayedId, role.id));
    const visualSlot = boundedCarouselSlot(circularAgentSlot(showcaseRoleIds, visualFocusId, role.id));
    return { role, visualSlot, visible: Math.abs(committedSlot) <= 2 || Math.abs(visualSlot) <= 2, primary: transition.phase === "idle" && role.id === transition.displayedId };
  }), [transition.displayedId, transition.phase, visualFocusId]);

  return <section id="assets" className={styles.assetSection} aria-labelledby="assets-title"><div className={styles.assetIntro}><p className={styles.kicker}>01 / ROLE ASSETS</p><h2 id="assets-title"><span className={styles.assetTitleLine}>让角色管理</span><span className={styles.assetTitleLine}>更清晰、更高效。</span></h2><p>把角色设定、知识、技能、测试与版本收进同一份 Agent Asset。这里展示的是品牌示例角色，不代表线上真实运行数据。</p><div className={styles.assetControls}><button type="button" aria-label="上一个示例角色" onClick={() => requestRelative(-1)}><CaretLeft aria-hidden="true" /></button><button type="button" aria-label="下一个示例角色" onClick={() => requestRelative(1)}><CaretRight aria-hidden="true" /></button><span aria-live="polite" aria-atomic="true" aria-label={`当前示例角色：${currentRole.name}，${currentRole.type}`}><b>{String(activeIndex + 1).padStart(2, "0")}</b> / {String(showcaseRoles.length).padStart(2, "0")}</span></div></div><div className={styles.assetCarousel} data-transition-phase={transition.phase} data-transition-direction={transition.direction < 0 ? "previous" : "next"} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocusWithin(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusWithin(false); }}><div className={styles.assetLayer}>{cards.map(({ role, visualSlot, visible, primary }) => { const selectable = transition.phase === "idle" && visible && visualSlot !== 0; return <article key={role.id} className={styles.assetCard} data-role-id={role.id} data-slot={visualSlot} data-visible={visible} data-primary={primary} aria-hidden={visible ? undefined : true} inert={visible ? undefined : true}><Image src={role.image} alt={`${role.name}，${role.type}，${role.boundary}`} fill sizes="(max-width: 780px) 212px, 280px" priority={role.id === showcaseRoles[0].id} style={{ objectPosition: role.imagePosition }} />{selectable && <button type="button" className={styles.sideSelect} onClick={() => requestRole(role.id, visualSlot < 0 ? -1 : 1)} aria-label={`聚焦 ${role.name}`} />}<div className={styles.assetCardCopy}><span>{role.boundary} · {role.focus}</span><h3>{role.name}</h3><p>{role.type}</p><small>{role.description}</small></div></article>; })}</div><div className={styles.assetProgress} aria-label="示例角色进度">{showcaseRoles.map((role, index) => <button key={role.id} type="button" aria-label={`切换到 ${role.name}`} aria-current={index === activeIndex ? "true" : undefined} onClick={() => requestRole(role.id, index < activeIndex ? -1 : 1)}><span /></button>)}</div></div></section>;
}

function ProductStatePanel({ state }: { state: ProductState }) {
  const panel = flowPanelDefinitions[state];
  return <div className={styles.flowPanel} aria-label={`${productStates.find((item) => item.id === state)?.label ?? "当前阶段"}结构示意`}>
    <section className={styles.flowSummary} aria-label="当前阶段示意摘要">
      <div className={styles.flowSummaryGrid}>{panel.summary.map((item) => <dl key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></dl>)}</div>
      <div className={styles.flowProgress}><span>五阶段流程进度</span><div aria-hidden="true"><i style={{ width: `${panel.progress}%` }} /></div><b>{panel.summary[0]?.value}</b></div>
    </section>
    <section className={styles.flowWorkItems} aria-label="当前阶段工作项">
      {panel.cards.map((card) => { const Icon = card.icon; return <article key={card.title} data-flow-card><div className={styles.flowCardTop}><Icon weight="duotone" aria-hidden="true" /><span>{card.eyebrow}</span></div><h4>{card.title}</h4><p>{card.body}</p><small>{card.meta}</small></article>; })}
    </section>
    <section className={styles.flowRecords} aria-label="近期示例记录">
      <div className={styles.flowRecordsTitle}><span>近期记录</span><small>仅展示当前阶段的中性示例状态</small></div>
      <div className={styles.flowRecordTable} role="table" aria-label="当前阶段近期记录">
        {panel.records.map((record) => <div key={record.item} role="row"><span role="cell">{record.item}</span><span role="cell">{record.detail}</span><strong role="cell"><Check aria-hidden="true" />{record.status}</strong></div>)}
      </div>
    </section>
  </div>;
}
