## Context

R5 为 `status-live`、`status-saved` 与 `status-draft` 增加了深色主题处理，但通用 `status-success` / `warning` 仍包含浅色 Tailwind 分支，部分标签继续使用 `bg-*/10`、`bg-surface`、`bg-primary-soft` 等内联组合。全站还存在视觉上类似标签但实际属于按钮、Tab、筛选器、通知或进度指示的元素，迁移时必须依语义和交互性区分，而不能只按圆角或颜色批量替换。

## Goals / Non-Goals

**Goals:**

- 为所有非交互式 Badge/Tag/Pill 建立单一五类语义视觉体系和可核验 inventory。
- 让标签在深色 surface、深色图片和浅色图片覆盖层上保持一致边界、层级和 WCAG AA 可读性。
- 用共享 token/class 和自动测试阻止浅色实心标签底回归。
- 通过真实路由、多视口和同状态前后截图完成 Design QA。

**Non-Goals:**

- 不改变业务状态枚举、判断、文案、图标、状态机或 API/DTO。
- 不改变按钮、Tab、筛选器、选择器、输入、segmented control、通知、Toast、Tooltip 或进度条。
- 不调整布局、图片、主题主色、数据模式或后端能力。

## Decisions

1. **保留 class-based 公共 API，收敛到五类语义 class。**
   - `status-badge` 继续承担尺寸、圆角、排版和截断保护；`status-success|warning|info|danger|neutral` 仅承担语义 token。
   - `status-live`、`status-saved`、`status-draft` 作为兼容别名组合到对应语义实现，避免改变业务调用与 R5 既有含义。
   - 相比新增运行时 React 组件，这一方案能最小化跨 module 改动，并覆盖已有静态 span 与图标组合。

2. **每个语义使用独立深色背景、边框、文字 token。**
   - 背景均为低饱和深色，边框用细 inset ring，文字使用高对比前景；success 仍低于青柠实心 CTA。
   - neutral 使用中性灰蓝，而不是青柠，保证普通元数据与状态行动层级分离。
   - 不使用 light/dark 双分支或浅色 Tailwind 色阶，避免默认深色主题中因 class 顺序产生浅色闪现或回退。

3. **inventory 以“候选扫描 + 人工分类 + 迁移结果”记录。**
   - 扫描共享 class、Badge/Tag/Pill/status/label 命名、圆角彩色背景与硬编码颜色。
   - 每条候选标记为标签或排除项；排除项注明按钮/Tab/通知等语义，防止视觉相似导致误改。

4. **自动回归同时验证视觉 token 与调用边界。**
   - 解析 CSS token 计算五类文字/背景对比度，普通文字必须至少 4.5:1。
   - 扫描标签调用点，禁止浅色背景色阶和未收敛的内联状态背景。
   - 对明确的非标签组件保留源码断言，确保按钮、Tab、通知和进度条不被套用 `status-badge`。

5. **浏览器 QA 只做只读页面检查。**
   - 优先使用 Codex in-app Browser 捕获测试环境和 R6 本地 Live；若登录阻塞再使用用户现有 Chrome 登录态。
   - 不读取 Cookie、localStorage、账号、请求体或凭据，不执行创建、保存、发布、同步或权限写操作。

## Risks / Trade-offs

- [基于 class 的调用点可能遗漏视觉上未命名的标签] → 使用多组搜索模式并在真实路由逐页核验，inventory 同时保留排除项。
- [图片覆盖层在不同明暗图片上对比不稳定] → 标签自身使用不透明深色底和边框，并在真实图片卡片上做聚焦截图验证。
- [兼容别名增加 CSS 表面] → 仅保留 R5 已存在的三类别名，测试其映射，不新增业务专用颜色。
- [Live 数据状态不一定同时出现五类] → 浏览器使用真实状态验证实际路由；五类完整性与对比度由静态测试和样式样本覆盖，不伪造 Live 数据。
- [全站扫描可能误伤非标签彩色组件] → 每个迁移点按非交互式语义确认；自动测试固定典型非标签组件不受影响。

## Migration Plan

1. 从固定 R5 commit 创建 R6 分支，捕获同视口修前状态。
2. 建立 inventory 并确认所有候选的包含/排除分类。
3. 添加五类 token，统一共享 class，迁移内联标签样式并补自动测试。
4. 在本地 Live 做多路由、多视口和 Console QA，生成同视口组合比较并迭代至 P0/P1/P2 为零。
5. 通过全量门禁后创建本地提交；不 push、不部署。

回滚方式：在未推送分支上 revert R6 本地提交即可恢复 R5；不涉及数据迁移、外部环境或后端回滚。

## Open Questions

无。语义映射、排除范围、验证视口与交付边界已由 LYN-004-R6 合同固定。
