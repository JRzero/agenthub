# AgentHub 测试与评估设计 QA

## 比较证据

- Source visual truth: `../design-reference/agent-test-evaluation.png`
- Browser-rendered implementation: `../design-reference/test-evaluation-final-1270x714.png`
- Combined comparison: `../design-reference/test-evaluation-comparison.png`
- Viewport: `1270 × 714`（应用内浏览器实际可视区）
- State: demo 数据模式；选中“边界挑战”；完成两轮对话；已运行前端派生评估
- Full-view comparison: 已在同一横向比较画布中核对整体层级、三栏比例、密度、顶部工作区导航、对话内容与评估结果。
- Focused-region comparison: 无需额外裁切。源图和实现截图在原始尺寸并排后，场景列表、对话区、评分卡及诊断区文字均可辨认。

## Findings

没有遗留的 P0、P1 或 P2 问题。

- [P3] 保留 Agent Asset 顶部工作区头部
  - Location: 测试与评估页面顶部。
  - Evidence: 源设计稿直接进入测试页；实现保留已确认的“工作空间 + Agent Asset 工作区”两层结构和资产内导航。
  - Impact: 页面首屏内容下移，但跨模块定位更稳定，属于产品架构约束而非视觉缺陷。
  - Resolution: 接受为有意差异。
- [P3] 评估结果增加来源与不可用诊断标识
  - Location: 右侧评估面板。
  - Evidence: 源设计呈现完整评估信息；当前后端没有独立评估、调用链、记忆命中和精确成本接口。
  - Impact: 信息比源设计更审慎，避免把前端派生分数或缺失数据误报为真实后端观测。
  - Resolution: 接受为当前阶段的真实性约束。

## Required Fidelity Surfaces

- Fonts and typography: 中文界面使用现有无衬线字体栈，标题、标签、正文、分数和辅助文本层级清楚；无异常换行或截断。
- Spacing and layout rhythm: 三栏桌面结构、面板间距、边框、圆角和纵向节奏与源设计意图一致；新增资产头部后仍保持紧凑。
- Colors and visual tokens: 深色资产导航、浅色工作区、紫色主操作、绿色通过态和中性色语义映射一致，文本对比度可读。
- Image quality and asset fidelity: 使用项目内真实林月头像资源，裁切、清晰度和圆形遮罩正常；图标统一使用 Phosphor 图标族，没有 emoji、CSS 绘图或占位形状替代。
- Copy and content: 场景、对话、评估与诊断文案可独立理解；派生评分和不可用数据均已明确标识。
- Responsiveness: `390 × 844` 下页面 `clientWidth = scrollWidth = 380`，无页面级横向溢出；场景轨道保持内部滚动。
- Accessibility: 表单包含可见标签，交互元素使用语义按钮/输入框，选中、禁用和焦点状态可辨识。

## Primary Interactions Tested

- 搜索测试场景。
- 本地创建场景“品牌语气回归”。
- 切换场景并重置会话。
- 连续发送两轮 demo 对话。
- 运行五维前端派生评估。
- 查看调用链、记忆/工具、Token 与成本不可用诊断。
- 移动端窄视口布局检查。

## Console and Runtime

- 新标签页完成两轮对话与一次评估后，浏览器 `error` / `warn` 日志为空。
- demo 模式未发起后端 HTTP 调用；live 模式复用 `/api/v1/agents/{id}/simulate`。
- React 消息 key 已改为每轮唯一，复测无重复 key 警告。

## Comparison History

1. 首轮实现发现连续 demo 对话复用 `message_id`，触发 React 重复 key 警告。
2. 修复：demo 消息 ID 增加输入长度和时间戳；会话状态将业务错误与 React Query 错误分离。
3. 复测：新浏览器标签完成两轮对话和评估，控制台无 error/warn；最终截图为 `test-evaluation-final-1270x714.png`。

## Implementation Checklist

- [x] 桌面三栏布局与源设计信息层级一致。
- [x] 场景搜索、创建、选择与重置可操作。
- [x] demo 与 live 数据链路隔离。
- [x] 评估指标有明确数据来源。
- [x] 不可用诊断诚实呈现。
- [x] 桌面与移动端浏览器检查通过。
- [x] 控制台检查通过。

## Follow-up Polish

- 后端补充评估、调用链与成本接口后，可把当前派生分数和不可用诊断替换为真实观测数据。

final result: passed
