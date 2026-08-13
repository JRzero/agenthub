import { WorldGovernanceWorkspace } from "@/modules/living-worlds/runtime-workspaces";

export default async function Page({ params }: { params: Promise<{ worldCode: string }> }) { const { worldCode } = await params; return <WorldGovernanceWorkspace worldCode={worldCode} />; }
