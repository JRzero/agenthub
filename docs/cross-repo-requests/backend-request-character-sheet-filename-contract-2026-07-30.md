# 后端请求：修复角色设定稿文件名与公开读取接口不兼容

## 背景

AgentHub 在角色设定稿保存成功后，通过以下公开接口展示已保存图片：

```http
GET /api/v1/character-sheets/{filename}
```

2026-07-30 本地联调发现，Agent `909` 保存成功后的元数据为：

```text
config.metadata.character_design_sheet =
sheet_909_1785374198763157000.png
```

对应文件已存在于：

```text
data/character_sheets/sheet_909_1785374198763157000.png
```

但读取接口返回 `404 Not Found`。

## 根因

保存服务生成的文件名包含两个下划线：

```go
filename := fmt.Sprintf("sheet_%d_%d%s", agent.ID, time.Now().UnixNano(), ext)
```

公开读取接口当前校验规则不允许 `sheet_` 之后再次出现下划线：

```go
regexp.MustCompile(`(?i)^sheet_[a-z0-9-]+\.(jpe?g|png|webp)$`)
```

因此保存端生成的合法文件无法通过读取端校验。

## 请求调整

请统一保存与读取契约，并兼容已经写入数据库的历史文件名。建议读取端允许安全的下划线：

```go
regexp.MustCompile(`(?i)^sheet_[a-z0-9_-]+\.(jpe?g|png|webp)$`)
```

仍需保留现有路径穿越防护，禁止 `/`、`\` 和 `..`。

## 验收标准

1. `POST /api/v1/agents/{id}/character-design/save` 保存后返回的 `character_design_sheet` 可立即通过公开读取接口访问。
2. 现有 `sheet_{agentID}_{timestamp}.{ext}` 文件返回 `200` 和正确的图片 `Content-Type`。
3. 历史 UUID 文件名继续可访问。
4. 包含路径分隔符、`..` 或不支持扩展名的请求仍返回 `404`。
5. 增加覆盖“保存生成文件名 → 公开读取成功”的后端回归测试。

