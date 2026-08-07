# LYN-004-R13 Follow-up｜测试聊天用户气泡对比度

日期：2026-08-06
反馈图：`/var/folders/rk/rlxc7qzd2xz55_fls_ftnyrm0000gn/T/codex-clipboard-6970cfad-39db-4b67-a179-a78bda6ee52c.png`
验证面：`/assets/32/test`，隔离 Demo，1280 × 720 CSS px

## 审计步骤

1. 打开“测试评估”，选择“边界挑战”，点击场景起始语。
   - 健康度：P1。
   - 用户消息气泡的 computed 前景为 `rgb(255 255 255)`，背景为 `rgb(215 255 47)`，对比度仅 **1.15:1**。
   - 证据：`docs/qa/images/lyn-004-r13-followup/01-before-test-chat.png`。
2. 审计同一消息语义的调用点。
   - 高级测试对话、基础测试对话、真实 Runtime Chat 均使用同一错误配对。
   - 其它 lime 选中态、按钮和标签不在本次修改范围。
3. 将三个用户消息气泡统一为 `bg-primary text-canvas`，重新执行同一场景。
   - 健康度：passed。
   - 修后前景为 `rgb(8 9 10)`，背景保持 `rgb(215 255 47)`，对比度 **17.30:1**。
   - 气泡尺寸、位置、头像、消息内容、生成状态和发送行为不变；无横向溢出。
   - fresh Console：0 error / 0 warning。
   - 证据：`docs/qa/images/lyn-004-r13-followup/02-after-test-chat.png`。

## 比较证据

- 同视口完整页：`docs/qa/images/lyn-004-r13-followup/03-before-after-full.png`
- 用户反馈与修后聚焦：`docs/qa/images/lyn-004-r13-followup/04-feedback-after-focus.png`

## 最终 finding

- P0: 0
- P1: 0
- P2: 0

final result: passed
