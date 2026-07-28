## Why

AgentHub 的 Next.js 开发服务与生产构建当前共用 `.next` 输出目录。在开发服务运行时执行 `npm run build` 会覆盖 Turbopack 的开发清单，造成热更新失效、`ENOENT` 和 `Internal Server Error`，已经阻碍日常页面迭代与验证。

## What Changes

- 为 Next.js 开发模式配置独立的 `.next-dev` 输出目录。
- 保持生产构建和 `next start` 继续使用 `.next`，不改变 standalone 与 Docker 发布路径。
- 补充配置级测试，锁定开发、测试和生产环境的输出目录选择。
- 验证开发服务运行期间执行生产构建不会破坏开发页面与热更新。

## Capabilities

### New Capabilities

- `dev-build-cache-isolation`: 规定开发服务与生产构建使用相互隔离的 Next.js 输出目录，并保持现有生产发布契约。

### Modified Capabilities

无。

## Impact

- 修改 `next.config.ts` 中的 Next.js 输出目录配置。
- 新增轻量配置测试，不新增 npm 依赖。
- 开发缓存目录新增为 `.next-dev/`，并同步加入 Git、ESLint 与 TypeScript 的本地生成目录配置；生产构建、Dockerfile、standalone 输出和 API 契约保持不变。
