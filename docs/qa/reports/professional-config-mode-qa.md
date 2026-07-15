# AgentHub 专业配置模式 QA 报告

- 日期：2026-07-14
- OpenSpec：`creator-agenthub-professional-config-mode`
- 验证地址：`http://localhost:3002/assets/32/build`
- 数据模式：Demo（只用于视觉与交互验证，临时环境配置已在验证后移除）

## 实现范围

- 构建工作区改为“身份与人设 / 运行配置 / 能力配置 / 治理与发布”四组专业配置导航。
- 编辑区继续复用同一份 Agent 草稿；测试评估、版本与发布为生命周期路由快捷入口。
- 实时预览只投影已保存的 Agent 配置，并保留真实 Runtime 接入；不再展示草稿/发布态切换、指标和会话管理。
- 媒体资产集中维护当前头像、角色设定稿与漫画草稿；Motherland 改为上下文生成抽屉，候选结果确认后才保存。

## 浏览器验证

| 项目 | 结果 |
| --- | --- |
| 1440×1024 桌面布局 | 通过。导航、编辑区和 340px 实时预览同屏，页面无横向溢出。 |
| 1024×900 响应式布局 | 通过。实时预览移动到编辑区下方，实测宽 790px、高 560px，页面无横向溢出。 |
| 专业菜单顺序 | 通过。四个分组、编辑项和两个生命周期快捷入口均按设计呈现。 |
| 草稿保留与保存草稿 | 通过。修改角色提示词后“保存草稿”由禁用变为可用；保存后显示“已保存于”，未保存状态清除。 |
| 保存并测试 | 通过。真实鼠标事件触发保存，并发起 `/assets/32/test` 的 RSC 路由请求。隔离的后台开发进程在首次编译该路由时没有完成页面提交，不影响处理器与路由目标验证。 |
| 媒体资产 | 通过。当前头像、角色设定稿、漫画草稿和 Demo 来源标识可见；页面无横向溢出。 |
| Motherland 抽屉 | 通过。生成要求、候选预览、生成候选按钮和“确认后才替换当前头像”的说明正确呈现。 |

## Live / Demo 边界

- Live 只复用现有头像上传、裁剪、删除、Motherland 头像预览以及当前角色设定稿接口。
- 后端没有集合接口时，Live 只显示真实的当前角色设定稿，不合成历史卡片。
- 资产库选择、历史版本和漫画草稿写入在 Live 中明确标记为待接入或不可用。
- 多卡片角色设定稿与漫画草稿只来自隔离的 Demo fixture，不进入 Live 查询缓存、Agent 更新请求或成功路径。

## 自动化门禁

- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `npm test`：通过，35 个测试文件、117 个测试。
- `npm run build`：通过，Next.js 生产构建成功。
- `openspec validate --all --strict`：通过，16 个 change 全部有效。

## 视觉证据

- [专业配置桌面布局](../images/professional-config-build-1440x1024.png)

## 2026-07-15 compact density follow-up

- Compared against `docs/qa/design-reference/professional-config-shell-target.png` and the pre-change capture `docs/qa/design-reference/current-density-review.png`.
- Reduced the Agent Asset compact top bar to 60px and the Agent identity row to 64px, with a 52px avatar and tighter lifecycle tabs.
- Reduced the Build configuration rail to 196px and tightened group, item, and icon spacing while keeping interactive rows at least 40px high.
- Updated the Build viewport-height budget so the editor and Runtime preview use the recovered vertical space.
- Layout contract tests now cover the 60px shell offset and 196px Build rail.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: passed (36 files, 129 tests).
- `npm run build`: passed.
- `openspec validate --all --strict`: passed (16 changes).
- `git diff --check`: passed; only existing line-ending conversion warnings were emitted.
- Same-viewport post-change capture remains blocked because the in-app browser runtime fails with `Cannot redefine property: process`; OpenSpec task 9.4 remains open.
- [专业配置响应式布局](../images/professional-config-build-1024x900.png)
- [媒体资产编辑页](../images/professional-config-media-1440x1024.png)
- [Motherland 生成抽屉](../images/professional-config-motherland-1440x1024.png)

## 2026-07-15 聚焦编辑区与可折叠预览

- 中间编辑区移除重复的“专业配置”眉题，仅保留当前配置项标题。
- 角色人格说明精简为“定义角色定位、表达风格和行为边界。”
- 桌面端实时预览支持在 340px 面板与 64px 标识栏之间切换；折叠过程不卸载 Runtime、输入或错误状态。
- 桌面断点以下继续显示完整的 560px 有界预览。
- 新增布局状态契约测试；完整门禁通过：36 个测试文件、129 个测试。
- 本地开发服务重启后，/assets/32/build 返回 200，Turbopack 编译成功。
- 本轮未补充展开/折叠截图：Codex Browser 运行时初始化失败（Cannot redefine property: process），OpenSpec 任务 8.5 保持未完成，避免把未执行的视觉验证标记为通过。
