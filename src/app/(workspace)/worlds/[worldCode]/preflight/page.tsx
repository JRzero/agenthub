"use client";
import { useParams } from "next/navigation";
import { PreflightWorkspace } from "@/modules/living-worlds/detail-workspaces";
export default function Page() { const { worldCode } = useParams<{ worldCode: string }>(); return <PreflightWorkspace worldCode={worldCode} />; }
