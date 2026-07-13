import type { SessionMessage, SharedSessionRow } from "./types";

export const DEMO_SHARED_SESSIONS: SharedSessionRow[] = [
  { session: { id: 1842, uuid: "session-1842", title: "职业信息更新", status: "active", source: "oyiioyii", message_count: 18, total_tokens: 1284, verified: false, created_at: "2026-07-10T09:41:00+08:00", updated_at: "2026-07-10T10:24:00+08:00", last_message_at: "2026-07-10T10:24:00+08:00" }, agent: { id: 32, uuid: "agent-32", name: "林月", code: "lin-yue", avatar: "/images/lin-yue-avatar.png", agent_type: "cloud", online: true }, human: { id: 72, uuid: "human-72", username: "user_a7f2", display_name: "用户 A7F2", avatar: "" } },
  { session: { id: 1838, uuid: "session-1838", title: "品牌反馈", status: "review", source: "web-chat", message_count: 11, total_tokens: 860, verified: true, created_at: "2026-07-10T09:20:00+08:00", updated_at: "2026-07-10T09:58:00+08:00", last_message_at: "2026-07-10T09:58:00+08:00" }, agent: { id: 19, uuid: "agent-19", name: "知识向导", code: "knowledge-guide", avatar: "", agent_type: "cloud", online: true }, human: { id: 38, uuid: "human-38", username: "user_k3m8", display_name: "用户 K3M8", avatar: "" } },
  { session: { id: 1829, uuid: "session-1829", title: "知识库问答", status: "active", source: "api", message_count: 7, total_tokens: 540, verified: false, created_at: "2026-07-10T08:47:00+08:00", updated_at: "2026-07-10T09:41:00+08:00", last_message_at: "2026-07-10T09:41:00+08:00" }, agent: { id: 19, uuid: "agent-19", name: "知识向导", code: "knowledge-guide", avatar: "", agent_type: "cloud", online: true }, human: { id: 91, uuid: "human-91", username: "user_p9q1", display_name: "用户 P9Q1", avatar: "" } },
];

export const DEMO_MESSAGES: Record<number, SessionMessage[]> = {
  1842: [
    { id: 1, uuid: "m1", session_id: 1842, role: "user", content: "帮我更新一下我的职业信息：我现在是一名产品经理，主要负责 AI 产品的规划。", content_type: "text", created_at: "2026-07-10T09:41:00+08:00" },
    { id: 2, uuid: "m2", session_id: 1842, role: "assistant", content: "好的，我会将你的职业信息更新为产品经理，负责 AI 产品规划。", content_type: "text", created_at: "2026-07-10T09:42:00+08:00", sender_agent_id: 32, sender_name: "林月" },
    { id: 3, uuid: "m3", session_id: 1842, role: "user", content: "另外，把我常用的邮箱改成 linyue@xxx.com。", content_type: "text", created_at: "2026-07-10T09:42:30+08:00" },
    { id: 4, uuid: "m4", session_id: 1842, role: "assistant", content: "已为你更新邮箱信息。", content_type: "text", created_at: "2026-07-10T09:43:00+08:00", sender_agent_id: 32, sender_name: "林月" },
  ],
  1838: [{ id: 5, uuid: "m5", session_id: 1838, role: "user", content: "感谢你的反馈，我们已经记录。", content_type: "text", created_at: "2026-07-10T09:58:00+08:00" }],
  1829: [{ id: 6, uuid: "m6", session_id: 1829, role: "assistant", content: "检索结果已返回。", content_type: "text", created_at: "2026-07-10T09:41:00+08:00" }],
};
