import { AgentOwnerBindingWorkspace } from "@/modules/living-worlds/runtime-workspaces";

export default async function Page({ params }: { params: Promise<{ participantCode: string }> }) { const { participantCode } = await params; return <AgentOwnerBindingWorkspace participantCode={participantCode} />; }
