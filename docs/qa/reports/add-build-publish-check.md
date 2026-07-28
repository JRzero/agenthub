# Build 简单发布检查 QA

## 范围

- OpenSpec：`add-build-publish-check`
- 页面：`/assets/{agentId}/build`
- 目标：保留现有构建工作区，只在发布动作后临时切换右侧发布检查

## 自动验证

- lint：通过
- typecheck：通过
- focused tests：9 项通过
- full tests：221 项通过
- production build：通过
- strict OpenSpec validation：23 项通过
- git diff check：通过

## 能力边界

- 基础配置和知识库引用由前端真实草稿与资源选项推导。
- 测试结果只保存当前浏览器会话中的摘要，不保存对话内容，并按草稿 revision 隔离。
- 没有当前 revision 的测试证据时显示“尚未测试”，不会显示虚假的通过状态。
- Client 数量来自既有 Agent Client 查询，只作影响提示。
- 最终发布和 Client 兼容性仍由版本管理页及服务端校验。

## 浏览器验证

- `1440 × 900`：通过。页面宽高与视口一致，无横向或纵向页面溢出。
- `1280 × 720`：通过。页面宽高与视口一致，无横向或纵向页面溢出。
- 从默认实时预览状态点击“发布为新版本”后，右侧切换为“发布检查”，顶部主按钮更新为“继续发布”。
- 发布检查按顺序展示基础配置、能力与资源、测试与安全、线上影响；未测试状态明确显示“尚未测试”和“前往测试”。
- 当前样例没有阻塞项，显示“当前没有阻塞项，可继续发布”；Client 数量显示为真实查询结果 `0 个 Client`。
- 两个视口下均未发现控制台错误。

## 视觉证据

- `docs/qa/images/add-build-publish-check-1440x900.png`
- `docs/qa/images/add-build-publish-check-1280x720.png`

## 结论

代码、自动验证、主要交互和两个 PC 视口的视觉 QA 均已完成。简单发布检查在不改变默认编辑体验的前提下，为发布动作提供了清晰、紧凑且可操作的前置确认。
