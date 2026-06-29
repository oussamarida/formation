"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getAgent } from "@/lib/api";
import type { Agent } from "@/types";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RequireManager from "@/components/RequireManager";

export default function AgentDetailPage() {
  const params = useParams<{ id: string }>();
  const [agent, setAgent] = useState<Agent | null>(null);

  useEffect(() => {
    getAgent(Number(params.id)).then(setAgent);
  }, [params.id]);

  if (!agent) return <p>Chargement…</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{agent.nom}</h1>
        <div className="flex gap-2">
          <Link href={`/agents/${agent.id}/conges`} className={buttonVariants({ variant: "outline" })}>
            Congés
          </Link>
          <RequireManager>
            <Link href={`/agents/${agent.id}/edit`} className={buttonVariants()}>
              Modifier
            </Link>
          </RequireManager>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détails</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>Matricule: {agent.matricule}</p>
          <p>
            Département:{" "}
            {agent.departement ? <Badge variant="outline">{agent.departement.code}</Badge> : "—"}
          </p>
          <p>Congés: {agent.conges.length}</p>
        </CardContent>
      </Card>
    </div>
  );
}
