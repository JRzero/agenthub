"use client";
import { useParams } from "next/navigation";
import { WorldEditorWorkspace } from "@/modules/living-worlds/detail-workspaces";
export default function Page() { const { worldCode } = useParams<{ worldCode: string }>(); return <WorldEditorWorkspace worldCode={worldCode} />; }
