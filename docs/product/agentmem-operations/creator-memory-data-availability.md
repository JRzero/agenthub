# AgentHub × AgentMem 创作者运营数据可用性核验

> 核验日期：2026-07-31
> 核验依据：`linkyun-agent/docs/AGENTMEM_AGENT_API.md` 当前版本
> 核验目标：确认创作者运营管理页面中的每项数据能否由现有公开接口取得

## 1. 核验结论

现有 Creator API 已经可以支持 **Agent 级匿名 Memory 信号健康观测**，包括：

- active Memory 总数。
- Relationship / Emotion 可用与不可用数量。
- 关系阶段分布和关系聚合值。
- Emotion 准备状态、当前状态、心境分布和加权聚合值。
- 部分成功状态。

但它仍不支持：

- 任何单份 Memory 或用户级下钻。
- 事实内容与质量。
- query、add、task 的运营链路指标。
- 历史趋势和版本归因。
- 面向 Creator 的事实导入、修正、删除或整库抹除。

因此当前 Creator P0 应是只读的“信号覆盖图谱 + 当前诊断”，不能设计成关系管理、事实管理或
记忆效果看板。

## 2. 可用性分级

| 等级 | 定义 |
| --- | --- |
| A | 当前 Creator API 直接返回，可直接上线 |
| A-FE | 可由当前返回值在前端确定性派生 |
| I | LinkYun 后端内部已有调用能力，但没有 Creator 公开合同 |
| X | 当前接口没有可信数据源，不能上线 |

## 3. 当前公开接口

### Creator

```http
GET /api/v1/agents/{agent_id}/memory-analytics
```

约束：

- 只允许 Creator 查看自己直接创作的 Agent。
- 只返回 Agent 级匿名聚合。
- 没有用户、Memory、时间、版本、Client 或分页参数。
- 不返回 binding、Memory、用户、消息、Key 或上游错误正文。

### 当前用户

```http
GET /api/v1/user/agents/{agent_id}/memory-insights
```

约束：

- 只能返回当前认证用户与该 Agent 唯一 active binding 对应的信号。
- 不接受目标 `user_id`。
- 不能作为 Creator 的用户明细接口。

## 4. Creator 页面逐项核验

### 4.1 覆盖与完整性

| 页面数据 | 等级 | 当前字段 / 公式 | 结论 |
| --- | --- | --- | --- |
| active Memory 数 | A | `coverage.total_active_memories` | 可直接展示 |
| Relationship 可用数 | A | `relationship_available` | 可直接展示 |
| Relationship 不可用数 | A | `relationship_unavailable` | 可直接展示 |
| Emotion 可用数 | A | `emotion_available` | 可直接展示 |
| Emotion 不可用数 | A | `emotion_unavailable` | 可直接展示 |
| Relationship 覆盖率 | A-FE | available / total | 分母为 0 时显示暂无样本 |
| Emotion 覆盖率 | A-FE | available / total | 分母为 0 时显示暂无样本 |
| 部分成功 | A | `partial` | 可直接展示覆盖提示 |
| 数据生成时间 | X | 无字段 | 只能显示前端获取时间 |
| 历史覆盖趋势 | X | 无历史快照 | 不能画趋势 |

### 4.2 Relationship

| 页面数据 | 等级 | 当前字段 / 公式 | 结论 |
| --- | --- | --- | --- |
| 阶段分布 | A | `stage_distribution` | 可直接展示 |
| 阶段占比 | A-FE | stage count / relationship available | 可派生 |
| average affection | A | `average_affection` | 按 `score_scales` 解释 |
| average trust | A | `average_trust` | 按 `score_scales` 解释 |
| average familiarity | A | `average_familiarity` | 按 `score_scales` 解释 |
| 里程碑总数 | A | `milestone_count` | 可展示总数，不能看内容 |
| 里程碑内容 | X | 无字段 | 不能展示 |
| 单个用户关系值 | X | 明确禁止 | 不能展示或反推 |
| 关系历史趋势 | X | 无时间序列 | 不能展示 |

Relationship 整段可能省略。省略表示没有可用信号，不是所有分数为 0。

### 4.3 Emotion

| 页面数据 | 等级 | 当前字段 / 公式 | 结论 |
| --- | --- | --- | --- |
| ready / empty 分布 | A | `status_distribution` | 可直接展示 |
| ready 率 | A-FE | ready / emotion available | 可派生 |
| 状态分布 | A | `state_distribution` | 同一 Memory 可贡献多个不同状态 |
| 状态覆盖率 | A-FE | state count / emotion available | 各项之和可能超过 100% |
| 心境分布 | A | `mood_distribution` | 可直接展示 |
| mean valence | A | `mean_valence` | 服务端按样本数加权 |
| mean arousal | A | `mean_arousal` | 服务端按样本数加权 |
| Emotion 总样本数 | A | `sample_count` | 可直接展示 |
| 每份可用 Memory 平均样本 | A-FE | sample count / emotion available | 只作数据规模说明 |
| relationship level | A | `relationship_level` | 服务端按样本数加权 |
| recent affection | A | `recent_affection` | 服务端按样本数加权 |
| 情绪时间线 | X | 无单样本与时间字段 | 不能展示 |
| 单个用户当前情绪 | X | Creator 聚合接口禁止 | 只能由用户查看自己的 Insights |

Emotion 数值可能为 `null`，必须显示暂无可计算样本，不能显示为 0。

### 4.4 运行与质量运营

| 页面数据 | 等级 | 当前事实 | 结论 |
| --- | --- | --- | --- |
| query 次数 | X | Creator 响应无字段 | 不能展示 |
| query 命中率 / 空召回 | X | Creator 响应无字段 | 不能展示 |
| query P50 / P95 | X | Creator 响应无字段 | 不能展示 |
| fallback / timeout | X | Creator 响应无字段 | 不能展示 |
| 写入任务数与成功率 | X | Creator 响应无字段 | 不能展示 |
| task 耗时与错误 | X | Creator 响应无字段 | 不能展示 |
| active facts | I | 后端可调用事实接口 | 无 Creator 聚合合同 |
| 事实类型分布 | I | 可读取 facts 后聚合 | 无 Creator 聚合合同 |
| facts added / merged / updated | I | task result 可能提供 | 无 Creator 运营合同 |
| 重复、冲突、膨胀 | X | 无问题检测合同 | 不能展示 |
| 事实导入、修正、删除 | I | 后端内部映射已存在 | Creator 不能直接操作 |
| 整库抹除 | I | 后端内部映射已存在 | Creator 不能直接操作 |
| LLM token / cost | X | Creator 响应无字段 | 不能展示 |
| Memory 对回复的改善 | X | 无实验或归因数据 | 不能宣称 |

`AGENTMEM_AGENT_API.md` 中的 AgentMem 上游接口映射只说明 LinkYun 后端具备调用路径，不等于
AgentHub Creator 已获得权限或公开合同。

## 5. “信号覆盖图谱”字段闭环

```text
Active Memory
├── Relationship
│   ├── available
│   │   └── stage_distribution
│   └── unavailable
└── Emotion
    ├── available
    │   ├── status_distribution
    │   ├── state_distribution
    │   └── mood_distribution
    └── unavailable
```

以上每个节点都能由现有 Creator 响应直接提供或确定性派生，是当前唯一数据闭环完整的图谱。

## 6. 不应混淆的三组状态

### 6.1 无 active Memory

```text
total_active_memories = 0
```

含义是没有可分析样本，不是 Relationship / Emotion 为 0。

### 6.2 Emotion empty

```text
emotion available
status = empty
```

含义是 Emotion 服务可访问，但尚未形成样本。

### 6.3 Emotion unavailable

```text
emotion_unavailable > 0
```

含义是对应信号未成功取得。它是覆盖问题，不是空样本。

同理，Relationship 不可用也不能被解释为关系分数为 0。

## 7. 用户侧数据边界

当前用户页面可以直接展示自己的：

| 模块 | 字段 |
| --- | --- |
| 关系 | stage、stage label、affection、trust、familiarity、milestone count |
| Emotion | status、current、states、mood、means、sample count、relationship level、recent affection |
| 可用性 | `partial`、`unavailable` |

不能展示历史时间线，也不能选择其他用户。

这部分数据对于用户理解“我与 Agent 的关系”有意义，但不应进入 Creator 的个体运营视图。

## 8. 最终判定

| 产品模块 | 现有接口可上线 | 定位 |
| --- | --- | --- |
| Memory 信号健康概览 | 是 | Creator P0 |
| 信号覆盖图谱 | 是 | Creator P0 主图 |
| 关系与 Emotion 匿名分布 | 是 | Creator P0 辅助洞察 |
| 当前诊断与刷新建议 | 是 | Creator P0 |
| 单用户关系图谱 | 否 | 隐私边界禁止 |
| Memory 事实质量 | 否 | 缺 Creator 聚合接口 |
| 召回 / 写入运行链路 | 否 | 缺 Creator 运营指标 |
| 历史趋势与版本归因 | 否 | 缺快照和维度 |
| Creator 内容治理操作 | 否 | 缺授权管理接口 |
| 用户“我与 Agent” | 是 | 用户侧独立页面 |

现有接口下，Creator 产品应止于 **匿名信号观测与诊断**。如果产品必须提供事实治理、运行排障
或趋势分析，需要先补 Creator 聚合与管理合同，再进入 UI 设计。
