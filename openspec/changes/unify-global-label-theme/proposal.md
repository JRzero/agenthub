## Why

AgentHub 的非交互式状态、类型和元数据标签目前混用浅色实心底、局部状态类与内联颜色，导致深色主题下层级不一致，并且图片覆盖、密集列表和详情标题栏中的可读性不可稳定验证。现在需要把全站标签收敛为可复用、可审计、可自动防回归的语义体系，同时严格保护按钮、Tab、筛选器、通知等非标签组件的现有外观与行为。

## What Changes

- 建立全站非交互式 Badge/Tag/Pill inventory，记录组件、样式、路由、当前语义、问题与迁移结果。
- 将标签视觉统一为 `success`、`warning`、`info`、`danger`、`neutral` 五类深色低饱和 ghost 变体，使用细语义边框和高对比文字。
- 收敛共享标签 token 和 class 映射，并迁移真实标签调用点；保留状态枚举、业务判断、文案、图标语义和布局。
- 增加 variant 映射、WCAG AA 对比度、禁用浅色实心标签底及非标签组件不受影响的自动回归测试。
- 对工作空间层、Agent Asset 层、空/加载/错误状态和多视口进行真实浏览器 Design QA，并保留修前/修后证据。

## Capabilities

### New Capabilities

- `global-label-theme`: 定义全站非交互式标签的范围、五类语义变体、可访问性、非标签隔离和验证要求。

### Modified Capabilities

无。

## Impact

- 影响 `src/app/globals.css` 中的标签 token/共享类、各业务模块中的真实标签调用点、标签主题测试、QA inventory/报告和截图证据。
- 不修改 API、DTO、状态枚举、业务数据、认证、权限、保存/发布/同步逻辑、布局、图片、交互控件或依赖。
- 仅本地实现与验证；不部署、不发布、不写入测试或生产环境。
