"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { RequireManagerPage } from "@/components/RequireManager";
import AgentForm from "@/components/AgentForm";
import { getAgent } from "@/lib/api";
import type { Agent } from "@/types";

export default function EditAgentPage() {
  const params = useParams<{ id: string }>();
  const [agent, setAgent] = useState<Agent | null>(null);

  useEffect(() => {
    getAgent(Number(params.id)).then(setAgent);
  }, [params.id]);

  if (!agent) return <p>Chargement…</p>;

  return (
    <RequireManagerPage>
      <AgentForm agent={agent} />
    </RequireManagerPage>
  );
}
