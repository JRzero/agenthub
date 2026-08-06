"use client";
import { useParams } from "next/navigation";
import { EventCardsWorkspace } from "@/modules/living-worlds/detail-workspaces";
export default function Page() { const { worldCode } = useParams<{ worldCode: string }>(); return <EventCardsWorkspace worldCode={worldCode} />; }
