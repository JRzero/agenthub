"use client";
import { useParams } from "next/navigation";
import { InvitationDecisionWorkspace } from "@/modules/living-worlds/detail-workspaces";
export default function Page() { const { invitationCode } = useParams<{ invitationCode: string }>(); return <InvitationDecisionWorkspace invitationCode={invitationCode} />; }
