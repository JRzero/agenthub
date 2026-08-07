import { notFound } from "next/navigation";
import { GovernanceWorkspace, type GovernanceArea } from "@/modules/governance/governance-workspace";

export default async function GovernanceAreaPage({ params }: { params: Promise<{ area: string }> }) {
  const { area } = await params;
  if (area !== "roles" && area !== "safety") notFound();
  return <GovernanceWorkspace area={area as GovernanceArea} />;
}
