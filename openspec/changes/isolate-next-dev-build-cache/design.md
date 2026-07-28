## Context

Next.js 默认让 `next dev`、`next build` 和 `next start` 共用 `.next`。AgentHub 的日常 QA 经常需要在开发服务运行时执行完整生产构建；两种进程并发写同一目录时，Turbopack 开发清单会被生产构建删除或替换，随后请求出现 `app-build-manifest.json`、`_buildManifest.js.tmp` 缺失和 500 错误。

现有 Dockerfile 明确复制 `.next/standalone` 与 `.next/static`，因此生产输出目录必须保持不变。

## Goals / Non-Goals

**Goals:**

- 让开发服务只写 `.next-dev`。
- 让构建与生产启动继续使用 `.next`。
- 让目录选择逻辑可单元测试，防止后续配置回退。
- 在开发服务运行期间执行生产构建后，开发页面仍可响应并继续重编译。

**Non-Goals:**

- 不改变开发端口、Turbopack/webpack 选择或热更新实现。
- 不修改 Dockerfile、standalone 输出结构或部署命令。
- 不引入新的构建工具或 npm 依赖。

## Decisions

1. **按 `NODE_ENV` 选择 `distDir`**
   - `development` 使用 `.next-dev`。
   - 其他环境使用 `.next`。
   - 选择该方案是因为 `next dev`、`next build` 与 `next start` 已提供稳定的环境语义，不需要新增自定义环境变量。
   - 未选择“执行构建前手动停止开发服务”，因为它依赖人工纪律，不能防止并发覆盖。

2. **抽取纯函数解析输出目录**
   - 由一个无副作用的配置函数返回目录名称，`next.config.ts` 只消费结果。
   - 单元测试覆盖 development、production、test 与未设置环境，避免测试通过但生产目录意外变化。

3. **保持生产目录与 Docker 契约不变**
   - Dockerfile 继续读取 `.next/standalone` 和 `.next/static`。
   - `.next-dev/` 仅为本地开发缓存，并加入 `.gitignore` 与 ESLint 忽略列表。
   - TypeScript 同时包含 `.next/types` 与 `.next-dev/types`，确保开发和生产生成的路由类型均可解析。

## Risks / Trade-offs

- [首次切换后开发服务需要重新编译，冷启动会比复用旧 `.next` 稍慢] → 仅发生一次，后续继续复用 `.next-dev`。
- [开发与生产缓存各占用一份磁盘空间] → 两者均为可删除缓存，且换来稳定的并发验证。
- [第三方脚本若硬编码读取 `.next` 来检查开发产物将失效] → 当前仓库没有此类脚本；生产与 Docker 仍使用 `.next`。

## Migration Plan

1. 增加环境到目录的解析函数与测试。
2. 在 `next.config.ts` 配置 `distDir`。
3. 将 `.next-dev/` 加入 `.gitignore`。
4. 停止旧开发服务并重新启动，使其生成 `.next-dev`。
5. 在开发服务运行时执行 `npm run build`，确认 `.next` 和 `.next-dev` 同时存在且开发页面继续响应。

回滚时删除 `distDir` 配置、解析函数与 `.next-dev` 忽略项；`.next-dev` 可直接作为缓存清理。
