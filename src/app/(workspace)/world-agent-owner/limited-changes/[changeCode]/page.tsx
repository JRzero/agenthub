import { AgentOwnerLimitedChangeWorkspace } from "@/modules/living-worlds/runtime-workspaces";

export default async function Page({ params }: { params: Promise<{ changeCode: string }> }) { const { changeCode } = await params; return <AgentOwnerLimitedChangeWorkspace changeCode={changeCode} />; }
