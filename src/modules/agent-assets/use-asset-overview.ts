"use client";

import { useMemo } from "react";
import { DATA_MODE, capabilitySource } from "@/config/capabilities";
import { DEMO_ACTIVITIES, DEMO_ADAPTERS } from "@/fixtures/demo-data";
import { useAgent } from "@/modules/agents/queries";
import { mapAgentToAssetOverview } from "./model";

export function useAssetOverview(agentId: number | null) {
  const query = useAgent(agentId);
  const overview = useMemo(() => {
    if (!query.data) return null;
    const demo = DATA_MODE === "demo";
    return mapAgentToAssetOverview(query.data, {
      adapters: demo ? DEMO_ADAPTERS : [],
      activities: demo ? DEMO_ACTIVITIES : [],
      adapterSource: capabilitySource("clientAdapters"),
      completenessOverride: demo ? 82 : undefined,
    });
  }, [query.data]);

  return { ...query, overview };
}
