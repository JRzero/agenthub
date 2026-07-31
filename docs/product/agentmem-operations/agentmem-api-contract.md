# AgentMem Agent 聚合与用户 Memory Insights 接口

本文面向 AgentHub、用户端、测试 Agent 和其他 LinkYun 内部调用方。两类视图严格分离：

- AgentHub 查看一个 Agent 的整体关系与情绪聚合，不能查看单个 Memory。
- 当前登录用户查看自己与某个 Agent 对应的 Memory 关系与情绪，不能选择其他用户。

## 1. 接口边界

- 调用方只访问 LinkYun API，不直接访问 AgentMem。
- 使用 Creator `X-API-Key` 鉴权。
- Creator 只能查看自己直接创作的 Agent。
- Workspace 共享、知道 Agent ID 或属于同一 AgentMem Project 均不授予访问权限。
- 返回结果只有 Agent 级聚合指标和数据覆盖率。
- 不返回 binding UUID、Memory ID、Memory 名称、用户身份或任何单个 Memory 的分数。
- Agent 不存在和不属于当前 Creator 返回相同的 404，避免资源枚举。

以上三条只描述 AgentHub 聚合接口。用户 Insights 接口可以返回当前用户自己的单个 Memory
信号，但仍不返回 Memory/binding 标识或凭据。

基础地址：

```text
http://127.0.0.1:8080/api/v1
```

生产环境应替换为实际 LinkYun API 地址。

## 2. 鉴权

```http
X-API-Key: <creator-api-key>
Accept: application/json
```

不要向 AgentHub 或浏览器提供：

- `AGENTMEM_ADMIN_API_KEY`
- AgentMem Memory API-Key
- AgentMem Console JWT
- `X-Internal-API-Key`
- `X-Edge-Token`

## 3. 获取 Agent 聚合分析

```http
GET /api/v1/agents/{agent_id}/memory-analytics
```

### 3.1 Path 参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `agent_id` | uint64 | 是 | LinkYun Agent 数字 ID |

### 3.2 调用示例

```bash
curl -fsS \
  "$BASE_URL/agents/$AGENT_ID/memory-analytics" \
  -H "X-API-Key: $CREATOR_API_KEY"
```

接口没有 `user_id`、Memory ID、binding ID 或分页参数。

### 3.3 成功响应

```json
{
  "success": true,
  "data": {
    "agent_id": 9,
    "coverage": {
      "total_active_memories": 12,
      "relationship_available": 11,
      "relationship_unavailable": 1,
      "emotion_available": 10,
      "emotion_unavailable": 2
    },
    "relationship": {
      "stage_distribution": {
        "stranger": 1,
        "acquaintance": 6,
        "companion": 4
      },
      "average_affection": 0.47,
      "average_trust": 0.23,
      "average_familiarity": 1.54,
      "milestone_count": 8,
      "score_scales": {}
    },
    "emotion": {
      "status_distribution": {
        "ready": 9,
        "empty": 1
      },
      "state_distribution": {
        "normal": 7,
        "happy": 2,
        "tired": 1
      },
      "mood_distribution": {
        "平稳": 7,
        "积极": 2,
        "低唤醒": 1
      },
      "mean_valence": 0.35,
      "mean_arousal": 2.18,
      "sample_count": 46,
      "relationship_level": 0.52,
      "recent_affection": 1.86,
      "score_scales": {}
    },
    "partial": true
  }
}
```

## 4. 聚合口径

只统计该 Agent 当前 `active` 的 Memory binding。所有 binding、Memory 与用户标识仅在
LinkYun 后端内部使用。

### 4.1 Coverage

| 字段 | 说明 |
| --- | --- |
| `total_active_memories` | 参与本次分析的 active Memory 总数 |
| `relationship_available` | 成功取得 Relationship 的 Memory 数量 |
| `relationship_unavailable` | Relationship 不可用的 Memory 数量 |
| `emotion_available` | 成功取得 Emotion 的 Memory 数量 |
| `emotion_unavailable` | Emotion 不可用的 Memory 数量 |

当任一不可用数量大于 0 时，`partial=true`。调用方应继续展示已有聚合值，同时提示数据覆盖
不完整。

### 4.2 Relationship

| 字段 | 聚合方式 |
| --- | --- |
| `stage_distribution` | 按成功 Relationship 的 `stage` 计数 |
| `average_affection` | 成功 Relationship 的爱意算术平均值 |
| `average_trust` | 成功 Relationship 的信任度算术平均值 |
| `average_familiarity` | 成功 Relationship 的熟悉度算术平均值 |
| `milestone_count` | 所有成功 Relationship 的里程碑数量总和 |
| `score_scales` | AgentMem 分数量纲定义；调用方必须按此解释数值 |

没有任何 Relationship 可用时，整个 `relationship` 字段省略，而不是返回虚假的零分。

### 4.3 Emotion

| 字段 | 聚合方式 |
| --- | --- |
| `status_distribution` | 按 Emotion `status` 计数 |
| `state_distribution` | 按每个 Memory 当前并存状态计数；同一状态在一个 Memory 内只计一次 |
| `mood_distribution` | 按心境标签计数 |
| `mean_valence` | 按各 Memory `sample_count` 加权平均 |
| `mean_arousal` | 按各 Memory `sample_count` 加权平均 |
| `sample_count` | 所有成功 Emotion 的样本数总和 |
| `relationship_level` | 按 `sample_count` 加权的长期亲密信号 |
| `recent_affection` | 按 `sample_count` 加权的近期亲密表达 |
| `score_scales` | AgentMem 分数量纲定义 |

某个数值没有样本时返回 `null`。没有任何 Emotion 可用时，整个 `emotion` 字段省略。

Relationship 和 Emotion 只能用于运营分析、展示和低风险体验优化，不能用于医疗、心理诊断、
授权、信用或其他高风险决策。

## 5. 无数据与部分成功

### 5.1 Agent 尚无 active Memory

```json
{
  "success": true,
  "data": {
    "agent_id": 9,
    "coverage": {
      "total_active_memories": 0,
      "relationship_available": 0,
      "relationship_unavailable": 0,
      "emotion_available": 0,
      "emotion_unavailable": 0
    },
    "partial": false
  }
}
```

这表示当前没有可分析样本，不表示所有关系或情绪分数为零。

### 5.2 部分上游信号失败

Relationship 与 Emotion 对每个 Memory 独立读取。任一请求失败不会泄漏具体 Memory，也不会
使整个 Agent 分析失败。服务端返回已有聚合值，并通过 `coverage` 和 `partial` 表达完整度。

AgentHub 处理规则：

1. `partial=false`：正常展示聚合数据。
2. `partial=true`：展示已有数据，并显示覆盖率提示。
3. 缺失的 `relationship` 或 `emotion` 不得渲染成零分。
4. 不自动高频重试；运营页面建议 30–60 秒刷新一次。

## 6. 当前用户 Memory Insights

```http
GET /api/v1/user/agents/{agent_id}/memory-insights
```

该接口同样使用 Creator `X-API-Key`，但服务端会把当前认证账号映射为注册 User，再查询唯一的
`(current_user_id, agent_id)` active binding。请求不接受 `user_id`；即使 Query 或 Body 中
携带 `user_id` 也不会改变目标用户。

调用示例：

```bash
curl -fsS \
  "$BASE_URL/user/agents/$AGENT_ID/memory-insights" \
  -H "X-API-Key: $CREATOR_API_KEY"
```

成功响应：

```json
{
  "success": true,
  "data": {
    "agent_id": 9,
    "relationship": {
      "stage": "acquaintance",
      "stage_label": "相识",
      "affection": 0.47,
      "trust": 0.23,
      "familiarity": 1.54,
      "milestone_count": 2,
      "score_scales": {}
    },
    "emotion": {
      "status": "ready",
      "current": "normal",
      "state_label": "正常",
      "states": [
        "normal"
      ],
      "mood_label": "平稳",
      "mean_valence": 0,
      "mean_arousal": 2,
      "sample_count": 2,
      "relationship_level": 0.47,
      "recent_affection": 2,
      "score_scales": {}
    },
    "partial": false
  }
}
```

该响应中的 Relationship 和 Emotion 是当前用户自己的 Memory 数据，不是 Agent 聚合值。
Relationship 或 Emotion 单独失败时仍返回另一部分，并设置：

```json
{
  "partial": true,
  "unavailable": [
    "emotion"
  ]
}
```

用户接口仍禁止返回 `binding_uuid`、`memory_id`、Memory 名称、Key、消息正文和上游错误。
当前用户没有注册 User、没有该 Agent 的 binding，或 binding 非 active 时，统一返回
`404 AGENTMEM_USER_INSIGHTS_NOT_FOUND`。

## 7. HTTP 状态与稳定错误码

### 7.1 AgentHub 聚合接口

| HTTP | `error.code` | 场景 | 调用方行为 |
| --- | --- | --- | --- |
| 200 | - | 完整、部分成功或无样本 | 检查 `coverage` 和 `partial` |
| 400 | 空 | Agent ID 非法 | 修正请求，不重试 |
| 401 | 空 | 缺失或无效 Creator API Key | 重新鉴权 |
| 404 | `AGENTMEM_ANALYTICS_NOT_FOUND` | Agent 不存在或不属于当前 Creator | 展示无权限/不存在，不枚举资源 |
| 503 | `AGENTMEM_ANALYTICS_UNAVAILABLE` | AgentMem 功能未配置 | 稍后重试或隐藏分析模块 |
| 500 | 空 | LinkYun 内部查询失败 | 记录请求上下文，稍后重试 |

错误示例：

```json
{
  "success": false,
  "error": {
    "code": "AGENTMEM_ANALYTICS_NOT_FOUND",
    "message": "Agent memory analytics not found"
  }
}
```

### 7.2 用户 Memory Insights 接口

| HTTP | `error.code` | 场景 | 调用方行为 |
| --- | --- | --- | --- |
| 200 | - | 完整或部分成功 | 检查 `partial` |
| 400 | 空 | Agent ID 非法 | 修正请求 |
| 401 | 空 | 账号鉴权失败 | 重新鉴权 |
| 404 | `AGENTMEM_USER_INSIGHTS_NOT_FOUND` | 无注册 User、无 active pair binding | 展示尚无关系数据 |
| 503 | `AGENTMEM_USER_INSIGHTS_UNAVAILABLE` | AgentMem 未配置 | 稍后重试或隐藏模块 |
| 500 | 空 | LinkYun 内部查询失败 | 稍后重试 |

## 8. 隐私与安全保证

两类 API 响应均禁止包含：

- `binding_uuid`
- `memory_id`
- Memory display name 或 code
- `user_id`、用户 UUID、用户名或联系方式
- Memory API-Key、密文、nonce 或 Admin-Key
- Console Cookie/JWT
- 消息正文、召回正文或上游错误正文

AgentHub 聚合接口额外禁止单个 Memory 的 Relationship 或 Emotion 数值。用户接口仅能返回
认证账号自己的单个 Memory 信号。AgentHub 不应尝试从聚合分布或样本数反推单个用户。

## 9. 缓存与性能

- 服务端内部扫描 active Memory，但只返回一次 Agent 聚合。
- 默认最多并发处理 4 个 Memory；每个 Memory 的 Relationship 和 Emotion 并发读取。
- 归一化信号默认在 Redis 缓存 45 秒。
- 缓存值不包含 Memory ID、Memory 名称、用户身份、Key 或上游错误正文。
- AgentHub 不需要也不能缓存单个 Memory 数据。
- 用户 Insights 与 Agent 聚合复用相同的内部归一化信号缓存。

## 10. 与 AgentMem 上游接口的映射

以下调用只发生在 LinkYun 后端：

| LinkYun 内部能力 | AgentMem 上游接口 | 上游鉴权 |
| --- | --- | --- |
| 聚合 Relationship | `GET /v1/memory/relationship` | 每个 binding 的 `X-Memory-API-Key` |
| 聚合 Emotion | `GET /v1/memory/emotion` | 每个 binding 的 `X-Memory-API-Key` |
| 对话前召回 | `POST /v1/memory/query` | 每个 binding 的 `X-Memory-API-Key` |
| 对话后写入 | `POST /v1/memory/add` | 每个 binding 的 `X-Memory-API-Key` |
| 异步任务轮询 | `GET /v1/tasks/{task_id}` | 每个 binding 的 `X-Memory-API-Key` |
| 事实分页 | `GET /v1/memories` | 每个 binding 的 `X-Memory-API-Key` |
| 事实详情 | `GET /v1/memories/{fact_id}` | 每个 binding 的 `X-Memory-API-Key` |
| 事实修正 | `PATCH /v1/memories/{fact_id}` | 每个 binding 的 `X-Memory-API-Key` |
| 事实软删除 | `DELETE /v1/memories/{fact_id}` | 每个 binding 的 `X-Memory-API-Key` |
| 事实/历史导入 | `POST /v1/memories/import` | 每个 binding 的 `X-Memory-API-Key` |
| 整库抹除 | `DELETE /v1/memory/memories` | 每个 binding 的 `X-Memory-API-Key` |
| 浅健康检查 | `GET /health` | 无 |
| Memory 容器生命周期 | `/v1/admin/memories...` | 项目 Admin-Key |

Relationship、Emotion 和召回请求不使用项目 Admin-Key，也不使用 Console JWT。

## 11. 系统级召回参数

召回策略当前只允许系统配置，AgentHub 和 Creator API 不能覆盖：

| 环境变量 | 默认值 | 说明 |
| --- | --- | --- |
| `AGENTMEM_TOP_K` | `6` | 图层召回预算 |
| `AGENTMEM_RETRIEVAL_POLICY` | `balanced` | `balanced`、`empathy` 或 `repair` |
| `AGENTMEM_MIN_SIMILARITY` | `0.08` | 事实相关性下限，范围 `0..1` |
| `AGENTMEM_RETRIEVAL_LAYERS` | `graph,fact` | 允许的召回层 |
| `AGENTMEM_QUERY_TIMEOUT` | `800ms` | 单次召回截止时间；部署时应按实测延迟调整 |

LinkYun 固定发送 `include_superseded=false` 和 `debug=false`，同时传递 Session UUID。

配置表展示代码默认值。2026-07-31 测试环境使用 `2500ms` 完成 10 轮 primary 召回，
实测平均 `478ms`、最大 `582ms`；`2500ms` 只是故障/长尾情况下的上限。初期 canary
建议保留该值，取得持续 p95/p99 后可评估调整为 `2000ms`。

## 12. 当前召回模式

- `local`：只使用 LinkYun 本地记忆。
- `shadow`：调用 AgentMem query/relationship/emotion，但不把远端召回上下文注入 LLM。
- `agentmem` primary：AgentMem `0.2.0` facts 合同验证后可显式配置。active binding 的远端
  query 成功时只注入一个 AgentMem 不可信数据片段；超时、失败、空结果或 binding 尚未
  active 时回退本地显式记忆，不重复注入本地片段。

全局默认仍为 `local`；启用 primary 前应先完成 shadow、backfill、延迟和 fallback 验证。
当前测试环境已完成 facts CRUD/import、10 轮 primary、shadow 隔离和超时 fallback 验证；
生产环境仍须独立执行 backfill 与 canary gate。

## 13. 推荐调用流程

### 13.1 AgentHub

```text
Creator 打开 Agent 运营页
  -> 使用 Creator X-API-Key 请求 /agents/{agent_id}/memory-analytics
  -> 根据 coverage 判断样本规模和完整度
  -> 渲染 Agent 总体关系、阶段分布、情绪分布和加权心境
  -> partial=true 时显示覆盖率提示
  -> 30–60 秒后再刷新
```

### 13.2 用户端

```text
当前用户打开与某个 Agent 的关系/记忆页
  -> 使用当前账号的 X-API-Key 请求 /user/agents/{agent_id}/memory-insights
  -> 渲染该用户自己的关系阶段、纽带和情绪
  -> partial=true 时只隐藏 unavailable 对应模块
  -> 404 时展示“互动后生成关系数据”
```
