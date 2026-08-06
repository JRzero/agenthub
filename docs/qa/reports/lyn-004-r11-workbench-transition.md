# LYN-004-R11 工作台 Agent 切换动效 QA

## 范围与数据边界

- 页面：`/workbench`。
- 视觉/交互 QA：隔离 Demo，使用仓库既有 2 个 Agent（1 个真实已有图片、1 个缺图占位），未新增或改写 fixture。
- 固定起点：`6243a85c827adb42c0886e3b913cad6712cb1785`。
- 变更仅覆盖多 Agent 舞台和同步详情的切换节奏；Agent 顺序、循环、CTA/路由、状态汇总、最近继续、API/DTO/数据均未修改。

## 修前发现

- P1：点击后焦点卡、相邻卡和详情同帧瞬时替换，computed `opacity: 1` / `transform: none`，没有中间态或方向反馈。
- P1：不同 Agent 详情使舞台行高从 462px 跳至 520.5px。
- P2：没有明确的快速输入收敛模型。
- 修前审计：`docs/qa/reports/lyn-004-r11-current-audit.md`。

## 实际修复

- 状态机：`idle → exit → enter → idle`；退出阶段保留当前 Agent，提交阶段同时切换舞台和详情，进入结束后回到 idle。
- 时长：退出 70ms、进入 210ms，总感知时长 280ms。
- easing：exit `ease-in`，enter `ease-out`。
- 属性：仅 `transform: translateX(...)` 和 `opacity`；不动画 width/height/top/left。
- 运动层：舞台内容层、详情内容层，共 2 层；按钮和外层 panel 不参与位移。
- 几何：由现有真实任务推导是否需要扩展详情高度；当前数据下舞台与详情固定为 522px，切换前后均不变。
- 图片：相邻卡继续复用现有 `AgentArtwork`，目标图片在成为焦点前已在 DOM 中加载；缺图继续使用原有诚实占位。
- 快速输入：`targetId` ref 同步记录最新有效目标；exit 定时器随目标变化重启，commit 永远读取 reducer 中最后目标。三次快速输入后最终选择与详情均落在最后一次有效目标。
- reduced motion：`prefers-reduced-motion: reduce` 下动画压缩为 0.01ms，并显式移除 transform；选择、路由和焦点语义不变。

## Browser 实测

| CSS 视口 | 舞台 | 详情 | overflow-x | Console |
| --- | --- | --- | --- | --- |
| 1487 × 1058 | 935 × 522 | 280 × 522 | no | 0 error / 0 warning |
| 1440 × 1000 | 888 × 522 | 280 × 522 | no | 0 error / 0 warning |
| 1280 × 900 | 717 × 522 | 280 × 522 | no | 0 error / 0 warning |
| 720 × 900 | 661 × 522 | 661 × 522（上下堆叠） | no | 0 error / 0 warning |

- 方向性：下一项进入时 Browser computed animation 为 `workbench-enter-next`、`0.21s`、`ease-out`，并同时观测到非 1 opacity 与非 none translate matrix；上一项使用镜像类。
- 同步：每次完成后舞台标题与详情标题一致；`data-transition-phase` 回到 `idle`。
- 快速连点：从「知识向导」开始连续三次“下一个”，最终舞台与详情均为「林月」，phase 为 idle；导航按钮保持焦点。
- 相邻卡：整卡点击继续切换，DOM 复用后焦点仍在相邻卡按钮上。
- 键盘边界：所有切换控制仍是原生 `button type="button"`，保留 Enter/Space 浏览器原生语义与现有 focus-visible；内置 Browser 的合成 keypress 本轮未触发原生 button activation，因此以 DOM/焦点检查和源级回归断言覆盖，未修改按键语义。
- 数据覆盖：Browser 覆盖 2 Agent、已有图片和缺图；1/3+、快速末次输入、空列表由纯状态机/model 测试覆盖。没有为视觉 QA 制造第三个 Agent 或失败 URL。

## 证据

- 修前：`01-before-start-1440.png`、`02-before-trigger-no-middle-1440.png`、`03-before-complete-1440.png`。
- 修后：`11-after-start-1440.png`、`12-after-middle-next-1440.png`、`13-after-complete-1440.png`。
- 响应式：`14-after-responsive-1280.png`、`15-after-responsive-720.png`、`16-after-reference-1487x1058.png`。
- 组合：`20-source-after-reference-comparison.png`、`21-before-after-geometry-comparison.png`、`22-transition-start-middle-complete.png`。

## Design QA 结论

- P0：0。
- P1：0。
- P2：0。
- P3：0；键盘合成注入限制属于证据工具边界，不是产品实现偏差。

final result: passed
