## Why

Agent 模拟聊天接口已经能够返回 `image_url`，但构建页的实时预览只保留并渲染文本内容，导致图片生成成功后用户看不到结果。需要统一各聊天入口的富媒体展示行为，让后端返回的图片可直接预览和打开。

## What Changes

- 构建页实时预览保留模拟响应中的 `image_url` 及现有富媒体字段。
- 构建页复用统一消息内容组件，展示文本、图片和附件。
- 相对图片下载地址继续通过公共 API base 解析，保持认证环境和运行时覆盖配置兼容。
- 补充消息映射和图片渲染测试，防止后续入口再次丢失富媒体字段。

## Capabilities

### New Capabilities

- `agent-chat-rich-media`: 规定 Agent 聊天响应中的图片地址必须被保留、解析并在消息内展示。

### Modified Capabilities

无。

## Impact

- 影响 `agent-build` 构建预览消息映射与 `agent-runtime` 公共消息内容组件的测试覆盖。
- 使用现有 `SimulationResponse.image_url` 契约，不新增或修改后端接口。
- 不新增 npm 依赖，不改变 Demo 与 Live 数据边界。
