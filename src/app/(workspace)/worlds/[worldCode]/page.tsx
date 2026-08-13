"use client";
import { useParams } from "next/navigation";
import { WorldConsoleWorkspace } from "@/modules/living-worlds/detail-workspaces";
export default function Page() { const { worldCode } = useParams<{ worldCode: string }>(); return <WorldConsoleWorkspace worldCode={worldCode} />; }
