# LYN-004-R11 修前交互审计

- 页面：隔离 Demo `http://127.0.0.1:3002/workbench`
- 视口：1440 × 1000 CSS px
- 数据边界：使用仓库既有 Demo fixture（2 个 Agent，其中 1 个缺图）；未新增或修改 Agent 数据。

## 编号步骤与结果

1. 起始态为「林月」，舞台焦点卡与详情均显示「林月」。舞台区域 1184 × 462px，焦点卡 360 × 420px，详情 280 × 462px；图片已完成加载（naturalWidth 1254）。证据：`docs/qa/images/lyn-004-r11/01-before-start-1440.png`。
2. 点击「下一个 Agent」后立即捕获。焦点卡、相邻卡和详情在同一帧直接替换为「知识向导」，computed `opacity: 1`、`transform: none`，不存在可见退出/进入中间态。证据：`docs/qa/images/lyn-004-r11/02-before-trigger-no-middle-1440.png`。
3. 350ms 后完成态与触发后首帧相同；缺图 Agent 诚实显示现有占位。舞台/详情高度由 462px 跳至 520.5px；document overflow 为 false。证据：`docs/qa/images/lyn-004-r11/03-before-complete-1440.png`。
4. 原生上一/下一按钮与相邻卡点击均直接调用 `setSelectedId`；选择、舞台图片和详情在同一次 React 提交中更新。快速连续输入没有过渡状态或明确的末次输入收敛模型。
5. Console：0 error / 0 warning。

## 差异分级

- P0：0。
- P1-01：卡片切换瞬时替换，无方向性退出/进入节奏；与用户反馈“切换不够丝滑”一致。
- P1-02：不同 Agent 详情内容导致舞台行高从 462px 跳至 520.5px，推动下方状态汇总和最近继续区域。
- P2-01：图片虽由相邻卡提前出现在 DOM 中并可复用缓存，但现有实现没有明确的过渡阶段，无法形成稳定的起始/中间/完成反馈。

## 实施约束

仅修改工作台舞台与同步详情的过渡状态和样式；保持 Agent 顺序、循环选择、CTA/路由、数据、状态汇总、最近继续及静态卡片结构不变。
