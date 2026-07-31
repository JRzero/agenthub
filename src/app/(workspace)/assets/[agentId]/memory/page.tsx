"use client";

import { useParams } from "next/navigation";
import { MemoryOperationsWorkspace } from "@/modules/agent-memory-operations/memory-operations-workspace";

export default function AgentMemoryOperationsPage() {
  const params = useParams<{ agentId: string }>();
  const agentId = Number(params.agentId);

  return (
    <MemoryOperationsWorkspace
      agentId={Number.isFinite(agentId) ? agentId : 0}
    />
  );
}
