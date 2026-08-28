# LYN-005-I3 R8 · PublicLandingPage 连贯性审查（修复前）

- 审查日期：2026-08-28
- 审查范围：仅 `PublicLandingPage`
- 页面：`http://127.0.0.1:3002/`
- 视口：1440×1000、390×844，deviceScaleFactor 1
- 证据：`docs/qa/images/lyn-005-i3-cohesion-r8/before/`
- 可用性状态：页面可访问；控制台未见错误；桌面与移动 `scrollWidth - clientWidth = 0`

## Numbered audit

1. **Hero — healthy with one P2 transition risk**
   - Strengths：标题、支持文案、唯一 CTA 与三张主视觉人像在两端都形成清晰的创作者优先首屏；刚删除的阶段提示、叠加小人像与相关空位均未恢复。
   - Risk：桌面 Hero 在 y=846 以 25px 圆角结束，角色区同一位置直接切为通栏纯色，视觉语言从“有框电影画面”突然变成“平面列表”，缺少承接层次。
   - Accessibility：标题与 CTA 对比清晰、CTA 聚焦样式可见；截图无法证明完整键盘顺序和动态偏好，需要交互测试补证。
   - Evidence：`desktop-01-0.png`、`mobile-01-0.png`。

2. **角色资产 — content healthy, P1 exit rhythm gap**
   - Strengths：左标题和 280×410 / 212×300 分层卡片保持平衡，侧卡露出与进度清楚，当前角色摘要块没有回到 DOM。
   - Risk：角色区底部后另有一个无归属的 72px（桌面）/52px（移动）纯黑间隔，之后流程标题才出现；该间隔不承载内容、边界或叙事提示，是最明显的区块脱节。
   - Accessibility：轮播按钮触达尺寸为 48/44px；图片中无法证明自动播放暂停条件和屏幕阅读器播报，需要交互与合约测试补证。
   - Evidence：`desktop-02-700.png`、`desktop-03-1400.png`、`mobile-02-600.png`、`mobile-03-1200.png`。

3. **Sticky 五阶段 — healthy interaction model, P2 alignment inconsistency**
   - Strengths：五个真实阶段、左侧阶段导航和右侧产品舞台建立了清晰的长滚动叙事；产品状态没有虚构规模指标。
   - Risk：流程主对齐线约为视口 5.5%（1440 下约 79px），而角色、场景、意图和 Footer 主要对齐线约 60px；标题轨道在进入流程时横向跳动。流程卡使用更重阴影与更长黑场，也加剧了与上下区块的割裂。
   - Accessibility：非激活阶段在截图中的不透明度很低，视觉可读性风险存在；真实对比值、键盘切换与 reduced-motion 需浏览器验证。
   - Evidence：`desktop-03-1400.png` 至 `desktop-08-4900.png`、`mobile-03-1200.png` 至 `mobile-05-2400.png`。

4. **使用场景 — P1 density and transition risk**
   - Strengths：一行三张大影像场景卡的内容映射正确，移动端改为纵向影像叙事，没有横向溢出。
   - Risk：桌面 4600px 流程区结束后立即压缩到 192px 场景条，标题仅 23px、说明 10px、卡片摘要 9px；不仅节奏突然收缩，也形成可见的小字号阅读风险。移动端 898px 的独立编排更健康，说明问题集中在桌面密度。
   - Accessibility：桌面 9–10px 场景文本偏小，是可见的可读性风险；图片 alt 为空符合装饰性用途，内容文本仍在 DOM 中。
   - Evidence：`desktop-09-5600.png`、`desktop-10-6300.png`、`mobile-05-2400.png`、`mobile-06-3000.png`。

5. **创建意图 — healthy core task, P2 control/ending inconsistency**
   - Strengths：大标题、真实意图输入、快捷提示、隐私边界与主按钮均明确；移动端输入和按钮可触达。
   - Risk：Hero CTA 44px、意图提交控件 50px、后续动作 46px，控件节奏不统一。移动端意图内容结束到 Footer 前仍保留较长的空白收束，弱化最后一步的完成感。
   - Accessibility：输入有真实 label，焦点样式存在；截图无法确认提交后的登录/邀请码续接，需要交互测试。
   - Evidence：`desktop-09-5600.png`、`desktop-10-6300.png`、`mobile-07-3600.png`、`mobile-08-4200.png`。

6. **Footer — content healthy, P2 closure risk**
   - Strengths：仅保留真实官网锚点、登录工作台与版权；桌面扁平横向，移动端精简。
   - Risk：Footer 的边界比上一段更强，但移动端前置空白过长，使尾栏看起来像页面外另一个区域；对齐与控件节奏需要和意图区一起收束。
   - Accessibility：链接文本清楚；移动端隐藏次级导航是现有响应式选择，未发现遮挡或溢出。
   - Evidence：`desktop-10-6300.png`、`mobile-08-4200.png`。

## Prioritized findings

- **P1**：删除角色区与流程区之间无语义的 72/52px 断层，用连续边界和一致的内边距完成叙事交接。
- **P1**：扩充桌面场景区的垂直尺度与文字尺度，避免 460vh 舞台突然坍缩成 192px 小条。
- **P2**：建立 1320px 内容宽度 / 60px 桌面对齐线，并让流程标题与其他区块回到同一轨道。
- **P2**：弱化 Hero→角色、流程→场景、意图→Footer 的硬切，统一细分隔线和明暗表面关系。
- **P2**：统一主要 CTA 高度到 48px，并收紧移动端意图内容后的空白。

## Evidence limits

- Browser 的 `fullPage` 捕获会在长 sticky 区重复冻结舞台，因此长图只用于顺序和总高度证明；视觉判断以逐步滚动的编号截图为准。
- 截图不能证明键盘顺序、自动轮播暂停、页面不可见暂停、reduced-motion 或登录/注册跳转；这些项目必须在修复后通过浏览器交互与契约测试验证。
- 本轮不审查登录、注册、工作台、Agent 页面，也不对其视觉系统作任何推断。
