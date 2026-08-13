"use client";
import { useParams } from "next/navigation";
import { ScheduleWorkspace } from "@/modules/living-worlds/detail-workspaces";
export default function Page() { const { worldCode } = useParams<{ worldCode: string }>(); return <ScheduleWorkspace worldCode={worldCode} />; }
