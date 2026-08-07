# LYN-004-R13 Design QA

日期：2026-08-06  
范围：草稿预览 lime 消息/发送按钮；版本页“当前草稿”状态条  
数据边界：同源隔离 Demo 用于可重复视觉状态；Live 用于最终运行态可达性。未读取认证或浏览器存储。

## 修前 finding

| 等级 | 状态 | 发现 |
| --- | --- | --- |
| P0 | 0 | 无 |
| P1 | 4 | lime/白字 1.15:1；disabled 图标/底色 1.11:1；草稿条主文案 2.02:1；辅助文案 1.53:1 |
| P2 | 1 | 浅色 amber 状态条与深色主题割裂 |

修前完整证据：

- `docs/qa/images/lyn-004-r13/01-before-build-preview-1440.png`
- `docs/qa/images/lyn-004-r13/02-before-versions-1440.png`
- `docs/qa/reports/lyn-004-r13-current-audit.md`

## 实际修复

- lime 消息：`primary #D7FF2F` 搭配 `canvas #08090A`，不改字号、尺寸或消息语义。
- 发送按钮：enabled 保持 lime/dark-on-accent；hover 使用 `brightness(1.05)`，pressed 使用 `brightness(0.90)`，focus-visible 使用 lime 双层 ring。disabled 改为 `surface-elevated #16181B`、`text-muted #898D94` 图标和同色可见边界，不再对整个控件降 opacity。
- 当前草稿条：使用 `surface-elevated #16181B`、`warning #F5B82E` 边界/状态点/分隔线，主文案 `text-strong #F5F7F8`、辅助文案 `text-secondary #A5A8AE`。
- 复用现有 token；未修改全局 primary、R6 标签或其他状态。

## 修后 computed 证据

| 状态 | 前景 / 背景 | 对比度 | 结论 |
| --- | --- | ---: | --- |
| lime 消息文字 | `#08090A` / `#D7FF2F` | 17.30:1 | 普通文字通过 |
| disabled 发送图标 | `#898D94` / `#16181B` | 5.34:1 | 非文字状态通过 |
| disabled 发送边界 | `#898D94` / `#16181B` | 5.34:1 | 控件边界通过 |
| 当前草稿主文案 | `#F5F7F8` / `#16181B` | 16.55:1 | 普通文字通过 |
| 当前草稿辅助文案 | `#A5A8AE` / `#16181B` | 7.46:1 | 普通文字通过 |
| warning 分隔/边界 | `#F5B82E` / `#16181B` | 9.98:1 | 非文字边界通过 |

1440 × 1024 两页均满足 `document.scrollWidth = window.innerWidth`。1280 × 720 的预览页也无横向溢出，右侧 420px 紧凑预览面板内消息、输入和发送状态无裁切。当前内置 Browser 会话未暴露可用的新 viewport override，无法额外生成整页 720 CSS px 截图；本次未改变任何尺寸或断点，响应式风险由既有布局、1280 紧凑面板实测和全量回归共同覆盖。

## 交互与状态回归

- 快捷回复/用户消息：真实发送后 lime 气泡立即使用 dark-on-accent。
- 输入发送：空输入为清晰 disabled；输入后恢复 lime enabled；点击发送行为不变。
- hover：computed `filter: brightness(1.05)`；pressed class 为 `brightness-90`；键盘 focus-visible 出现 lime ring。
- 查看草稿：从 `/assets/19/versions` 正常导航至 `/assets/19/build`。
- 发布：点击“发布第一个版本”仅打开既有确认对话；点击取消关闭，未执行写入。
- fresh Console：构建页与版本页均为 0 error / 0 warning。

## 比较证据

- 预览完整修前/修后：`docs/qa/images/lyn-004-r13/05-build-before-after-full.png`
- 版本完整修前/修后：`docs/qa/images/lyn-004-r13/06-versions-before-after-full.png`
- 反馈图/预览聚焦：`docs/qa/images/lyn-004-r13/07-build-feedback-after-focus.png`
- 反馈图/草稿条聚焦：`docs/qa/images/lyn-004-r13/08-versions-feedback-after-focus.png`

## 最终 finding

- P0: 0
- P1: 0
- P2: 0

final result: passed
