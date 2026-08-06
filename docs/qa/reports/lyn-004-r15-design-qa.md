# LYN-004-R15 Design QA

## 范围与目标

仅检查 `PublishDialog` 的当前版本 info surface、新版本 success surface，以及非阻塞 Session 行为说明框。布局、尺寸、文案、箭头、Version Hash、字段、检查项、按钮和发布逻辑保持不变。

## 实际修复

- 当前版本：`status-info-bg #0D1722` + `info #65A7FF` 边界 + `status-info-text #8FC0FF`。
- 新版本：`status-success-bg #141A0C` + `success #9BE228` 边界 + `status-success-text #B7EF54`。
- Session 说明：复用 info surface，项目符号明确使用 `info`，正文使用 `status-info-text`。
- 没有修改全局 token、R6 标签、R13 草稿条、主 CTA 或其他调用点。

## 对比度证据

| 元素 | 对比度 | 门槛 | 结果 |
| --- | ---: | ---: | --- |
| info 普通文字 / info surface | 9.59:1 | ≥ 4.5:1 | passed |
| success 普通文字 / success surface | 13.09:1 | ≥ 4.5:1 | passed |
| info 边界 / 弹窗 surface | 7.68:1 | ≥ 3:1 | passed |
| success 边界 / 弹窗 surface | 11.99:1 | ≥ 3:1 | passed |
| info 项目符号 / info surface | 7.33:1 | ≥ 3:1 | passed |

三块区域尺寸和总面积保持 58,764px² / 13.3% 不变；背景相对亮度由 0.9148/0.9468 降至 0.0081/0.0091，消除浅色主题割裂，同时保留蓝/绿区分。

## Browser 与交互 QA

- 1228 × 1454：完整弹窗与聚焦截图稳定，弹窗面板仍为 590 × 748px。
- 720 × 900：面板 client/scroll width 均为 590px，document scroll width 709px，小于 720px viewport；无横向溢出或裁切。
- 版本说明输入：可输入临时验证文案，focus-visible lime 边界清晰；未保存或提交。
- 主发布 CTA：安全初始状态为 enabled；`disabled={publishing}` 绑定由自动测试覆盖。因合同禁止点击最终发布，Browser 不人为进入 publishing 状态。
- 关闭与取消：两条路径均使 dialog count 回到 0；无重开。
- Fresh Console：error 0 / warning 0。
- 未点击最终发布，未修改业务数据。

## 对比证据

- 修前完整：`docs/qa/images/lyn-004-r15/01-before-full-1228x1454.png`
- 修后完整：`docs/qa/images/lyn-004-r15/03-after-full-1228x1454.png`
- 修前聚焦：`docs/qa/images/lyn-004-r15/02-before-dialog-focus-final.png`
- 修后聚焦：`docs/qa/images/lyn-004-r15/04-after-dialog-focus-final.png`
- 用户反馈 + 修后：`docs/qa/images/lyn-004-r15/05-feedback-after-comparison.png`
- 修前 + 修后聚焦：`docs/qa/images/lyn-004-r15/06-before-after-focus-comparison.png`
- 修后窄屏：`docs/qa/images/lyn-004-r15/07-after-narrow-720x900.png`

## 最终 findings

- P0：0
- P1：0
- P2：0

final result: passed
