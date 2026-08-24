"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  Brain,
  ChatCircleText,
  Check,
  CheckCircle,
  CirclesThreePlus,
  Code,
  Compass,
  LockKey,
  PaperPlaneTilt,
  RocketLaunch,
  Sparkle,
  Stack,
  UserFocus,
} from "@phosphor-icons/react";
import { FormEvent, MouseEvent, useEffect, useRef, useState } from "react";
import styles from "./public-landing-page.module.css";

export const CREATION_INTENT_SESSION_KEY = "agenthub_public_creation_intent";
export const CREATE_LOGIN_HREF = "/login?next=%2Fassets%2Fcreate";
export const CREATE_REGISTER_HREF = "/register?next=%2Fassets%2Fcreate";

type ProductState = "identity" | "knowledge" | "test" | "runtime";

const productStates: Array<{
  id: ProductState;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
}> = [
  { id: "identity", label: "角色设定", eyebrow: "01 · DEFINE", title: "先让角色站稳", description: "明确角色定位、性格边界与表达方式，为后续能力配置建立一致基线。" },
  { id: "knowledge", label: "知识与技能", eyebrow: "02 · ENRICH", title: "把专业能力接进来", description: "组织知识材料、技能与工具，让 Agent 在真实任务中有据可依。" },
  { id: "test", label: "对话测试", eyebrow: "03 · TEST", title: "在真实交流中打磨", description: "通过连续对话发现偏差，回到设定与能力配置继续优化。" },
  { id: "runtime", label: "发布运行", eyebrow: "04 · RUN", title: "发布后继续看见状态", description: "确认版本与运行状态，让已发布 Agent 进入持续运营与迭代。" },
];

const creationSteps = [
  { number: "01", title: "定义角色", description: "确定它是谁、面向谁，以及什么该做、什么不该做。", detail: "角色设定", body: "把创作构想变成清晰的角色定位、叙事语气和行为边界。", icon: UserFocus },
  { number: "02", title: "丰富能力", description: "连接知识、技能与业务流程，让能力有真实来源。", detail: "知识与技能", body: "组织知识材料，选择适合的技能和工具，形成可持续维护的能力组合。", icon: Brain },
  { number: "03", title: "对话打磨", description: "在真实交流中发现问题，而不是靠想象判断。", detail: "测试与评估", body: "围绕关键场景展开对话测试，观察回答质量并定位需要继续调整的部分。", icon: ChatCircleText },
  { number: "04", title: "发布运行", description: "确认版本与渠道，让 Agent 进入实际使用场景。", detail: "发行与运行", body: "通过现有发布流程管理版本与运行状态，让每次变化都有明确承接。", icon: RocketLaunch },
  { number: "05", title: "持续迭代", description: "根据使用反馈更新设定与能力，让 Agent 越用越好。", detail: "版本迭代", body: "回到构建、测试和版本记录中持续优化，不把发布当成创作的终点。", icon: CirclesThreePlus },
];

const creatorScenarios = [
  { number: "01", title: "独立 Agent 创作者", copy: "从一句灵感开始，把角色、知识与表达方式沉淀为可以持续打磨的 Agent Asset。", tag: "角色设定", icon: UserFocus },
  { number: "02", title: "IP 与内容团队", copy: "在同一条创作路径上梳理角色规范、知识材料和能力配置，让多人协作保持一致。", tag: "知识协作", icon: BookOpenText },
  { number: "03", title: "Agent 运营团队", copy: "把真实对话中的反馈带回测试、版本与发行流程，让发布成为下一轮迭代的开始。", tag: "测试与运营", icon: RocketLaunch },
];

export function PublicLandingPage() {
  const [productState, setProductState] = useState<ProductState>("test");
  const [activeStep, setActiveStep] = useState(2);
  const [intent, setIntent] = useState("");
  const [intentReady, setIntentReady] = useState(false);
  const stepRefs = useRef<Array<HTMLElement | null>>([]);
  const manualSelectionUntil = useRef(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    let frame = 0;
    const updateActiveStep = () => {
      frame = 0;
      if (performance.now() < manualSelectionUntil.current) return;

      const focusLine = window.innerHeight * 0.34;
      let closestIndex = activeStep;
      let closestDistance = Number.POSITIVE_INFINITY;

      stepRefs.current.forEach((node, index) => {
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height * 0.42 - focusLine);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveStep((current) => (current === closestIndex ? current : closestIndex));
    };
    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActiveStep);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  // The flow state is derived from geometry; activeStep stays intentionally outside this effect.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function selectStep(index: number) {
    manualSelectionUntil.current = performance.now() + 1100;
    setActiveStep(index);
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    stepRefs.current[index]?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
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

  const currentProduct = productStates.find((item) => item.id === productState) ?? productStates[2];

  return (
    <main className={styles.site}>
      <a className={styles.skipLink} href="#main-content">跳到主要内容</a>
      <PrintMarks />

      <header className={styles.header}>
        <a className={styles.brand} href="#top" aria-label="AgentHub 首页" onClick={(event) => scrollToSection(event, "top")}>
          <Image src="/images/agenthub-site/living-agenthub-mark.png" width={25} height={25} alt="" />
          <span>AgentHub</span>
        </a>
        <nav className={styles.nav} aria-label="官网导航">
          <a href="#product" onClick={(event) => scrollToSection(event, "product")}>产品能力</a>
          <a href="#flow" onClick={(event) => scrollToSection(event, "flow")}>创作流程</a>
          <a href="#scenarios" onClick={(event) => scrollToSection(event, "scenarios")}>使用场景</a>
        </nav>
        <div className={styles.headerActions}>
          <Link className={styles.loginLink} href={CREATE_LOGIN_HREF}>登录工作台</Link>
        </div>
      </header>

      <section id="top" className={styles.hero} aria-labelledby="hero-title">
        <Image className={styles.blueprintImage} src="/images/agenthub-site/living-blueprint-line.png" alt="" fill sizes="100vw" priority />
        <div id="main-content" className={styles.heroCopy}>
          <h1 id="hero-title">让一个想法，<br />长成一个 <em>Agent</em></h1>
          <p className={styles.ideaWord}>Idea</p>
          <p className={styles.heroLead}>从角色设定，到知识与技能，再到对话测试、发布与持续运营，<br />AgentHub 帮助创作者完成从 0 到 1 的每一步。</p>
          <a className={styles.heroCta} href="#create" onClick={(event) => scrollToSection(event, "create")}>开始创建 <ArrowRight aria-hidden="true" /></a>
        </div>

        <div className={styles.heroMilestones} aria-hidden="true">
          <BlueprintNote className={styles.noteIdentity} title="角色设定" copy="定义 Agent 的身份与行为边界" />
          <BlueprintNote className={styles.noteKnowledge} title="知识与技能" copy="连接知识、配置能力，让 Agent 真正有用" />
          <BlueprintNote className={styles.noteTest} title="对话测试" copy="在真实交流中打磨体验与效果" />
          <BlueprintNote className={styles.noteRuntime} title="发布上线" copy="发布到现有渠道，并持续运营迭代" />
        </div>

      </section>

      <section id="product" className={styles.productSection} aria-labelledby="product-title">
        <div className={styles.editorialHeading}>
          <p className={styles.kicker}>01 / INSIDE AGENTHUB</p>
          <h2 id="product-title">创造不是一次生成，<br />而是一条持续生长的路径。</h2>
          <p>同一个 Agent Asset 工作区，承接构建、测试、版本与发行。每一步都能回看，每一次发布都有真实状态。</p>
        </div>

        <div className={styles.productStage}>
          <div className={styles.stateTabs} role="tablist" aria-label="Agent 创建状态">
            {productStates.map((state) => (
              <button key={state.id} type="button" role="tab" aria-selected={productState === state.id} aria-controls="product-state-panel" className={productState === state.id ? styles.stateTabActive : styles.stateTab} onClick={() => setProductState(state.id)}>
                {state.label}
              </button>
            ))}
          </div>
          <div id="product-state-panel" className={styles.productWindow} role="tabpanel">
            <div className={styles.windowBar}>
              <span className={styles.miniBrand}><Image src="/images/agenthub-site/living-agenthub-mark.png" width={17} height={17} alt="" />AgentHub</span>
              <span>Agent Asset / 墨衡</span>
              <span className={styles.windowStatus}>产品界面示意 · DEMO</span>
            </div>
            <div className={styles.productBody}>
              <aside className={styles.productRail} aria-label="Agent Asset 导航">
                <div className={styles.agentIdentity}><span className={styles.avatar}>墨</span><span><b>墨衡</b><small>叙事顾问 · 草稿</small></span></div>
                <span className={productState === "identity" || productState === "knowledge" ? styles.railActive : ""}>构建</span>
                <span className={productState === "test" ? styles.railActive : ""}>测试</span>
                <span>版本</span>
                <span className={productState === "runtime" ? styles.railActive : ""}>发行</span>
              </aside>
              <div className={styles.productStateViewport}>
                {productStates.map((state) => (
                  <div key={state.id} className={`${styles.productContent} ${styles.productStateSlide}`} data-active={productState === state.id} aria-hidden={productState !== state.id}>
                    <p className={styles.panelEyebrow}>{state.eyebrow}</p>
                    <h3>{state.title}</h3>
                    <p>{state.description}</p>
                    <ProductStatePanel state={state.id} />
                  </div>
                ))}
              </div>
              <aside className={styles.productContext}>
                <span className={styles.contextLabel}>当前视图</span>
                <strong>{currentProduct.label}</strong>
                <p>{productState === "runtime" ? "发行状态可追踪" : "未发布 · 草稿"}</p>
                <span className={styles.contextCheck}><CheckCircle weight="fill" aria-hidden="true" /> 状态清晰可追踪</span>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <section id="flow" className={styles.flowSection} aria-labelledby="flow-title">
        <div className={styles.flowIntro}>
          <p className={styles.kicker}>02 / CREATION FLOW</p>
          <h2 id="flow-title">从构想到<br />真正运行</h2>
          <p>五个阶段，不是五张孤立的表单。它们沿着同一条创作脉络，反复验证、持续生长。</p>
          <div className={styles.stepNav} aria-label="五步创作流程">
            {creationSteps.map((step, index) => (
              <button key={step.number} type="button" className={activeStep === index ? styles.stepButtonActive : styles.stepButton} aria-current={activeStep === index ? "step" : undefined} onClick={() => selectStep(index)}>
                <span>{step.number}</span>{step.title}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.stepPanels}>
          {creationSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article key={step.number} ref={(node) => { stepRefs.current[index] = node; }} data-step={index} data-active={activeStep === index} className={`${styles.stepPanel} ${activeStep === index ? styles.stepPanelActive : ""}`}>
                <div className={styles.stepIndex}><span>{step.number}</span><Icon aria-hidden="true" /></div>
                <div className={styles.stepCopy}>
                  <p>{step.detail}</p>
                  <h3>{step.title}</h3>
                  <strong>{step.description}</strong>
                  <p>{step.body}</p>
                </div>
                <StepPreview index={index} />
              </article>
            );
          })}
        </div>
      </section>

      <section id="scenarios" className={styles.scenarioSection} aria-labelledby="scenario-title">
        <div className={styles.scenarioHeading}>
          <p className={styles.kicker}>03 / CREATOR SCENARIOS</p>
          <h2 id="scenario-title">为每一种<br />Agent 创作者而生</h2>
          <p>不论从一个人的灵感出发，还是从团队的内容与运营流程出发，都能沿着同一条真实创作路径前进。</p>
        </div>
        <div className={styles.scenarioList}>
          {creatorScenarios.map((scenario) => {
            const Icon = scenario.icon;
            return (
              <article key={scenario.number} className={styles.scenarioItem}>
                <span className={styles.scenarioNumber}>{scenario.number}</span>
                <div className={styles.scenarioIcon}><Icon aria-hidden="true" /></div>
                <div>
                  <p>{scenario.tag}</p>
                  <h3>{scenario.title}</h3>
                  <p>{scenario.copy}</p>
                </div>
                <ArrowRight aria-hidden="true" />
              </article>
            );
          })}
        </div>
      </section>

      <section id="create" className={styles.intentSection} aria-labelledby="intent-title">
        <div className={styles.intentIntro}>
          <p className={styles.kicker}>04 / START WITH INTENT</p>
          <h2 id="intent-title">从一句话开始，<br />让它走进真实世界。</h2>
          <p>先描述你想创造的 Agent，我们会在本次浏览器会话中整理这份创作意图。</p>
        </div>
        <div className={styles.intentPanel} data-ready={intentReady}>
          {!intentReady ? (
            <form onSubmit={submitIntent} className={styles.intentForm}>
              <label htmlFor="creation-intent">你想创造怎样的 Agent？</label>
              <div className={styles.intentControl}>
                <textarea id="creation-intent" value={intent} onChange={(event) => setIntent(event.target.value)} rows={3} maxLength={240} placeholder="例如：我想创造一个熟悉东方神话、表达克制的故事 Agent" required />
                <button type="submit" aria-label="整理创建意图"><PaperPlaneTilt weight="fill" aria-hidden="true" /></button>
              </div>
              <div className={styles.intentMeta}><span>{intent.length}/240</span><span><LockKey aria-hidden="true" /> 仅暂存在本次浏览器会话，不会提交到服务器</span></div>
            </form>
          ) : (
            <div className={styles.intentSummary} aria-live="polite">
              <p className={styles.summaryLabel}><Sparkle weight="fill" aria-hidden="true" /> 意图已整理</p>
              <blockquote>“{intent}”</blockquote>
              <div className={styles.summaryTags}><span><UserFocus aria-hidden="true" /> 角色方向</span><span><BookOpenText aria-hidden="true" /> 知识主题</span><span><ChatCircleText aria-hidden="true" /> 表达方式</span></div>
              <p>这份内容只保留在当前浏览器会话。继续生成与保存前，需要登录或使用邀请码注册。</p>
              <div className={styles.intentActions}>
                <Link className={styles.primaryButton} href={CREATE_LOGIN_HREF}>登录后开始创建 <ArrowRight aria-hidden="true" /></Link>
                <Link className={styles.secondaryButton} href={CREATE_REGISTER_HREF}>使用邀请码注册</Link>
              </div>
              <button className={styles.editIntent} type="button" onClick={() => setIntentReady(false)}>返回修改意图</button>
            </div>
          )}
        </div>
      </section>

      <footer className={styles.footer}>
        <a className={styles.brand} href="#top" onClick={(event) => scrollToSection(event, "top")}><Image src="/images/agenthub-site/living-agenthub-mark.png" width={25} height={25} alt="" /><span>AgentHub</span></a>
        <nav aria-label="页脚导航"><a href="#product" onClick={(event) => scrollToSection(event, "product")}>产品能力</a><a href="#flow" onClick={(event) => scrollToSection(event, "flow")}>创作流程</a><a href="#scenarios" onClick={(event) => scrollToSection(event, "scenarios")}>使用场景</a><Link href={CREATE_LOGIN_HREF}>登录工作台</Link></nav>
        <span>© 2026 AgentHub</span>
      </footer>
    </main>
  );
}

function PrintMarks() {
  return (
    <div className={styles.printMarks} aria-hidden="true">
      <Image src="/images/agenthub-site/print-registration-mark.png" width={56} height={56} alt="" />
      <Image src="/images/agenthub-site/print-registration-mark.png" width={56} height={56} alt="" />
      <Image src="/images/agenthub-site/print-registration-mark.png" width={56} height={56} alt="" />
      <Image src="/images/agenthub-site/print-registration-mark.png" width={56} height={56} alt="" />
    </div>
  );
}

function BlueprintNote({ className, title, copy }: { className: string; title: string; copy: string }) {
  return <div className={className}><b>{title}</b><span>{copy}</span></div>;
}

function ProductStatePanel({ state }: { state: ProductState }) {
  if (state === "identity") return <div className={styles.identityPanel}><UserFocus size={34} weight="duotone" aria-hidden="true" /><div><b>角色核心</b><p>克制、准确、擅长把复杂素材整理成可讲述的故事。</p></div><div><b>行为边界</b><p>不虚构来源；不替代创作者做未经确认的发布决定。</p></div></div>;
  if (state === "knowledge") return <div className={styles.resourcePanel}><ResourceRow icon={BookOpenText} name="世界观与角色设定" status="已连接" /><ResourceRow icon={Stack} name="采访与研究材料" status="已连接" /><ResourceRow icon={Code} name="内容结构技能" status="可配置" /></div>;
  if (state === "runtime") return <div className={styles.runtimePanel}><RocketLaunch size={36} weight="duotone" aria-hidden="true" /><div><span>当前版本</span><strong>v1.0 · 已发布</strong></div><div><span>运行状态</span><strong className={styles.liveText}>运行中</strong></div></div>;
  return <div className={styles.chatPanel}><div className={styles.promptBubble}>如何让一段复杂设定更容易理解？</div><div className={styles.answerBubble}><span className={styles.avatar}>墨</span><p>先明确读者需要带走的核心判断，再用角色动机、冲突和结果组织材料。我们可以逐段检查。</p></div><div className={styles.chatInput}>输入测试问题… <PaperPlaneTilt aria-hidden="true" /></div></div>;
}

function ResourceRow({ icon: Icon, name, status }: { icon: typeof Compass; name: string; status: string }) {
  return <div><Icon weight="duotone" aria-hidden="true" /><span><b>{name}</b><small><Check aria-hidden="true" /> {status}</small></span></div>;
}

function StepPreview({ index }: { index: number }) {
  if (index === 0) return <div className={styles.stepDemo}><span>角色定位</span><b>东方叙事顾问</b><span>表达风格</span><b>克制 · 清晰 · 有依据</b></div>;
  if (index === 1) return <div className={styles.stepDemo}><span><BookOpenText aria-hidden="true" /> 世界观设定</span><span><Stack aria-hidden="true" /> 研究材料</span><span><Code aria-hidden="true" /> 内容结构技能</span></div>;
  if (index === 2) return <div className={styles.stepDemo}><span className={styles.demoPrompt}>如何让复杂设定更容易理解？</span><span className={styles.demoAnswer}>先明确读者需要带走的核心判断，再用角色动机与结果组织材料。</span></div>;
  if (index === 3) return <div className={styles.stepDemo}><span>版本</span><b>v1.0 · 已发布</b><span>状态</span><b className={styles.liveText}>运行中</b></div>;
  return <div className={styles.stepDemo}><span>草稿调整</span><b>角色边界更清晰</b><span>下一步</span><b>回到对话测试</b></div>;
}
