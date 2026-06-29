"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { getAgents, deleteAgent } from "@/lib/api";
import type { Agent } from "@/types";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RequireManager from "@/components/RequireManager";
import { useAuth, useIsManager } from "@/hooks/useAuth";

export default function AgentsList() {
  const user = useAuth();
  const isManager = useIsManager();
  const searchParams = useSearchParams();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(searchParams.get("departement") ?? "all");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getAgents(filter === "all" ? undefined : filter);
        setAgents(data);
      } catch {
        toast.error("Impossible de charger les agents");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [filter]);

  async function handleDelete(id: number) {
    if (!isManager) return;
    if (!confirm("Supprimer cet agent ?")) return;
    try {
      await deleteAgent(id);
      setAgents((prev) => prev.filter((agent) => agent.id !== id));
      toast.success("Agent supprimé");
    } catch {
      toast.error("Échec de la suppression");
    }
  }

  if (!user || loading) return <p>Chargement des agents…</p>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Agents</h1>
          <p className="text-sm text-muted-foreground">
            Connecté en tant que {user.sub} ({user.role})
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={(value) => setFilter(value ?? "all")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Département" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="DRH">DRH</SelectItem>
              <SelectItem value="DSI">DSI</SelectItem>
              <SelectItem value="DAF">DAF</SelectItem>
            </SelectContent>
          </Select>
          <RequireManager>
            <Link href="/agents/new" className={buttonVariants()}>
              Nouvel agent
            </Link>
          </RequireManager>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Matricule</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Département</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.map((agent) => (
            <TableRow key={agent.id}>
              <TableCell>{agent.id}</TableCell>
              <TableCell>{agent.matricule}</TableCell>
              <TableCell>{agent.nom}</TableCell>
              <TableCell>
                {agent.departement ? (
                  <Badge variant="outline">{agent.departement.code}</Badge>
                ) : (
                  "—"
                )}
              </TableCell>
              <TableCell className="space-x-2 text-right">
                <Link href={`/agents/${agent.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                  Voir
                </Link>
                <Link href={`/agents/${agent.id}/conges`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                  Congés
                </Link>
                <RequireManager>
                  <Link href={`/agents/${agent.id}/edit`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                    Modifier
                  </Link>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(agent.id)}>
                    Supprimer
                  </Button>
                </RequireManager>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
