# LYN-004-R13 修前视觉审计

日期：2026-08-06
审计分支：`task/lyn-004-r13-preview-version-contrast_2026-08-06`
起点：`e0da2c36c9fbe02ef4966e89b7d1ca7504299cb3`

## 审计边界

- Live 的既有 Agent 详情请求在本地返回 404，无法安全进入目标状态；按合同使用同源、隔离 Demo 数据复现视觉状态。
- 未读取浏览器存储、认证信息或任何环境凭据。
- 仅审计构建页草稿预览与版本页当前草稿状态条。

## 编号步骤与发现

1. 在 `1440 × 1024` 打开 `/assets/32/build`，发送“怎么称呼你”，形成 lime 用户消息气泡；清空输入，观察 disabled 发送按钮。
   - P1：lime `rgb(215 255 47)` 上白字 `rgb(255 255 255)` 对比度为 **1.15:1**，低于普通文字 4.5:1。
   - P1：disabled 按钮采用整控件 `opacity: 0.4`；合成后的图标/背景约为 `rgb(111 112 113)` / `rgb(95 112 30)`，对比度为 **1.11:1**，状态边界不可辨。
   - 页面无横向溢出（`scrollWidth = innerWidth = 1440`）。
   - 证据：`docs/qa/images/lyn-004-r13/01-before-build-preview-1440.png`
2. 在 `1440 × 1024` 打开 `/assets/19/versions`，观察“当前草稿”状态条。
   - P1：浅色 `rgba(255 251 235 / 0.7)` 覆盖深色页面，渲染背景约 `rgb(179 176 165)`；主文案 `rgb(245 247 248)` 对比度为 **2.02:1**。
   - P1：辅助文案 `rgb(137 141 148)` 对比度为 **1.53:1**。
   - P2：浅色状态条与既有深色主题 surface 体系割裂。
   - 页面无横向溢出（`scrollWidth = innerWidth = 1440`）。
   - 证据：`docs/qa/images/lyn-004-r13/02-before-versions-1440.png`

## 修复判断

问题是前景/背景 token 配对错误，不是字号、布局或业务状态问题。修复应复用现有 `canvas`、`surface-elevated`、`warning`、`text-strong`、`text-secondary` 与 `text-muted` token；不修改全局品牌色或组件尺寸。
