# LYN-004-R9 Agent Studio 选中态图标清晰度修正

## 范围

- 页面：`/assets/32/build`
- 组件：`src/modules/agent-build/build-section-rail.tsx`
- 状态：Agent Studio 左侧专业配置导航，`身份信息` 选中。
- 数据：仓库现有非敏感 Demo fixture；未读取凭据、Cookie 或生产数据。

## 修前审计

- 选中行：`179 × 40px`，背景 `#202719`，文字 `#d7ff2f`。
- 图标容器：`22 × 22px`，背景/边框 `#d7ff2f`。
- 图标：Phosphor `IdentificationCard`，`13 × 13px`、regular、前景 `#ffffff`、`stroke: none`（fill 图标）。
- 白色图标与青柠背景对比度：`1.15:1`。
- 结论：主体边框和内部身份细节在小尺寸下被高亮底吞没，记为 P1。

## 实际修正

- 保持同一 Phosphor `IdentificationCard` 语义与图标库。
- 保持 `22px` 圆形容器、青柠背景、整行选中背景、文字、间距和布局不变。
- 仅选中态改为 `text-canvas`（`#08090a`）、`16px`、Phosphor 原生 `bold` 权重。
- 修后图标与青柠背景对比度：`17.30:1`。
- 非选中态仍为 `13px regular`、现有 muted 前景；hover/focus class、按钮语义、`aria-pressed`、编辑器切换和 route push 不变。

## 浏览器证据

- `1440 × 952`：行 `179 × 40px`、容器 `22 × 22px`、图标 `16 × 16px`，页面无横向溢出。
- `1280 × 900`：行 `179 × 40px`、图标 `16 × 16px`，页面无横向溢出。
- `720 × 900` / 200% 等效宽度：行 `96 × 40px`、图标 `16 × 16px`；专业配置导航保持既有横向滚动，文档本身 `scrollWidth = clientWidth = 720`，图标无裁切。
- Identity/Persona 切换与 `aria-pressed` 更新正常；键盘焦点显示既有 `2px #d7ff2f`、offset `2px` 焦点环。
- Console：0 error、0 warning。
- 本地预览：`http://127.0.0.1:3013/assets/32/build`，HTTP 200。

## 证据路径

- 用户反馈：`docs/qa/images/lyn-004-r9/00-feedback-selected-icon-386x952.png`
- 修前全页：`docs/qa/images/lyn-004-r9/01-before-studio-1440x952.png`
- 修后全页：`docs/qa/images/lyn-004-r9/03-after-studio-1440x952.png`
- 1280：`docs/qa/images/lyn-004-r9/04-after-studio-1280x900.png`
- 720 / 200%：`docs/qa/images/lyn-004-r9/05-after-studio-720x900-200pct.png`
- 反馈/修后聚焦组合：`docs/qa/images/lyn-004-r9/07-compare-feedback-after-focus.png`
- 修前/修后聚焦组合：`docs/qa/images/lyn-004-r9/08-compare-before-after-focus.png`
- 完整设计 QA：根目录 `design-qa.md` 的 R9 章节。

## 门禁

- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `npm test`：通过，80 个测试文件、403 个测试。
- `npm run build`：通过。
- `openspec validate --all --strict`：通过，31 个 change、0 失败。
- `git diff --check`：通过。

## 结论

P0=0、P1=0、P2=0；`final result: passed`。没有后端、API/DTO、状态语义、路由、保存行为或其他页面变更。
